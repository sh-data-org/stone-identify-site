import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderArticle, jsonLd } from '../src/features/articles/render';
import { articles } from '../src/features/articles/content';
import assets from '../content/assets.json';
import { validateArticles } from '../src/features/articles/validate';
import { relatedArticles } from '../src/features/articles/related';

test('publication rejects duplicate identity, intent, metadata and URLs', () => {
  const [first, second] = articles;
  assert(first && second);
  for (const field of ['id', 'title', 'description', 'targetKeyword'] as const) {
    assert.throws(() => validateArticles([first, { ...second, [field]: first[field] }], assets));
  }
  assert.throws(() =>
    validateArticles([first, { ...second, category: first.category, slug: first.slug }], assets),
  );
});

test('publication rejects private draft fields, invalid dates and uncredited images', () => {
  const first = articles[0];
  assert(first);
  for (const change of [
    { published: '2026-02-30' },
    { published: '2027-01-01' },
    { research: { volume: 100 } },
    { image: { path: '/images/../private.png', alt: 'Invalid path' } },
  ])
    assert.throws(() => validateArticles([{ ...first, ...change }], assets));
  assert.throws(() => validateArticles([first], []));
  assert.throws(() =>
    validateArticles(
      [first],
      assets.map((asset) => ({ ...asset, reviewed: false })),
    ),
  );
});

test('related links prioritize the cluster, exclude self and remain bounded', () => {
  const first = articles[0];
  assert(first);
  const candidates = Array.from({ length: 7 }, (_, index) => ({
    ...first,
    id: `candidate-${index}`,
    slug: `candidate-${index}`,
    cluster: index === 6 ? first.cluster : 'other',
  }));
  const related = relatedArticles(first, [first, ...candidates]);
  assert.equal(related.length, 4);
  assert.equal(related[0]?.id, 'candidate-6');
  assert(!related.some((article) => article.id === first.id));
});

test('article rendering strips executable HTML and unknown images', () => {
  const { html } = renderArticle(
    '<script>alert(1)</script>\n\n[bad](javascript:alert(1))\n\n![unknown](/private.png)',
  );
  assert(!html.includes('<script'));
  assert(!html.includes('javascript:'));
  assert(!html.includes('/private.png'));
});

test('article headings have usable anchors and reviewed images retain attribution', () => {
  for (const article of articles) {
    const { html, headings } = renderArticle(article.body);
    assert(headings.length >= 4);
    for (const heading of headings) assert(html.includes(`id="${heading.id}"`));
    if (article.body.includes('/images/calcite.jpg')) {
      assert(html.includes('Nessa Eull') && html.includes('CC0'));
    }
  }
});

test('JSON-LD cannot close its script element', () => {
  assert(!jsonLd({ headline: '</script><script>alert(1)</script>' }).includes('<'));
});
