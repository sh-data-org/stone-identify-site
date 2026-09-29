import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { renderToStaticMarkup } from 'react-dom/server';
import { routes, type Route } from '../src/routes';
import { acquisition } from '../src/features/analytics/acquisition';
import { pageStructuredData } from '../src/features/seo/structured-data';
import { jsonLd } from '../src/features/articles/render';

function PageHead({ route }: { route: Route }) {
  const canonical = new URL(route.path, acquisition.siteUrl).href;
  return (
    <>
      <title>{`${route.title} | Stone Identifier`}</title>
      <meta name="description" content={route.description} />
      <link rel="canonical" href={canonical} />
      <link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      {route.noindex && <meta name="robots" content="noindex,follow" />}
      <meta property="og:title" content={route.title} />
      <meta property="og:description" content={route.description} />
      <meta property="og:url" content={canonical} />
      <meta
        property="og:image"
        content={new URL(route.image ?? '/images/quartz.jpg', acquisition.siteUrl).href}
      />
      <meta
        property="og:type"
        content={route.schema?.['@type'] === 'Article' ? 'article' : 'website'}
      />
      <meta name="twitter:card" content="summary_large_image" />
      {!route.noindex && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLd(pageStructuredData(route)) }}
        />
      )}
    </>
  );
}

const template = await readFile('dist/index.html', 'utf8');
if (!template.includes('<!--page-body-->'))
  throw new Error('Missing static rendering placeholder.');
for (const route of routes) {
  const target = route.path === '/404' ? 'dist/404.html' : join('dist', route.path, 'index.html');
  await mkdir(dirname(target), { recursive: true });
  const html = template
    .replace('<!--page-head-->', renderToStaticMarkup(<PageHead route={route} />))
    .replace('<!--page-body-->', renderToStaticMarkup(route.element));
  await writeFile(target, html);
}
const locations = routes
  .filter((route) => !route.noindex)
  .map((route) => `<url><loc>${new URL(route.path, acquisition.siteUrl).href}</loc></url>`);
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locations.join('')}</urlset>`,
);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${acquisition.siteUrl}/sitemap.xml\n`,
);
await writeFile('dist/.nojekyll', '');
console.log(`Rendered ${routes.length} React pages to static HTML.`);
