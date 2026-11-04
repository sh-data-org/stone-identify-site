# Stone Identifier website

One public React + TypeScript frontend for https://stoneidentify.app.
GitHub Pages hosts static HTML, CSS, images and a small analytics script.

## Run locally

Use Node 24. Run `npm ci`, then `npm run dev` to build and preview on localhost.
After an edit, run `npm run build` again. `npm run preview` serves the last build.

Before publishing: `npm run typecheck`, `npm run lint`, `npm test`, `npm run build`, `npm run verify`.

## What is here

- `src/pages`: React page components; `src/routes.tsx`: page metadata and URLs.
- `content/articles.json`: published articles, their sources and image references.
- `src/features/articles/schema.ts`: the content format. New content must pass it.
- `scripts/prerender.tsx`: generates complete HTML and the sitemap at build time.
- `content/acquisition.json`: public app campaign and GA4 identifiers, never private keys.

No CMS, database, server API, login or scheduled research process is required to serve the website.
Private drafts, keyword research and reporting jobs belong outside this repo. Shoham's process
and API work is assigned under Marketing → Search & discovery → SEO websites → Stone SEO in Gaver Task.

## Publishing

The existing GitHub Actions workflow deploys `dist` from `yoav-dev` on push.
A push therefore publishes the website: show the changes and checks to Yoav and obtain approval first.
After Yoav approves the first five new articles, the server publishing job may push validated
article content, image credits, and raster images to `yoav-dev` without per-batch approval.
That authorization does not cover code or configuration. The server job and approval gate
are assigned to Shoham; this repository does not enable automatic publishing.
Keep `public/CNAME` (`stoneidentify.app`) and the existing GitHub Pages domain/HTTPS configuration.
Do not create another site repo. Revert the relevant change through Git to roll back an approved release.

## Tracking

All App Store buttons use app `6782013876`, provider `125042532`, campaign `stone-web`.
Optional GA4 measures page views and `app_store_click` after consent, only on the production origin.
The client records button placement, page path, and `app_platform` (`ios` or `android`).
Local previews send no analytics. Google Play links use package `com.stocker.stoneidentify`
and the Install Referrer campaign `stone-web`; sending that referrer does not prove install attribution.
Article page views and download clicks also carry `article_id` and `article_cluster`.
These event-scoped dimensions were registered in GA4 property `556587483` on 2026-11-04;
historical page-path reports remain usable. The shared `stone-web` campaign remains unchanged.
An app click is not a download; confirm Apple campaign downloads separately in App Store Connect.

`/go/` is the shared download link. The browser selects a fixed store URL for iOS or Android;
desktop and unknown devices show both stores. Explicit store links work without JavaScript.
On article pages, mobile download links go directly to the chosen store so consented clicks
retain article context. Opening the desktop chooser is not counted as a store click.
No Tenjin tracking URL is configured yet: Android setup and end-to-end attribution verification
belong to Shoham's backend task. Keep the shared public URL stable when that work is ready.

## GEO and AI search

The app page explains the official app identity and links to its App Store listing.
Indexable pages include connected WebSite, WebPage and publisher structured data; the app
uses MobileApplication and guides use Article with source citations. The article answer is
visible before the main image. All content is in static HTML, with crawler access through robots.txt.
These are discoverability foundations, not evidence of AI citations or rankings.

## Release verification

Local verification is not evidence of live indexing, incoming GA4 data or app downloads.
The old private CMS repository is preserved as reference and is not a launch dependency.

## Article contract

Every published article requires a stable UUID `id`, ISO `published` and `updated` dates,
a lowercase hyphenated `cluster`, and one `targetKeyword`. Existing dates are retained
from the first article release commits; metadata-only edits do not reset the dates.
Keep IDs and publication dates stable during updates. These keyword labels do not claim
verified demand or difficulty; keep provider research and draft approval evidence private.

Articles retain `/guides/` or `/comparisons/` URLs. Beginner geology, collecting, appearance,
and care articles use `/guides/`, grouped by cluster. Builds reject duplicate IDs, URLs,
titles, descriptions, and primary keywords, invalid date order, unknown top-level draft
fields, and hero images without reviewed credits. Related links prefer the same cluster
and are limited to four. Article dates are included in JSON-LD and sitemap lastmod.

These structural checks do not verify geological facts or image accuracy. Shoham's job
must check sources, licensing, duplicate intent, and approved editorial standards before
exporting a draft into published content. Failed drafts must never enter this file.
