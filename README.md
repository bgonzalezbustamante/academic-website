# Academic Website

Next.js replacement for [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and continuation of the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).

Current development release: **v6.0.0-rc.1 "Swift Harbour"**. The release candidate remains in development while the public record is populated and the replacement site is prepared for Netlify deployment, SEO/accessibility review and production-domain migration.

The pre-v6 Hugo/Wowchemy implementation remains the production website until that migration is complete. Its detailed history is preserved in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md).

## Architecture

This repository is the public/read-only presentation layer. [Research Dashboard](https://github.com/bgonzalezbustamante/research-dashboard) remains the authenticated administrative application and canonical source for public research metadata.

The website consumes only explicitly curated anonymous-safe Supabase RPC contracts:

- `list_public_papers()`
- `get_public_paper(slug)`
- `list_public_projects()`
- `get_public_project(slug)`
- `list_public_conference_presentations()`
- `list_public_teaching()`
- `get_public_work_analytics(year)`

Runtime website code must not query Research Dashboard tables directly or use a service-role key. Private workflow metadata, notes, account information, work-session details and other Dashboard-only data remain outside the public application.

## Public site

Swift Harbour currently includes:

- a portrait-led academic homepage with current appointments, research interests, institutional links, DORA/CRediT research-practice information and public contact details;
- an Academic trajectory page for selected education, faculty appointments, research positions, teaching positions and consultancy;
- Publications with filters, citation information, language indicators, public research links, detail pages and associated projects;
- a Publication profile with output, citation, language, venue and authorship summaries;
- a Co-authorship network for publications with five or fewer authors;
- Projects with funding information, associated publications, conference presentations and project visuals, including the TERGAP map;
- Conferences with KPI cards, presentation geography, paginated records, Keynote markers and the current-year roadmap;
- Teaching with public course/supervision information and cumulative indicators;
- aggregate current-year work activity and homepage population-progress indicators;
- structured public Release Notes and a detailed technical CHANGELOG.

The homepage population indicator is intentionally a progress measure for the ongoing migration rather than a completeness claim.

## Manually maintained site metadata

Two small TypeScript files intentionally remain manual:

- `lib/site-population.ts` stores intended-ingestion totals and population periods used by the public progress indicators.
- `content/site-carbon.ts` stores the current Website Carbon snapshot. Set `showInFooter: false` to suppress the public footer note while retaining the measurement data.

Website Carbon values are stored locally and linked to the corresponding public report; the site does not call Website Carbon at runtime.

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

The public-contract check covers Publications, Projects, Conferences, Teaching and aggregate work analytics, verifies expected public relationships and rejects private fields. Empty curated datasets are valid states.

## Deployment

Development remains local-first during **v6.0.0-rc.1**.

The deployment sequence is:

1. continue populating the public record to/through the 60% readiness threshold;
2. deploy `main` to a temporary Netlify URL;
3. smoke-test the complete public surface and production environment;
4. complete the SEO, metadata, accessibility and responsive-layout pass;
5. address deployment-specific fixes within rc.1;
6. move `bgonzalezbustamante.com` only after the Netlify replacement is verified;
7. tag the release candidate after deployment verification rather than merely after a repository merge.

The current Hugo/Wowchemy production deployment should remain untouched until the production-domain cut-over.

## Release history

- Technical v6 history: [CHANGELOG.md](CHANGELOG.md)
- Public-facing release notes: [Release Notes](./app/release-notes/page.tsx)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)
