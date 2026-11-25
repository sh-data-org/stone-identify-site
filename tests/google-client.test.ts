import * as socialCampaign from '../src/features/analytics/social-campaign';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createContext, runInContext } from 'node:vm';
import ts from 'typescript';
import * as interaction from '../src/features/analytics/interaction';
import * as google from '../src/features/analytics/google';
import * as acquisition from '../src/features/analytics/acquisition';
import * as articleContext from '../src/features/analytics/article-context';
import * as aiReferral from '../src/features/analytics/ai-referral';

const client = ts.transpileModule(
  readFileSync(new URL('../src/features/analytics/google-client.ts', import.meta.url), 'utf8'),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } },
).outputText;

type Listener = (event: { target?: TestElement }) => void;

class TestElement {
  hidden = false;
  textContent = '';
  content = '';
  tagName = '';
  region = 'main';
  peers: TestElement[] = [];
  href = '';
  dataset: Record<string, string> = {};
  listeners = new Map<string, Listener>();
  children = new Map<string, TestElement>();

  querySelector(selector: string) {
    return this.children.get(selector) ?? null;
  }

  addEventListener(name: string, listener: Listener) {
    this.listeners.set(name, listener);
  }

  closest(selector: string): TestElement | null {
    if (selector === 'a[href]') return this.href ? this : null;
    if (selector.includes('input[type="submit"]') || selector === this.region) return this;
    return null;
  }

  querySelectorAll() {
    return [...this.peers, this];
  }

  click(target?: TestElement) {
    this.listeners.get('click')?.({ target });
  }
}

function storage(initial: Record<string, string> = {}, unavailable = false) {
  const values = new Map(Object.entries(initial));
  return {
    values,
    getItem(key: string) {
      if (unavailable) throw new Error('Storage unavailable');
      return values.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (unavailable) throw new Error('Storage unavailable');
      values.set(key, value);
    },
    removeItem(key: string) {
      if (unavailable) throw new Error('Storage unavailable');
      values.delete(key);
    },
  };
}

function visit(
  options: {
    url?: string;
    referrer?: string;
    title?: string;
    consent?: string;
    session?: Record<string, string>;
    unavailableStorage?: boolean;
  } = {},
) {
  const document = new TestElement();
  const pathList = new TestElement();
  pathList.content =
    '/ /apps/ /jewelry/ /go/ /app/ /guides/ /comparisons/quartz-vs-calcite/ /guides/magnetic-rock-identification/';
  document.children.set('meta[name="stone-public-paths"]', pathList);
  const container = new TestElement();
  const accept = new TestElement();
  const reject = new TestElement();
  const status = new TestElement();
  container.dataset.measurementId = acquisition.acquisition.measurementId;
  container.children.set('[data-analytics-panel]', new TestElement());
  container.children.set('[data-analytics-accept]', accept);
  container.children.set('[data-analytics-reject]', reject);
  container.children.set('[role="status"]', status);
  const commands: unknown[][] = [];
  const scripts: TestElement[] = [];
  const session = storage(options.session, options.unavailableStorage);
  const local = storage(options.consent ? { 'stone-analytics-consent': options.consent } : {});
  const imports: Record<string, unknown> = {
    './social-campaign': socialCampaign,
    './google': google,
    './interaction': interaction,
    './acquisition': acquisition,
    './article-context': articleContext,
    './ai-referral': aiReferral,
  };
  const url = new URL(options.url ?? 'https://stoneidentify.app/app/?utm_source=chatgpt.com');
  const sandbox = createContext({
    URL,
    Date,
    Element: TestElement,
    exports: {},
    require(name: string) {
      assert(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    },
    location: { origin: url.origin, pathname: url.pathname, href: url.href, reload() {} },
    document: Object.assign(document, {
      title: options.title ?? 'Stone Identifier App',
      referrer: options.referrer ?? '',
      createElement: () => new TestElement(),
      head: { appendChild: (script: TestElement) => scripts.push(script) },
    }),
    window: {
      addEventListener() {},
      dataLayer: { push: (command: IArguments) => commands.push([...command]) },
    },
    localStorage: local,
    sessionStorage: session,
    container,
  });
  runInContext(`${client}\nexports.setupGoogleAnalytics(container);`, sandbox);
  function storeClick() {
    const link = new TestElement();
    link.href = acquisition.appStoreUrl();
    link.dataset.appPlacement = 'hero';
    document.click(link);
  }
  return { document, commands, scripts, session, container, accept, reject, status, storeClick };
}

function parameters(command: unknown[] | undefined): Record<string, unknown> {
  const result: unknown = command?.[2];
  assert(result && typeof result === 'object');
  return Object.fromEntries(Object.entries(result));
}

test('names home, legacy directories, articles and missing pages on direct entry', () => {
  const title = 'Quartz vs. Calcite';
  for (const [path, expected] of [
    ['/', 'Home – Rock Identification'],
    ['/apps/', 'Apps – Guide Directory'],
    ['/jewelry/', 'Jewelry – Guide Directory'],
    ['/comparisons/quartz-vs-calcite/', title],
    ['/private-or-unknown/', 'Page Not Found'],
  ]) {
    const page = visit({ url: 'https://stoneidentify.app' + path, title });
    page.accept.click();
    const view = page.commands.find(([, name]) => name === 'page_view');
    assert.equal(parameters(view).page_title, expected);
  }
});

test('no analytics or attribution storage before consent or after rejection', () => {
  const page = visit();
  page.storeClick();
  assert.equal(page.commands.length, 0);
  assert.equal(page.scripts.length, 0);
  assert.equal(page.session.values.size, 0);
  page.reject.click();
  page.storeClick();
  assert.equal(page.commands.length, 0);
  assert.equal(page.session.values.size, 0);
});

test('a consented Google landing keeps the search origin and records one store tap', () => {
  const path = '/guides/magnetic-rock-identification/';
  const url = 'https://stoneidentify.app' + path;
  const title = 'How to Identify Magnetic Rocks With Photos';
  const page = visit({ url, title, referrer: 'https://www.google.com/search?q=private' });
  page.storeClick();
  assert.equal(page.commands.length, 0);
  assert.equal(page.scripts.length, 0);

  page.accept.click();
  page.storeClick();
  const events = page.commands.filter(([type]) => type === 'event');
  assert.deepEqual(events.map(([, name]) => name), ['page_view', 'app_store_click']);
  assert.equal(parameters(events[0]).page_referrer, 'https://www.google.com');
  assert.equal(parameters(events[0]).page_location, url);
  assert.equal(parameters(events[0]).page_title, title);
  assert.equal(parameters(events[1]).page_path, path);
  assert.equal(parameters(events[1]).app_platform, 'ios');
  assert.doesNotMatch(JSON.stringify(page.commands), /private/);
});

test('consented page views and store clicks carry AI source without raw query strings', () => {
  const page = visit({
    url: 'https://stoneidentify.app/app/?utm_source=chatgpt.com&email=private#secret',
  });
  page.accept.click();
  const config = parameters(page.commands.find(([type]) => type === 'config'));
  assert.equal(config.ai_source, 'chatgpt.com');
  assert.equal(config.page_location, 'https://stoneidentify.app/app/');
  assert.equal(config.campaign_source, 'chatgpt.com');
  assert.equal(page.scripts.length, 1);
  page.storeClick();
  const click = parameters(page.commands.find(([, name]) => name === 'app_store_click'));
  assert.equal(click.ai_source, 'chatgpt.com');
  assert.equal(click.ai_landing_page, '/app/');
  assert.equal(click.app_platform, 'ios');
  assert.equal(JSON.stringify(page.commands).includes('private'), false);
  page.reject.click();
  const commandCount = page.commands.length;
  page.storeClick();
  assert.equal(page.commands.length, commandCount);
  assert.equal(page.session.values.has(aiReferral.aiReferralKey), false);
});

test('desktop chooser keeps AI landing context alongside its existing store click event', () => {
  const landing = visit({ consent: 'granted' });
  const chooser = visit({
    url: 'https://stoneidentify.app/go/',
    referrer: 'https://stoneidentify.app/app/',
    consent: 'granted',
    session: Object.fromEntries(landing.session.values),
  });
  chooser.storeClick();
  const click = parameters(chooser.commands.find(([, name]) => name === 'app_store_click'));
  assert.equal(click.ai_source, 'chatgpt.com');
  assert.equal(click.ai_landing_page, '/app/');
  assert.equal(click.page_path, '/go/');
  const config = parameters(chooser.commands.find(([type]) => type === 'config'));
  assert.equal(config.campaign_source, undefined);
});

test('blocked session storage still allows accurate attribution on the entry page', () => {
  const page = visit({ consent: 'granted', unavailableStorage: true });
  page.storeClick();
  assert.equal(
    parameters(page.commands.find(([, name]) => name === 'app_store_click')).ai_source,
    'chatgpt.com',
  );
  assert.match(page.status.textContent, /could not preserve referral/);
});

test('local previews cannot send analytics even with saved consent', () => {
  const page = visit({
    url: 'http://127.0.0.1:4173/app/?utm_source=chatgpt.com',
    consent: 'granted',
  });
  page.accept.click();
  page.storeClick();
  assert.equal(page.container.hidden, true);
  assert.equal(page.scripts.length, 0);
  assert.equal(page.commands.length, 0);
});

test('navigation and specialized clicks are emitted once in order with safe destinations', () => {
  const page = visit({ consent: 'granted', referrer: 'https://stoneidentify.app/guides/?secret' });
  const link = new TestElement();
  link.href = 'https://stoneidentify.app/go/?private#detail';
  link.peers.push(new TestElement());
  page.document.click(link);
  page.storeClick();
  const external = new TestElement();
  external.href = 'https://elsewhere.example/private';
  page.document.click(external);
  const preferences = new TestElement();
  preferences.region = '#google-analytics';
  page.document.click(preferences);
  const events = page.commands.filter(([type]) => type === 'event');
  assert.deepEqual(
    events.map((event) => event[1]),
    ['page_view', 'site_click', 'app_store_click', 'site_click'],
  );
  assert.equal(parameters(page.commands.find(([type]) => type === 'config')).send_page_view, false);
  assert.equal(parameters(events[0]).page_referrer, 'https://stoneidentify.app/guides/');
  assert.equal(parameters(events[1]).control_position, '2');
  assert.equal(parameters(events[1]).click_region, 'main');
  assert.equal(parameters(events[1]).click_destination, '/go/');
  assert.equal(parameters(events[2]).click_destination, 'app_store');
  assert.equal(parameters(events[3]).click_destination, 'external_link');
  assert.doesNotMatch(JSON.stringify(events), /private|secret|elsewhere/);
});

test('unrecognized paths cannot leak into page or AI landing fields', () => {
  const page = visit({
    consent: 'granted',
    url: 'https://stoneidentify.app/private/?utm_source=chatgpt.com',
  });
  assert.equal(
    parameters(page.commands.find(([, name]) => name === 'page_view')).page_path,
    '/404',
  );
  assert.doesNotMatch(JSON.stringify(page.commands), /private/);
});

test('consented social landing preserves campaign attribution and counts one store click', () => {
  const page = visit({
    url: 'https://stoneidentify.app/comparisons/quartz-vs-calcite/?utm_source=facebook&utm_medium=social&utm_campaign=stone-comparison&utm_content=clue-first&private=excluded',
  });
  page.storeClick();
  assert.equal(page.commands.length, 0);
  page.accept.click();
  page.storeClick();
  const config = parameters(page.commands.find(([type]) => type === 'config'));
  assert.equal(config.page_location, 'https://stoneidentify.app/comparisons/quartz-vs-calcite/');
  const clicks = page.commands.filter(([, name]) => name === 'app_store_click');
  assert.equal(clicks.length, 1);
  assert.equal(parameters(clicks[0]).app_platform, 'ios');
  assert.equal(config.campaign_source, 'facebook');
  assert.equal(config.campaign_medium, 'social');
  assert.equal(config.campaign_name, 'stone-comparison');
  assert.equal(config.campaign_content, 'clue-first');
  assert.equal(JSON.stringify(page.commands).includes('excluded'), false);
});
