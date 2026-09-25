# Academic Website

Next.js replacement for [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and continuation of the website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).

The pre-v6 Hugo/Wowchemy implementation remains the production website while this repository is developed in parallel. Its detailed version history is preserved in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md).

Current development release: **v6.0.0-rc.1 "Swift Harbour"**.

## Architecture

This repository is the public/read-only presentation layer. [Research Dashboard](https://github.com/bgonzalezbustamante/research-dashboard) remains the authenticated administrative application and the canonical source for public research metadata.

The website consumes only the explicit anonymous-safe Supabase RPC contracts:

- `list_public_papers()`
- `get_public_paper(text)`
- `list_public_projects()`
- `get_public_project(text)`
- `list_public_conference_presentations()`
- `get_public_work_analytics(year)`

It must not query Research Dashboard tables directly or use a service-role key.

## Phase 4 scope

The current foundation includes:

- Next.js App Router + TypeScript
- distinct academic-site design system inspired by the existing projects' Oxford palette
- portrait-led public academic profile with three current positions, research interests and the revised biography
- supplied Leiden University, Universidad Diego Portales and OCPSG institutional branding, with a Leiden-prioritised favicon
- compact public contact information in the footer
- global header/footer and responsive layout
- RPC-only Supabase client
- public publication listing
- stable publication detail routes with safe Markdown-formatted abstracts, optional local-static Key highlights and safe Markdown-formatted highlight text
- citation-based Publications listing enriched only through `get_public_paper(slug)`, with client-side year and Publication index filters
- standalone Projects listing and `/project/[slug]` detail routes with safe Markdown-formatted project abstracts, including Research outputs with associated publications and public conference presentations
- standalone `/teaching` Teaching Portfolio with one self-contained card per public course, sourced only from `list_public_teaching()`
- homepage Featured publications and Featured projects shown in two-column grids on wider screens; Featured projects remain ordered by latest end year and use funder imagery first
- TERGAP detail-page map derived from a compact snapshot of the public TERGAP dashboard metrics, matching the TERGAP dashboard map canvas/no-data treatment and original colour scale; Home/Projects cards use the ERC funder logo
- standalone Conferences dashboard with KPI cards including Keynote share, presentation geography and a compact 10-row paginated table with Keynote markers
- current-year two-sided presentation Roadmap using public event short names, wrapped into connected rows of five
- current-year public Activity over time heatmap
- current-year average working time and coffee summary cards
- DORA signatory card and `/dora` responsible-research-assessment statement
- CRediT card and migrated `/credit` Contributor Roles Taxonomy page
- public-safe error handling
- local validation of the Supabase public contract
- v6 changelog and structured public release notes

The legacy Hugo/Wowchemy publication corpus is intentionally **not** imported here. Phase 5 remains deferred.

## Local development

This project requires **Node.js 22 or later**. Next.js 16 itself supports older Node 20 releases, but the current Supabase JavaScript stack no longer supports Node 20 and relies on native WebSocket support available in Node 22+.

```bash
git clone https://github.com/bgonzalezbustamante/academic-website.git
cd academic-website
npm install
cp .env.example .env.local
npm run dev
```

On Windows without a Unix-like shell, create `.env.local` by copying `.env.example` manually.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The application expects a modern Supabase publishable key (`sb_publishable_...`), not a service-role key.

### TERGAP map snapshot

The TERGAP project map uses the same `react-simple-maps` / `world-atlas` approach as [tergap-dashboard](https://github.com/bgonzalezbustamante/tergap-dashboard), but the academic website does **not** copy the full dashboard metrics file. Instead, `public/data/tergap-map.json` is a compact derived snapshot containing only:

- the TERGAP dashboard `generated_at` timestamp;
- the collection window;
- country name, ISO-3 code and complete-article count.

When the TERGAP dashboard metrics are refreshed, this small snapshot should be regenerated from its public `public/data/dashboard_metrics.json`. A short local exporter can be run from the TERGAP repository and write directly to `../academic-website/public/data/tergap-map.json`.

### Local checks

Run linting and TypeScript validation:

```bash
npm run check
```

Validate the complete public Supabase contract surface using the publishable key in `.env.local`:

```bash
npm run check:public-contract
```

The contract check:

- verifies `list_public_papers()` and keeps citation/Key highlight fields detail-only;
- resolves a listed publication through `get_public_paper(text)`;
- verifies `list_public_projects()` and `get_public_project(text)`, including `funder_note`;
- confirms project publication slugs resolve only to papers returned by the public publication list;
- verifies `list_public_conference_presentations()`, including required `event_short_name`, ordered presentation authors and the absence of private notes/paper IDs;
- verifies `list_public_teaching()`, including multi-level `levels[]`, period/current state, teaching/student counts, course image filename and the absence of private activity/session metadata;
- validates `get_public_work_analytics(year)`;
- accepts empty curated publication/project/conference datasets;
- never queries internal Research Dashboard tables.

Before a milestone merge or deployment:

```bash
npm run check
npm run check:public-contract
npm run build
```

## Deployment

Development is intentionally **local-first during the release-candidate stage**. Routine pushes should not be used merely to trigger Netlify builds.

Netlify should be used selectively for milestone and integration verification during the release-candidate period. At a later stage, the repository will be connected to Netlify continuous deployment so pushes can deploy automatically, following the workflow previously used by [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart).

The production domain `bgonzalezbustamante.com` must remain attached to the existing Hugo/Wowchemy site until the production migration phase.

## Release history

- Current v6 history: [CHANGELOG.md](CHANGELOG.md)
- Public-facing release notes: [`/release-notes`](./app/release-notes/page.tsx)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)
