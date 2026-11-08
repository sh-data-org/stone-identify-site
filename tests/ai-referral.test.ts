import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  aiCampaignParameters,
  aiReferralParameters,
  resolveAiReferral,
} from '../src/features/analytics/ai-referral';

const site = 'https://stoneidentify.app';
const landing = new URL(`${site}/guides/how-to-identify-agate/?utm_source=chatgpt.com`);
const now = 1_800_000;
const context = resolveAiReferral(landing, '', null, now);
const stored = JSON.stringify(context);

test('ChatGPT tags survive query stripping without retaining prompts or arbitrary parameters', () => {
  const url = new URL(`${landing}&email=person@example.com&prompt=private#conversation`);
  assert.deepEqual(resolveAiReferral(url, '', null, now), {
    ai_source: 'chatgpt.com',
    ai_landing_page: '/guides/how-to-identify-agate/',
    updatedAt: now,
  });
  assert.deepEqual(aiCampaignParameters(url, ''), {
    campaign_source: 'chatgpt.com',
    campaign_medium: 'referral',
  });
});

test('recognized assistant referrers and legacy ChatGPT hosts normalize to exact sources', () => {
  for (const host of [
    'chatgpt.com',
    'perplexity.ai',
    'claude.ai',
    'gemini.google.com',
    'copilot.microsoft.com',
    'grok.com',
    'you.com',
  ]) {
    const result = resolveAiReferral(
      new URL(`${site}/app/`),
      `https://${host}/private?q=secret`,
      null,
      now,
    );
    assert.equal(result?.ai_source, host);
  }
  assert.equal(
    resolveAiReferral(new URL(`${site}/app/`), 'https://chat.openai.com/c/private', null, now)
      ?.ai_source,
    'chatgpt.com',
  );
});

test('referrals survive guide to app to desktop chooser navigation without new campaigns', () => {
  const app = new URL(`${site}/app/`);
  const continued = resolveAiReferral(app, landing.href, stored, now + 10);
  const chooser = resolveAiReferral(
    new URL(`${site}/go/`),
    app.href,
    JSON.stringify(continued),
    now + 20,
  );
  assert.deepEqual(aiReferralParameters(chooser), {
    ai_source: 'chatgpt.com',
    ai_landing_page: landing.pathname,
  });
  assert.deepEqual(aiCampaignParameters(app, landing.href), {});
});

test('new direct visits, non-AI campaigns and other referrers do not inherit AI attribution', () => {
  for (const referrer of ['', 'https://google.com/search?q=rock', 'https://bing.com/', 'invalid']) {
    assert.equal(resolveAiReferral(new URL(`${site}/app/`), referrer, stored, now), null);
  }
  assert.equal(
    resolveAiReferral(new URL(`${site}/app/?utm_source=newsletter`), landing.href, stored, now),
    null,
  );
  assert.equal(
    resolveAiReferral(
      new URL(`${site}/app/?utm_source=newsletter`),
      'https://chatgpt.com/',
      stored,
      now,
    ),
    null,
  );
});

test('spoofed hosts and unrelated OpenAI, Google or Microsoft sites are not AI referrals', () => {
  for (const host of [
    'chatgpt.com.evil.test',
    'notchatgpt.com',
    'openai.com',
    'google.com',
    'bing.com',
    'microsoft.com',
  ]) {
    assert.equal(resolveAiReferral(new URL(`${site}/app/`), `https://${host}`, null, now), null);
    assert.equal(
      resolveAiReferral(new URL(`${site}/app/?utm_source=${host}`), '', null, now),
      null,
    );
  }
});

test('new AI arrivals replace previous attribution', () => {
  const result = resolveAiReferral(new URL(`${site}/app/`), 'https://perplexity.ai/', stored, now);
  assert.equal(result?.ai_source, 'perplexity.ai');
  assert.equal(result?.ai_landing_page, '/app/');
});

test('expired, future, corrupt and private stored context is rejected', () => {
  for (const value of [
    null,
    '{',
    'null',
    '{}',
    JSON.stringify({ ...context, updatedAt: now - 1_800_000 }),
    JSON.stringify({ ...context, updatedAt: now + 1 }),
    JSON.stringify({ ...context, ai_source: 'person@example.com' }),
    JSON.stringify({ ...context, ai_landing_page: '/app/?email=person@example.com' }),
  ]) {
    assert.equal(resolveAiReferral(new URL(`${site}/app/`), landing.href, value, now), null);
  }
});
