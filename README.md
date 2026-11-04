# Academic Website

Next.js replacement for [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and continuation of the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).

Current release: **v6.0.0 "Crimson Delta"** (2 Nov 2026), the first stable v6 release; previous release: **v6.0.0-rc.2 "Bold River"** (6 Oct 2026). The website is deployed from validated `main` to [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) via Netlify.

**In development:** v6.1.0 "Jade Prairie", planned for 1 Dec 2026. Release Notes show it as **In development**; `package.json`, the footer and the **Current release** designation stay at v6.0.0 until its approved release.

The pre-v6 Hugo/Wowchemy implementation was retired on 2 Nov 2026: `legacy-bgonzalezbustamante.netlify.app` now redirects every path permanently to the same path on this site, and the archived `academic-kickstart` repository keeps its source. Its detailed history is preserved in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md).

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
- Publications with index filters (including Dataset), citation information, language indicators, public research links, detail pages and associated projects;
- a Publication profile with output, citation, language, venue and authorship summaries;
- a Co-authorship network for publications with five or fewer authors;
- Projects with a featured selection, a paginated portfolio (six per page), funding information, associated publications, conference presentations and visuals, including the TERGAP map;
- Conferences with KPI cards, a closer Europe/World map selector, paginated records (including guest lectures), Keynote markers and the current-year roadmap;
- Teaching with public course/supervision information, controlled teaching-role and academic-level tags, and cumulative indicators;
- aggregate current-year work activity and homepage population-progress indicators;
- dated Catholic Calendar highlights in the footer, linked to the standalone calendar and controlled by the public calendar settings;
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

This project requires **Node.js 22 or later**; `.nvmrc` and the Netlify build use Node 24.

```bash
git clone https://github.com/bgonzalezbustamante/academic-website.git
cd academic-website
npm ci
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

Canonical metadata resolves against `NEXT_PUBLIC_SITE_URL`. Only the final HTTPS production hosts are indexable; localhost, branch/preview deployments and the temporary Netlify hostname emit `noindex` metadata and a disallowing `robots.txt`. Netlify's build context is embedded in Next.js so that Deploy Previews stay non-indexable even when they inherit the production site URL. Production `robots.txt` also advertises the generated public sitemap.

Legacy URL migration uses a deliberately small set of permanent redirects in `next.config.ts`. Section indexes and legacy pages are redirected only when the current site has a clear successor page. Existing publication slugs that already remain canonical are not redirected, and legacy material without a current equivalent is allowed to return the normal 404 rather than being sent to an unrelated generic page.

### Weekly timeline

The `/weekly-timeline` page integrates **only** the seven-day interactive component from [Weekly Penguin Timeline](https://github.com/bgonzalezbustamante/weekly-penguin-timeline), adapted from its `main` revision `3c284218abf9` (v0.1.0-beta.2). Navigation spans roughly three months before and after the current week; illustrations reflect public working time and coffee counts, selected Catholic dates, conferences, travel, availability and teaching-season Saturdays. The standalone tester, asset gallery and release notes are intentionally omitted.

The Next.js page, calendar logic and data validation run locally in this repository through the anonymous-safe Academic API. To avoid duplicating the 46 large PNG source artworks, its penguin graphics load as already generated WebP files from `https://timeline.bgonzalezbustamante.com/penguins/`. This is an explicit dependency on the standalone deployment; no iframe or external JavaScript is used. Artwork is CC BY-NC 4.0 (see `NOTICE`). The page links to the full standalone site.

### Local image assets

The canonical raster sources live outside `public/`: one `assets/sources/profile/avatar.png`, nine slug-named JPEGs in `assets/sources/paintings/`, and three logo PNGs (`leiden.png`, `udp.png`, `ocpsg.png`) in `assets/sources/branding/`. Keep original source files unchanged; their museum links, licence terms and institutional ownership are preserved in the painting metadata and `NOTICE`.

Run `npm run assets:build` to create content-hashed WebP files under `public/{profile,paintings,branding}/generated/` and the local image manifest. It runs automatically before `npm run dev`, `npm run check` and `npm run build`; generated files are not committed. The portrait and responsive painting variants use quality 95; logos use lossless WebP. The generated portrait is served without a second compression step to preserve image quality. The build also checks the actual WebP dimensions and reports their file sizes; the Leiden logo must retain a genuinely transparent background. Christicons and other vector or static assets remain outside this pipeline.

The navbar and Home positions list use these generated institutional logo assets.

The 404 page illustration is compiled the same way from `assets/sources/errors/404_penguin.png` (the 4096px original) into WebP at 320, 480, 640 and 960px under `public/errors/generated/`, losslessly where that is not much heavier than quality 95, and with its transparent background verified.

The favicon, `app/icon.png`, is a committed 192 × 192px palette PNG (about 19 KB) derived from `assets/sources/logos/leiden.png`; 192px is a multiple of 48px, as Google Search asks for favicons. Regenerate it from that source if the seal changes.

### Project, publication and logo images

Project figures, publication Key highlight figures, and funder and teaching logos follow the same process as the portrait. The Research Dashboard stores only the filename; the original lives in `assets/sources/`:

```text
assets/sources/projects/<project-slug>/<project_image_filename>
assets/sources/publication-highlights/<paper-slug>/<highlight_image_filename>
assets/sources/logos/<funder_image_filename or course_image_filename>
```

To add or replace an image, save the original at that path with exactly the filename entered in the Dashboard and run `npm run dev` (or `npm run assets:build`). Commit only the source file; the WebP output under `public/{projects,publication-highlights,logos}/generated/` is regenerated on every machine and deployment. `npm run check:public-contract` fails if a public project, funder, course or highlight filename has no uploaded source.

Figures receive responsive WebP sizes of 640, 960, 1440 and 1800px, never enlarged. PNG figures are kept lossless where that is not much heavier than quality-95 WebP; flat-colour charts up to 2400px wide keep their exact original pixels when that is the lightest option; other figures use quality-95 WebP. Smaller sizes are kept only when they are also lighter. Logos fit within 400 × 400px under the same lossless rule. Outputs are cached by content, so only new or changed images are encoded; a first full build takes about two minutes.

`assets/sources/figures.json` holds two optional settings:

- `aliases` reuse one source for a second page, avoiding duplicate files (for example, the ENUT spider plot serves both its project and its publication highlight);
- `sharpen` applies a light unsharp mask (σ) to a specific soft original after resizing; it is used for two figures whose best available exports are slightly blurred.

### TERGAP map snapshot

The TERGAP project map uses a compact derived snapshot at `public/data/tergap-map.json` rather than copying the full TERGAP dashboard metrics file. Its Africa-centred view matches the standalone TERGAP Dashboard; Conferences offers Europe (default) and World views.

### Europe map subset

The Conferences Europe view uses `public/data/europe-map-50m.json`, a derived subset of the `world-atlas` 1:50m countries containing only those visible in that viewport. Run `npm run map:europe` to regenerate it if the Europe projection changes, and commit the derived JSON.

When the TERGAP dashboard data changes, regenerate the snapshot from the TERGAP repository and commit only the derived academic-website JSON.

## Validation

Before merging or deploying a release, run:

```bash
npm run check
npm run check:public-contract
npm run build
npm audit --omit=dev
gitleaks detect --source . --log-opts="--all" --no-banner --redact --verbose
```

`npm run check:public-contract` requires a configured `.env.local` and validates the website's anonymous-safe Academic API, including controlled presentation types, Software, activity/coffee data, teaching settings, availability and repository privacy. `npm run check` covers linting, TypeScript and deterministic Catholic Calendar footer fixtures. The exhaustive calendar audit is available separately through `npm run audit:calendar-footer`. Validate locally, including browser checks against `npm run start`; Netlify Deploy Previews and branch deploys are switched off.

GitHub Actions CI (`.github/workflows/ci.yml`) runs `npm audit --omit=dev --audit-level=high` and `npm run check` on Node 22 and 24 for every pull request and push to `main`. The production build and `check:public-contract` need the Supabase environment and stay in the local gate above.

### Dependency updates

Dependabot (`.github/dependabot.yml`) opens one grouped pull request per week for npm minor and patch updates and one per month for GitHub Actions; major upgrades are planned deliberately in a named release. Its commits carry `[skip netlify]`. Dependabot pull requests are not merged into `main` directly: their bumps are applied with `npm install --save-exact` on the active release branch and pass the full gate, and Dependabot closes its pull request once `main` has the new versions. Dependabot alerts, malware alerts and grouped security updates are enabled; a security fix that cannot wait for the next release becomes an approved hotfix.

The "Protect main" ruleset requires a pull request and both CI checks (`check (22)`, `check (24)`) before anything merges into `main`, and blocks force-pushes and deletion. CodeQL default setup scans the code and workflows, and security issues can be reported privately through GitHub's private vulnerability reporting.

## Deployment

Development is local-first. Work in progress stays in draft, unmerged pull requests, with `[skip netlify]` in the PR title and each development commit. Netlify Deploy Previews and branch deploys are switched off, so pull requests and branch pushes never build; only `main` deploys, and the marker remains a second safeguard against unintended builds. No Netlify build should be initiated without explicit approval, including for an exceptional production hotfix.

Only approved, validated changes are merged into `main`, which deploys to the Netlify project `bgonzalezbustamante` and serves `https://bgonzalezbustamante.com`. When a production deployment is approved, ensure **both the merge commit title and body** omit `[skip netlify]`: GitHub can copy a PR title into the merge message and inadvertently suppress the build. Verify the published Netlify deployment against the expected `main` commit. The production environment uses `NEXT_PUBLIC_SITE_URL=https://bgonzalezbustamante.com`; non-production hosts remain protected by environment-aware `noindex`/robots behaviour.

The production cut-over completed on 1 Oct 2026 after temporary-deployment smoke testing, quality hardening, legacy redirect verification, SEO verification and a post-cut-over Website Carbon re-test. `www.bgonzalezbustamante.com` redirects to the apex domain, and `bgonzalezbustamante.netlify.app` redirects permanently to the corresponding canonical `.com` path.

The predecessor deployment at `legacy-bgonzalezbustamante.netlify.app` was retired on 2 Nov 2026 with a permanent redirect of every path to the same path on `https://bgonzalezbustamante.com`; its Netlify deploy is locked and the `academic-kickstart` repository is archived.

### Repository visibility

The GitHub repository is public. Before committing new files, check for secrets, personal data and third-party asset redistribution restrictions. Published Git history and branches can expose previously committed content, not just the current `main` tree; `.gitignore` does not protect material already committed. Keep image rights and attribution consistent with `CONTENT-LICENSE.md` and `NOTICE`.

### Release procedure

Finalise `README.md`, `CHANGELOG.md` and `lib/releases.ts` on the release branch. After explicit approval, merge the PR and verify the production deployment and affected routes. Tag **the merged `main` commit**, never an unmerged branch head, and publish a concise GitHub Release: mark release candidates (such as `v6.0.0-rc.2`) as **pre-releases**, but publish stable `v6.0.0` as a **standard release**. Update the package, footer and Release Notes metadata only at the approved stable-release gate.

## Release history

- Technical v6 history: [CHANGELOG.md](CHANGELOG.md)
- Plain-language [Release Notes](https://bgonzalezbustamante.com/release-notes) (source: `lib/releases.ts`)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)


## Licensing

Repository software is licensed under the MIT License; see `LICENSE`.

Original editorial website content authored by Bastián González-Bustamante is licensed under Creative Commons Attribution 4.0 International (CC BY 4.0) unless a page or asset states otherwise; see `CONTENT-LICENSE.md`.

Institutional branding, third-party logos and marks, publication material, externally sourced graphics, flags, photographs and other assets whose rights are not held by the repository author are excluded from those licence grants and remain subject to their respective rights; see `NOTICE`.
