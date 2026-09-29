import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { articles } from '../src/features/articles/content';

const root = resolve('dist');
async function files(directory: string): Promise<string[]> {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map((entry) =>
      entry.isDirectory() ? files(join(directory, entry.name)) : [join(directory, entry.name)],
    ),
  );
  return nested.flat();
}
const artifacts = await files(root);
const pages = artifacts.filter((file) => file.endsWith('.html'));
assert.equal(pages.length, 14);
const titles = new Set<string>();
for (const file of artifacts) {
  assert(!/\/(admin|api|auth|preview|content)\//.test(file.slice(root.length)));
}
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, file);
  assert.equal((html.match(/rel="canonical"/g) || []).length, 1, file);
  assert.match(html, /rel="canonical" href="https:\/\/stoneidentify\.app\//);
  assert.match(html, /name="description" content="[^"]+"/);
  assert(!html.includes('localhost') && !html.includes('<!--page-'), file);
  assert.match(html, /https:\/\/apps\.apple\.com\/us\/app\/id6782013876/);
  assert.match(html, /pt=125042532(?:&amp;|&)ct=stone-web/);
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  assert(title);
  if (!html.includes('noindex')) {
    assert(!titles.has(title), `Duplicate title: ${title}`);
    titles.add(title);
  }
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const path = match[1];
    assert(path);
    const target = join(root, path);
    const info = await stat(target).catch(() => null);
    const index = await stat(join(target, 'index.html')).catch(() => null);
    assert(info?.isFile() || index?.isFile(), `Broken local link: ${path} in ${file}`);
  }
  for (const match of html.matchAll(/href="#([^"]+)"/g)) {
    assert(html.includes(`id="${match[1]}"`), `Broken anchor: ${match[1]} in ${file}`);
  }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 11);
assert(!/\/(admin|jewelry|apps|404)\/?</.test(sitemap));
for (const article of articles) {
  const path = `/${article.category}/${article.slug}`;
  const html = await readFile(join(root, path, 'index.html'), 'utf8');
  assert(sitemap.includes(`https://stoneidentify.app${path}`));
  assert(!html.includes('noindex'));
  assert((html.match(/<h2[\s>]/g) || []).length >= 4);
  const schemaText = html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)?.[1];
  assert(schemaText);
  const schema: unknown = JSON.parse(schemaText);
  assert(schema && typeof schema === 'object' && '@graph' in schema);
  assert(Array.isArray(schema['@graph']));
  const articleNode: unknown = schema['@graph'].find(
    (node: unknown) =>
      node !== null && typeof node === 'object' && '@type' in node && node['@type'] === 'Article',
  );
  assert(articleNode && typeof articleNode === 'object' && 'headline' in articleNode);
  assert.equal(articleNode.headline, article.title);
  assert(html.includes(article.answer.replaceAll('&', '&amp;')));
}
const homepage = await readFile(join(root, 'index.html'), 'utf8');
assert.match(homepage, /data-measurement-id="G-W5JET4YGQH"/);
assert.match(homepage, /data-app-placement="hero"/);
for (const path of ['jewelry/index.html', 'apps/index.html', '404.html']) {
  assert.match(await readFile(join(root, path), 'utf8'), /noindex,follow/);
}
assert.equal((await readFile(join(root, 'CNAME'), 'utf8')).trim(), 'stoneidentify.app');
console.log(
  '14 static pages verified: app information, two sourced articles, eleven sitemap URLs, metadata, anchors, local links, app attribution and frontend-only output.',
);
