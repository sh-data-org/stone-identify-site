import assert from 'node:assert/strict';
import { test } from 'node:test';
import { renderArticle, jsonLd } from '../src/features/articles/render';
import { articles } from '../src/features/articles/content';

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
