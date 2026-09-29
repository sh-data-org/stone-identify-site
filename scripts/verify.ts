import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, resolve } from 'node:path';

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
assert.equal(pages.length, 11);
for (const file of artifacts) {
  assert(!/\/(admin|api|auth|preview|content)\//.test(file.slice(root.length)));
}
for (const file of pages) {
  const html = await readFile(file, 'utf8');
  assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, file);
  assert.match(html, /rel="canonical" href="https:\/\/stoneidentify\.app\//);
  assert(!html.includes('localhost') && !html.includes('Local review preview'), file);
  assert(!/href="\/go[?/"]/.test(html), file);
  assert.match(html, /https:\/\/apps\.apple\.com\/us\/app\/id6782013876/);
  for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
    const path = match[1];
    assert(path);
    const target = join(root, path);
    const info = await stat(target).catch(() => null);
    const index = await stat(join(target, 'index.html')).catch(() => null);
    assert(info?.isFile() || index?.isFile(), `Broken local link: ${path} in ${file}`);
  }
}
const sitemap = await readFile(join(root, 'sitemap.xml'), 'utf8');
assert.equal((sitemap.match(/<loc>/g) || []).length, 6);
assert(!sitemap.includes('how-to-identify') && !sitemap.includes('/admin'));

assert(!(await readFile(join(root, 'index.html'), 'utf8')).includes('noindex'));
for (const category of ['guides', 'comparisons', 'jewelry', 'apps']) {
  assert.match(await readFile(join(root, category, 'index.html'), 'utf8'), /noindex,nofollow/);
}
console.log(
  '11 static pages verified: public-only output, canonical domain, working local links, direct App Store buttons, six-page sitemap and draft exclusion.',
);
