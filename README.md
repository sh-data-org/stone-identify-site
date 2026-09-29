# Stone Identifier website

One public React + TypeScript frontend for https://stoneidentify.app.
GitHub Pages hosts static HTML, CSS, images and a small analytics script.

## Run locally

Use Node 24. Run `npm ci`, then `npm run dev` to build and preview on localhost.
After an edit, run `npm run build` again. `npm run preview` serves the last build.

Before publishing: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run verify`.

## What is here

- `src/pages`: React page components; `src/routes.tsx`: page metadata and URLs.
- `content/articles.json`: the two initial articles, their sources and image references.
- `src/features/articles/schema.ts`: the content format. New content must pass it.
- `scripts/prerender.tsx`: generates complete HTML and the sitemap at build time.
- `content/acquisition.json`: public app campaign and GA4 identifiers, never private keys.

No CMS, database, server API, login or scheduled research process is required to serve the website.
Private drafts, keyword research and reporting jobs belong outside this repo. Shoham's process
and API work is assigned under Marketing → Search & discovery → SEO websites → Stone SEO in Gaver Task.

## Publishing

The existing GitHub Actions workflow deploys `dist` from `yoav-dev` on push.
A push therefore publishes the website: show the changes and checks to Yoav and obtain approval first.
Keep `public/CNAME` (`stoneidentify.app`) and the existing GitHub Pages domain/HTTPS configuration.
Do not create another site repo. Revert the relevant change through Git to roll back an approved release.

## Tracking

All App Store buttons use app `6782013876`, provider `125042532`, campaign `stone-web`.
Optional GA4 measures page views and `app_store_click` after consent, only on the production origin.
The client records button placement and page path. Local previews send no analytics.
An app click is not a download; confirm Apple campaign downloads separately in App Store Connect.

## GEO and AI search

The app page explains the official app identity and links to its App Store listing.
Indexable pages include connected WebSite, WebPage and publisher structured data; the app
uses MobileApplication and guides use Article with source citations. The article answer is
visible before the main image. All content is in static HTML, with crawler access through robots.txt.
These are discoverability foundations, not evidence of AI citations or rankings.

## Release verification

Local verification is not evidence of live indexing, incoming GA4 data or app downloads.
The old private CMS repository is preserved as reference and is not a launch dependency.
