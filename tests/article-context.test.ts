import { test } from 'node:test';
import assert from 'node:assert/strict';
import { downloadArticleContext } from '../src/features/analytics/article-context';

const now = 1_800_000;
const source = 'https://stoneidentify.app/guides/conglomerate-rock/';
const chooser = new URL('https://stoneidentify.app/go/');
const context = {
  article_id: '85a88c4a-157b-4dc8-a9fb-9a9f721af500',
  article_cluster: 'sedimentary-rocks',
  source_page_path: '/guides/conglomerate-rock/',
  createdAt: now,
};

test('chooser clicks retain the originating article without reclassifying the chooser page', () => {
  assert.deepEqual(downloadArticleContext(JSON.stringify(context), chooser, source, now), {
    article_id: context.article_id,
    article_cluster: context.article_cluster,
    source_page_path: context.source_page_path,
  });
  assert.equal(downloadArticleContext(JSON.stringify(context), new URL(source), source, now), null);
});

test('unrelated, external and absent referrers cannot inherit a previous article', () => {
  for (const referrer of ['', 'https://other.test/guides/conglomerate-rock/', source + 'other/']) {
    assert.equal(downloadArticleContext(JSON.stringify(context), chooser, referrer, now), null);
  }
});

test('expired, future, malformed and private context is rejected', () => {
  for (const stored of [
    null,
    '{',
    'null',
    JSON.stringify({ ...context, createdAt: now - 1_800_001 }),
    JSON.stringify({ ...context, createdAt: now + 1 }),
    JSON.stringify({ ...context, article_id: 'not-an-article' }),
    JSON.stringify({ ...context, article_cluster: 'email@example.com' }),
    JSON.stringify({ ...context, source_page_path: '/guides/private/?email=person@example.com' }),
  ]) {
    assert.equal(downloadArticleContext(stored, chooser, source, now), null);
  }
});
