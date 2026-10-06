# Academic Website

Next.js replacement for [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and continuation of the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).

Current release: **v6.0.0-rc.2 "Bold River"** (6 Oct 2026); previous release: **v6.0.0-rc.1 "Swift Harbour"** (1 Oct 2026). The site is deployed from validated `main` to [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) via Netlify. While [PR #11](https://github.com/bgonzalezbustamante/academic-website/pull/11) is awaiting approval, production still runs rc.1.

The pre-v6 Hugo/Wowchemy implementation is retained temporarily at `legacy-bgonzalezbustamante.netlify.app` as a rollback copy. Its detailed history is preserved in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md).

## Architecture

This repository is the public/read-only presentation layer. [Research Dashboard](https://github.com/bgonzalezbustamante/research-dashboard) remains the authenticated administrative application and canonical source for public research metadata.

The website consumes only explicitly curated anonymous-safe Supabase RPC contracts:

- `list_public_papers()`
- `get_public_paper(slug)`
- `list_public_projects()`
- `get_public_project(slug)`
- `list_public_conference_presentations()`
- `list_public_teaching()`
- `list_public_software()`
- `get_public_software(slug)`
- `get_public_calendar_settings()`
- `get_public_work_analytics(year)`
- `list_public_availability(year)`
- `get_public_teaching_settings()`

Runtime website code must not query Research Dashboard tables directly or use a service-role key. Private workflow metadata, notes, account information, work-session details and other Dashboard-only data remain outside the public application.

## Public site

The public website provides:

- a portrait-led academic homepage with current appointments, research interests, institutional links, DORA/CRediT research-practice information and public contact details;
- an Academic trajectory page for selected education, faculty appointments, research positions, teaching positions and consultancy;
- a Software Ecosystem catalogue of public tools and applications, with versions, development stages and relevant links;
- a seven-day illustrated Weekly timeline, linked from the Home activity chart;
- a Selected paintings gallery with nine reproduced works, source and rights credits, and links to other favourites that cannot be reproduced;
- Publications with filters, citation information, language indicators, public research links, detail pages and associated projects;
- a Publication profile with output, citation, language, venue and authorship summaries;
- a Co-authorship network for publications with five or fewer authors;
- Projects with funding information, associated publications, conference presentations and project visuals, including the TERGAP map;
- Conferences with KPI cards, presentation geography, paginated records, Keynote markers and the current-year roadmap;
- Teaching with public course/supervision information, controlled teaching-role and academic-level tags, and cumulative indicators;
- aggregate current-year work activity and homepage population-progress indicators;
- Catholic Calendar highlights in the footer, linked to the standalone calendar and controlled by the public calendar settings;
- public-facing Release Notes and a separate technical CHANGELOG.

The homepage population indicator tracks migration progress; it does not claim that all research records are complete. The Software, Timeline and Paintings pages are linked from Home rather than the primary navigation.

## Manually maintained site metadata

Five small TypeScript sources intentionally remain manual:

- `lib/site-population.ts` stores intended-ingestion totals, population periods and the `POPULATION_SETTINGS.showProgress` display switch. Set it to `false` to hide both the Home population card and the section-level progress strips without deleting the underlying targets.
- `content/trajectory.ts` stores selected education and professional positions shown on Academic trajectory; `order` resolves ties within a category.
- `content/positions.ts` sets current academic positions, institutional links and their shared ordering in the Home profile and navbar. These can move to the Academic API later.
- `content/site-carbon.ts` stores the current Website Carbon snapshot. Set `showInFooter: false` to suppress the public footer note while retaining the measurement data.
- `content/paintings.ts` stores the deliberately small personal painting selection, museum/source links, image rights metadata and editorial mosaic layout hints.

These files are deliberately local configuration/content rather than Research Dashboard contracts. Website Carbon values are linked to the corresponding public report; the site does not call Website Carbon at runtime.

## Local development

This project requires **Node.js 22 or later**.

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

Use a Supabase publishable key (`sb_publishable_...`), never a service-role key.

### Search and preview safety

Canonical metadata resolves against `NEXT_PUBLIC_SITE_URL`. Only the final HTTPS production hosts are indexable; localhost, branch/preview deployments and the temporary Netlify hostname emit `noindex` metadata and a disallowing `robots.txt`. Production `robots.txt` also advertises the generated public sitemap.

Legacy URL migration uses a deliberately small set of permanent redirects in `next.config.ts`. Section indexes and legacy pages are redirected only when Swift Harbour has a clear successor. Existing publication slugs that already remain canonical are not redirected, and legacy material without a current equivalent is allowed to return the normal 404 rather than being sent to an unrelated generic page.

### Weekly timeline

The `/weekly-timeline` page integrates **only** the seven-day interactive component from [Weekly Penguin Timeline](https://github.com/bgonzalezbustamante/weekly-penguin-timeline), adapted from its `main` revision `3c284218abf9` (v0.1.0-beta.2). Navigation spans roughly three months before and after the current week; illustrations reflect public working time and coffee counts, selected Catholic dates, conferences, travel, availability and teaching-season Saturdays. The standalone tester, asset gallery and release notes are intentionally omitted.

The Next.js page, calendar logic and data validation run locally in this repository through the anonymous-safe Academic API. To avoid duplicating 46 large PNG source artworks before rc.2, its penguin graphics load as already generated WebP files from `https://timeline.bgonzalezbustamante.com/penguins/`. This is an explicit dependency on the standalone deployment; no iframe or external JavaScript is used. Artwork is CC BY-NC 4.0 (see `NOTICE`). The page links to the full standalone site.

### Local image assets

The canonical raster sources live outside `public/`: one `assets/sources/profile/avatar.png`, nine slug-named JPEGs in `assets/sources/paintings/`, and three logo PNGs (`leiden.png`, `udp.png`, `ocpsg.png`) in `assets/sources/branding/`. Keep original source files unchanged; their museum links, licence terms and institutional ownership are preserved in the painting metadata and `NOTICE`.

Run `npm run assets:build` to create content-hashed WebP files under `public/{profile,paintings,branding}/generated/` and the local image manifest. It runs automatically before `npm run dev`, `npm run check` and `npm run build`; generated files are not committed. The portrait and responsive painting variants use quality 95; logos use lossless WebP. The generated portrait is served without a second compression step to preserve image quality. The build also checks the actual WebP dimensions and reports their file sizes; the Leiden logo must retain a genuinely transparent background. Project, teaching and funder images and Christicons are deliberately outside this pipeline.

The navbar and Home positions list use these generated institutional logo assets.

### TERGAP map snapshot

The TERGAP project map uses a compact derived snapshot at `public/data/tergap-map.json` rather than copying the full TERGAP dashboard metrics file. Its Africa-centred view matches the standalone TERGAP Dashboard; Conferences retains its global map.

When the TERGAP dashboard data changes, regenerate the snapshot from the TERGAP repository and commit only the derived academic-website JSON.

## Validation

Before merging or deploying a release candidate, run:

```bash
npm run check
npm run check:public-contract
npm run build
npm audit --omit=dev
```

`npm run check:public-contract` requires a configured `.env.local` and validates the website's anonymous-safe Academic API, including Software, activity/coffee data, teaching settings, availability and repository privacy. `npm run check` covers linting, TypeScript and the deterministic Catholic Calendar footer fixtures. The exhaustive calendar audit is available separately through `npm run audit:calendar-footer`. Check the Netlify preview on desktop and mobile and run a secrets scan before repository-publication decisions.

## Deployment

Development remains local-first and follows the validation gate above. Only approved, validated pull requests are merged into `main`, which deploys to the Netlify project `bgonzalezbustamante` and serves `https://bgonzalezbustamante.com`. The production environment uses `NEXT_PUBLIC_SITE_URL=https://bgonzalezbustamante.com`; non-production hosts remain protected by environment-aware `noindex`/robots behaviour.

The production cut-over completed on 1 Oct 2026 after temporary-deployment smoke testing, quality hardening, legacy redirect verification, SEO verification and a post-cut-over Website Carbon re-test. `www.bgonzalezbustamante.com` redirects to the apex domain, and `bgonzalezbustamante.netlify.app` redirects permanently to the corresponding canonical `.com` path.

The predecessor remains temporarily available at `legacy-bgonzalezbustamante.netlify.app` for rollback and can be archived after the post-migration observation period.

### Repository visibility

The GitHub repository remains private pending the complete publication review. Make it public only after merging, production verification and review of historical files, security and asset redistribution rights. Publishing the repository exposes its existing branches and commit history, not just the current `main` tree. Confirm that source imagery, licence notices and any historical files are suitable for public distribution; never rely on `.gitignore` to protect material already committed.

### Release procedure

Finalise `README.md`, `CHANGELOG.md` and `lib/releases.ts` on the release branch. After explicit approval, merge the PR and verify the production deployment and new routes. Tag **the merged `main` commit**, never an unmerged branch head; then publish a GitHub **pre-release** with a short summary. For Bold River, the tag is `v6.0.0-rc.2` and the release title is `v6.0.0-rc.2 “Bold River”`.

## Release history

- Technical v6 history: [CHANGELOG.md](CHANGELOG.md)
- Plain-language [Release Notes](/release-notes) (source: `lib/releases.ts`)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)


## Licensing

Repository software is licensed under the MIT License; see `LICENSE`.

Original editorial website content authored by Bastián González-Bustamante is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0) unless a page or asset states otherwise; see `CONTENT-LICENSE.md`.

Institutional branding, third-party logos and marks, publication material, externally sourced graphics, flags, photographs and other assets whose rights are not held by the repository author are excluded from those licence grants and remain subject to their respective rights; see `NOTICE`.
