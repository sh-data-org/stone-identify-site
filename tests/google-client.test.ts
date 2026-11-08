import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { createContext, runInContext } from 'node:vm';
import ts from 'typescript';
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

  closest() {
    return this.href ? this : null;
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
    consent?: string;
    session?: Record<string, string>;
    unavailableStorage?: boolean;
  } = {},
) {
  const document = new TestElement();
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
    './google': google,
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
      referrer: options.referrer ?? '',
      createElement: () => new TestElement(),
      head: { appendChild: (script: TestElement) => scripts.push(script) },
    }),
    window: { dataLayer: { push: (command: IArguments) => commands.push([...command]) } },
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
  return { commands, scripts, session, container, accept, reject, status, storeClick };
}

function parameters(command: unknown[] | undefined): Record<string, unknown> {
  const result: unknown = command?.[2];
  assert(result && typeof result === 'object');
  return Object.fromEntries(Object.entries(result));
}

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
