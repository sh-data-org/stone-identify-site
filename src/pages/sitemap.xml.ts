import type { APIRoute } from 'astro';
export const GET: APIRoute = () => {
  const paths = ['', 'about/', 'credits/', 'privacy/', 'terms/', 'identification-checklist/'];
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((path) => `<url><loc>https://stoneidentify.app/${path}</loc></url>`).join('')}</urlset>`,
    { headers: { 'Content-Type': 'application/xml' } },
  );
};
