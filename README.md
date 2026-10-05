# Academic Website

Next.js replacement for [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and continuation of the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).

Current production release: **v6.0.0-rc.1 "Swift Harbour"** (1 Oct 2026). **v6.0.0-rc.2 "Bold River"** is in development. Production remains at [bgonzalezbustamante.com](https://bgonzalezbustamante.com/), deployed from validated `main` through the Netlify project `bgonzalezbustamante`.

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
- `get_public_work_analytics(year)`

Runtime website code must not query Research Dashboard tables directly or use a service-role key. Private workflow metadata, notes, account information, work-session details and other Dashboard-only data remain outside the public application.

## Public site

Swift Harbour currently includes:

- a portrait-led academic homepage with current appointments, research interests, institutional links, DORA/CRediT research-practice information and public contact details;
- an Academic trajectory page for selected education, faculty appointments, research positions, teaching positions and consultancy;
- a non-navigation Software Ecosystem catalogue with public lifecycle, version, repository, production and documentation metadata;
- Publications with filters, citation information, language indicators, public research links, detail pages and associated projects;
- a Publication profile with output, citation, language, venue and authorship summaries;
- a Co-authorship network for publications with five or fewer authors;
- Projects with funding information, associated publications, conference presentations and project visuals, including the TERGAP map;
- Conferences with KPI cards, presentation geography, paginated records, Keynote markers and the current-year roadmap;
- Teaching with public course/supervision information, controlled teaching-role and academic-level tags, and cumulative indicators;
- aggregate current-year work activity and homepage population-progress indicators;
- a compact Catholic Calendar composed display in the footer, computed in Europe/Amsterdam from the reusable `@bgonzalezbustamante/catholic-calendar` package and linked to the standalone Catholic Calendar site;
- structured public Release Notes and a detailed technical CHANGELOG.

The homepage population indicator is intentionally a progress measure for the ongoing migration rather than a completeness claim.

## Manually maintained site metadata

Three small TypeScript sources intentionally remain manual:

- `lib/site-population.ts` stores intended-ingestion totals, population periods and the `POPULATION_SETTINGS.showProgress` display switch. Set it to `false` to hide both the Home population card and the section-level progress strips without deleting the underlying targets.
- `content/trajectory.ts` stores the selected education and professional positions shown on the Academic trajectory page. Entries are grouped by category for manual editing, and the optional `order` field resolves ties when positions share the same interval.
- `content/site-carbon.ts` stores the current Website Carbon snapshot. Set `showInFooter: false` to suppress the public footer note while retaining the measurement data.

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

### Profile portrait

Place exactly one JPG, JPEG or PNG source image in `public/profile`. The pre-development/check/build synchronisation step copies it to a content-hashed generated filename so profile-image replacements invalidate caches automatically.

### TERGAP map snapshot

The TERGAP project map uses a compact derived snapshot at `public/data/tergap-map.json` rather than copying the full TERGAP dashboard metrics file.

When the TERGAP dashboard data changes, regenerate the snapshot from the TERGAP repository and commit only the derived academic-website JSON.

## Validation

Run linting and TypeScript validation:

```bash
npm run check
```

Validate the anonymous-safe public Supabase contract:

```bash
npm run check:public-contract
```

Build the production application:

```bash
npm run build
```

Before a deployment or milestone merge, run all three:

```bash
npm run check
npm run check:public-contract
npm run build
```

The public-contract check covers Publications, Projects, Conferences, Teaching, Software Ecosystem and aggregate work analytics, verifies expected public relationships and controlled vocabularies, enforces private-repository URL suppression, and rejects private fields. `npm run check:calendar-footer` protects deterministic Catholic Calendar footer fixtures: the 85-character maximum-width composition found by the full beta.1 audit, the long St Michael's Lent/countdown composition, and a current-day integration sample. `npm run audit:calendar-footer` retains the exhaustive 2000–2100 scan for deliberate package/release audits without adding it to every Netlify build. Empty curated datasets are valid states.

## Deployment

Development remains local-first. Before integration, release changes should pass:

```bash
npm run check
npm run check:public-contract
npm run build
```

Validated work is merged into `main`, which deploys to the Netlify project `bgonzalezbustamante` and serves `https://bgonzalezbustamante.com`. The production environment uses `NEXT_PUBLIC_SITE_URL=https://bgonzalezbustamante.com`; non-production hosts remain protected by environment-aware `noindex`/robots behaviour.

The production cut-over completed on 1 Oct 2026 after temporary-deployment smoke testing, quality hardening, legacy redirect verification, SEO verification and a post-cut-over Website Carbon re-test. `www.bgonzalezbustamante.com` redirects to the apex domain, and `bgonzalezbustamante.netlify.app` redirects permanently to the corresponding canonical `.com` path.

The predecessor remains temporarily available at `legacy-bgonzalezbustamante.netlify.app` for rollback and can be archived after the post-migration observation period.

## Release history

- Technical v6 history: [CHANGELOG.md](CHANGELOG.md)
- Public-facing release notes: [Release Notes](./app/release-notes/page.tsx)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)


## Licensing

Repository software is licensed under the MIT License; see `LICENSE`.

Original editorial website content authored by Bastián González-Bustamante is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0) unless a page or asset states otherwise; see `CONTENT-LICENSE.md`.

Institutional branding, third-party logos and marks, publication material, externally sourced graphics, flags, photographs and other assets whose rights are not held by the repository author are excluded from those licence grants and remain subject to their respective rights; see `NOTICE`.
