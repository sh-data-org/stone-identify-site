# Stone Identifier public website

Frontend source and GitHub Pages deployment for https://stoneidentify.app.

## Local development

Node 24 recommended. Run `npm ci`, then `npm run dev`.
Before publication: `npm run typecheck`, `npm run lint`, `npm run build`, `npm run verify`.

## Publishing

GitHub Actions builds this repository and deploys `dist` to Pages from `yoav-dev`.
Hostinger holds the domain/DNS. Keep `public/CNAME` and the configured Pages custom domain.
Only approved public material belongs in this repository. There are currently no approved article pages. Do not add drafts, credentials, exports or private editorial research here.

The CMS and unpublished drafts are maintained separately in the private `sh-data-org/stone-identify-cms` repository. Existing uncommitted editorial/analytics work has not been migrated or activated by this consolidation.

## Current measurement

App Store buttons use the verified app listing directly. Google Analytics and backend visit/click collection are not activated in this release. Search Console ownership is verified; sitemap processing needs separate confirmation.
