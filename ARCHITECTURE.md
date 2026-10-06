# Architecture

This repository is the Next.js production implementation of [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and the continuation of the academic website previously implemented in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart). The predecessor is retained temporarily at `legacy-bgonzalezbustamante.netlify.app` as a rollback copy.

The full pre-v6 history is retained in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md). This repository starts a fresh changelog at v6.0.0-rc.1 "Swift Harbour".

## Boundary

```text
Research Dashboard (private/admin)
          │
          │ curated Supabase RPCs
          ▼
Academic Website (public/read-only)
```

The public application uses the Supabase publishable key only. It has no service-role credentials and no table-level data access in application code.

## Public contracts

The site is allowed to call only:

- `list_public_papers()`
- `get_public_paper(text)`
- `list_public_projects()`
- `get_public_project(text)`
- `list_public_conference_presentations()`
- `list_public_teaching()`
- `list_public_software()`
- `get_public_software(text)`
- `get_public_calendar_settings()`
- `get_public_work_analytics(year)`
- `list_public_availability(year)`
- `get_public_teaching_settings()`

The current production contract can validly return zero public papers when no Dashboard paper has been explicitly marked Public. The site must treat that as a curated empty state rather than falling back to private tables or the legacy publication corpus.

Aggregate work analytics are rendered on the homepage for the current Europe/Amsterdam calendar year. The public site reproduces the Dashboard Activity over time heatmap from daily net working minutes and shows only the two annual averages already exposed by the RPC: net working time per working day and coffees per working day.

### Software Ecosystem

Software Ecosystem is supplied exclusively through `list_public_software()`. The public `/software` page renders self-contained cards and does not expose software detail routes. Cards may show the public name, short description, category, current version, development stage, status, repository visibility, safe repository URL, production URL, documentation URL, lifecycle years and Featured state.

Repository visibility is independent from profile exposure. When `repository_visibility` is `private`, `repository_url` must remain null even for an otherwise public Software Ecosystem profile. `get_public_software(text)` is validated as part of the public contract for forward compatibility, but rc.2 does not use it for navigation because its current detail shape is intentionally identical to the listing shape.

The homepage links to `/software` inline beside Academic trajectory. Software is intentionally absent from the primary navigation.

### Selected paintings

`/paintings` is intentionally local editorial content rather than an Academic API contract. The small curated dataset lives in `content/paintings.ts` and records artwork metadata, official museum links, image-source URLs, image-rights metadata and one of a small set of editorial layout hints. Display titles follow the canonical catalogue wording used by the holding institution, preserving the institution’s own language rather than imposing English translations.

Desktop presentation uses a controlled 12-column mosaic that exploits the works' contrasting proportions while preserving every complete image with `object-fit: contain`. The four complete rows use 8+4, 4+4+4, 7+5 and 5+7 column spans, with `The Colossus` and `The Tower of Babel` forming the mirrored final row. At 760px and below, all grid spans are discarded and the page becomes a single-column sequence using each image's natural aspect ratio.

The nine reproduced artwork JPEG sources are kept at `assets/sources/paintings/<slug>.jpg` and compiled into hashed quality-95 WebP variants served locally from `public/paintings/generated/`. The artwork cards use native responsive `srcSet`/ `sizes` instead of recompressing the generated WebP through Next.js. Original Wikimedia Commons URLs remain linked as provenance, and the images remain outside the repository's own software/content licences. The rights line is visible on every reproduced card. `Las distracciones de Dagoberto` by Leonora Carrington, `A Walk through Primordial Garden` by Matthew Wong and `L'étagère` by Pablo Picasso are represented in compact bottom mini-cards, with links to MALBA, Van Gogh Museum material and ALBERTINA respectively, because suitable republication rights have not been established.

### Weekly timeline integration

The non-navigation `/weekly-timeline` route integrates the seven-day `WeeklyPenguinTimeline` and `PenguinSprite` components from `weekly-penguin-timeline` (`main` revision `3c284218abf95353e128babf1e89ec04812992f0`). It excludes the standalone state tester, gallery and release notes. The isolated `lib/weekly-timeline/` namespace ports its validated public work/coffee, conference, availability, teaching and Catholic Calendar logic without duplicating the website's anonymous-safe Supabase client. The page is dynamic to respect the Amsterdam civil date and uses the source's special-day precedence and fail-closed public API handling.

`app/weekly-timeline/weekly-timeline.css` scopes the source project's timeline and responsive navigation styles to `.weekly-timeline-embed` to protect the academic website's global layout. The 46 original penguin PNG masters and their WebP generation pipeline remain in the standalone repository; this page serves the published WebP derivatives via `https://timeline.bgonzalezbustamante.com/penguins/` (there is no iframe or remote JavaScript). This creates an intentional dependency on the standalone image host. The graphics retain the original CC BY-NC 4.0 artwork licence as documented in `NOTICE`. The route is included in the sitemap and linked beneath the homepage Activity over time heatmap.

### Static raster image pipeline

`scripts/build-images.mjs` is the only generator for three intentionally supported image families. It reads `assets/sources/profile/avatar.png`, the nine slug-matched `assets/sources/paintings/*.jpg` files and `assets/sources/branding/{leiden,udp,ocpsg}.png`. The pre-development, pre-check and pre-build scripts run it automatically. An explicit direct run is available as `npm run assets:build`.

The output contains content-hashed `.webp` files under `public/{profile,paintings,branding}/generated/` and an ignored `content/image-assets.generated.ts` manifest with the public URLs. The generated directories are rebuilt from scratch; old files never accumulate. The portrait preserves the full source aspect ratio and is resized without upscaling to fit 660px, at quality 95. The nine paintings receive distinct responsive widths up to 1800px, also at quality 95. Branding is resized without upscaling to fit 168px and encoded losslessly. Source originals are not published under `public/`.

The profile image is delivered without additional Next.js optimisation to avoid a second lossy encode. Branding images are also delivered without re-encoding so lossless colours and edges are preserved. After conversion, the build reopens the resulting WebP files and checks their format and dimensions, confirms the painting `srcSet` candidates and file sizes, and verifies that the Leiden logo still has fully transparent pixels. This validation runs as part of the normal image-generation step. Projects, funders, teaching, publication imagery and vector Christicons retain their existing handling. The unused legacy `oxford.webp` has been removed.

The homepage exposes `/paintings` through a small Selected paintings link below Main Interests. The page is deliberately absent from the primary navigation.

### Publication Key highlights

Citation and Key highlights are deliberately detail-only presentation metadata. `list_public_papers()` remains the compact canonical publication listing and does not expose them. The Publications page resolves each already-public slug through `get_public_paper(text)` to obtain the owner-entered citation without querying Dashboard tables. `get_public_paper(text)` additionally provides:

- `citation`
- `highlight_text`
- `highlight_image_filename`
- `highlight_image_alt`
- `highlight_image_caption`

When configured, the publication detail route resolves the image only from the academic website's local static convention:

```text
/public/publication-highlights/<paper-slug>/<filename>
→ /publication-highlights/<paper-slug>/<filename>
```

The site never derives a Supabase Storage URL for these assets. The supplied alt text is used when an image filename exists, captions remain optional, and an entirely empty highlight configuration renders nothing. On `/publications`, the citation replaces the separate visible title/authors/venue presentation while the year/index/Featured tags and resource links remain. Year and Publication index filters are client-side filters over the already-public list metadata.

### Projects and Conferences

Projects are supplied exclusively through `list_public_projects()` and `get_public_project(text)`. The website intentionally does not consume or render a Project role, even if the upstream public payload exposes one. Associated papers are represented only as already-public publication slugs and are resolved against `list_public_papers()`; the website never queries project-paper tables. Projects may also expose `conference_presentations[]`, using the same intentionally public presentation shape as the standalone Conferences contract. Project detail renders a peer-level **Research outputs** section after **About the project**, with **Associated publications** and **Conference presentations** subsections as applicable; **Funding** is always rendered last. Project Funding presentation may use the public `funder_note`, and project cards prefer the configured funder image before the project image. Homepage Featured projects are ordered by later `end_year` first.

Project images and funder logos are local static assets:

```text
/public/projects/<slug>/<project_image_filename>
/public/funders/<funder_image_filename>
```

Conferences are supplied exclusively through `list_public_conference_presentations()`. The standalone Conferences dashboard derives its country count from the final `City, Country` location segment, computes the Keynote percentage from public `presentation_type`, presents KPI cards before an Oxford aqua/blue map with coral hover, and uses a compact 10-row paginated presentation table while preserving the RPC's descending-date record order. Keynote rows are identified with a small star beside the presentation title and a legend below the shared table, including when that table is reused inside project Research outputs. The homepage Roadmap filters presentations to the current Europe/Amsterdam year, orders them chronologically by `presentation_date`, groups them into rows of at most five, and connects successive rows as one continuous timeline while showing the public short event name with the presentation location beneath it. Notes, internal owner IDs and optional Dashboard paper relationships are intentionally absent and are neither requested nor inferred.

### Teaching Portfolio

Teaching is supplied exclusively through `list_public_teaching()`. The public website consumes only the course name, institution, summary, controlled teaching role, period/current state, `levels[]`, cumulative times taught, cumulative student count and optional course-image filename. Teaching roles are limited by the public contract to Course Convenor, Lecturer, Tutor, Thesis Supervisor and Examiner, and are rendered as metadata tags after the academic level tag(s). The RPC may also expose an optional slug for contract stability, but the academic website does not use it for navigation: Teaching cards are deliberately self-contained and there is no `/teaching/[slug]` route.

Teaching activity-label relationships, tracked teaching hours, session counts, owner metadata and internal IDs remain private and are neither requested nor inferred by the academic website. Course imagery follows the local static convention:

```text
/public/teaching/<course_image_filename>
→ /teaching/<course_image_filename>
```

If a configured local course image is absent, the card falls back to a teaching icon rather than attempting to derive an asset from Research Dashboard.

### TERGAP geographic snapshot

TERGAP geographic coverage is sourced from the separate public [tergap-dashboard](https://github.com/bgonzalezbustamante/tergap-dashboard), not from Research Dashboard. The academic website stores a compact derived snapshot at:

```text
/public/data/tergap-map.json
```

It contains only the TERGAP dashboard generation timestamp, collection window and country-level ISO-3/article-count values required for the map. The shared map component uses `react-simple-maps` and bundled `world-atlas` geometry. TERGAP uses the original dashboard treatment exactly for the map canvas/background (`#eef0f7`), not-collected geography (`#e8eaed`), six-step logarithmic scale (`#e7eaf4` → `#001158`) and teal hover (`#007679`). Conferences uses the same canvas and grey no-data geography with an Oxford aqua/blue data scale and Oxford coral reserved for hover. The TERGAP map alone uses the source dashboard's Africa-centred Equal Earth viewport (centre [15°, 5°], scale 245); the shared Conferences map retains its default world projection (scale 150). The TERGAP map is shown on the TERGAP detail page; project cards use funder imagery instead, with the TERGAP ERC logo supplied locally as a presentation fallback.

## Information architecture

The production site preserves the conceptual structure of the former Hugo/Wowchemy homepage without reproducing Wowchemy's widget system.

The public structure is:

```text
/
├── academic profile / research interests
├── DORA / CRediT research-practice cards
├── featured publications
├── featured projects
├── Activity over time
├── current-year presentation Roadmap
└── contact / external links

/publications
└── /publication/[slug]

/projects
└── /project/[slug]

/conferences

/teaching

/dora
/credit
/release-notes
```

A separate Preprints route is not required at the architecture level. Public research outputs can be presented from the same canonical publication contract and grouped later according to curated metadata if the final content design calls for it.

## Design system

The public site deliberately shares a visual family with Research Dashboard while remaining a distinct academic website.

- Roboto is used for navigation, headings, controls, labels and compact metadata.
- Noto Serif is used for longer editorial/body text.
- Oxford blue (`#002147`) is the primary structural colour.
- Research Dashboard charcoal, ash, stone, off-white, cool-grey and sky-blue tokens provide the neutral surface system.
- Oxford coral (`#FE615A`) is the main secondary accent for links, rules and emphasis.
- Oxford aqua (`#00AAB4`) is deliberately limited to small interactive states.
- A washed Oxford-blue surface (`#edf2f7`) provides supporting backgrounds without competing with the primary blue/coral identity.
- Locally bundled Font Awesome provides interface, brand and scholarly-profile icons; no external icon stylesheet/font is required at runtime.

Institutional branding is presented as a compact monochrome affiliation strip using the supplied Leiden University, Universidad Diego Portales and OCPSG assets. `content/positions.ts` is the single ordered configuration for current roles, institutions, links and generated branding assets: rearranging that array simultaneously reorders the homepage positions and navbar logo strip. The strip links back to the website home page; the smaller logos next to each position link to the corresponding institution. This local presentation boundary can eventually be replaced by Academic API current-position records without maintaining two separate ordering lists. The supplied Leiden seal is also the favicon. The profile portrait is carried forward from `academic-kickstart`.

## Immediate data sources

### Research Dashboard public contracts

Available now:

- publication title
- ordered authors
- abstract
- current venue
- publication date
- DOI/publication URL
- preprint URL
- GitHub URL
- Dataverse/dataset URL
- featured state
- publication index
- aggregate work analytics
- detail-only publication Key highlight metadata
- public projects with canonical URL, years, status, Featured state, funder note and static asset filenames
- associated publication slugs restricted to independently Public papers
- conference presentations with public short event names and presentation-specific ordered authors
- public Teaching Portfolio cards with institution, summary, years/current state, multiple levels, cumulative times taught/students and a local course-image filename

### Legacy academic website

Still static/deferred in [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart):

- education detail beyond the current short biography
- legacy project/resource material not yet represented by a Public Research Dashboard project record
- service detail
- CV asset/link
- historic publication corpus not yet present in Research Dashboard

The homepage profile, three main appointments, portrait, selected project links, email and institutional address are now maintained directly in this public repository as presentation content. The same applies to the DORA statement and the migrated CRediT taxonomy page, which are static research-practice content rather than Dashboard-managed records.

These should not be copied into a new database or CMS in this repository.

## Local validation

The repository includes `scripts/check-public-contract.mjs` so the public RPC boundary can be tested locally with the same Supabase publishable key used by the website.

The check deliberately calls public RPCs only. It provides a reproducible way to verify integration without creating Netlify builds.

## Legacy URL migration

The Hugo/Wowchemy and Next.js sites share many publication detail slugs, so matching `/publication/[slug]` URLs remain canonical without a redirect. `next.config.ts` contains only exact permanent redirects for routes with a clear replacement, including the former singular section indexes, author profile, CPS Ranking landing page and selected legacy Project pages.

There is intentionally no legacy catch-all. Old research resources or publications that are not yet represented by the current public site should return normal not-found behaviour until a genuine replacement exists, rather than being redirected to a generic section page.

### Catholic Calendar footer

The footer consumes the exact `@bgonzalezbustamante/catholic-calendar@0.1.0-beta.1` package rather than duplicating calendar rules. A small client component polls `get_public_calendar_settings()` every five minutes. When `catholic_calendar_active` is false, the calendar footer is hidden. When it is true and `stress_test_active` is true, the footer renders the deterministic maximum-width stress composition from 21 November 2027; otherwise it resolves the current civil date in `Europe/Amsterdam` through `getCatholicCalendarState()` and `getCalendarDisplaySummary()`.

The composed display remains fixed at the package contract's maximum of two items. The entire display links to `https://catholic.bgonzalezbustamante.com/` and uses local Christicons masks corresponding to the semantic icon identifiers returned by the package. The right-hand footer order is Catholic Calendar → Website Carbon → release version.

`scripts/check-calendar-footer.mjs` runs fast deterministic footer fixtures before production builds. It protects the 85-character maximum-width composition identified by the full beta.1 range audit — `Our Lord Jesus Christ, King of the Universe · Presentation of the Blessed Virgin Mary` — together with the long St Michael's Lent/countdown composition and the 5 October 2026 integration sample. `scripts/audit-calendar-footer.mjs` retains the exhaustive 2000–2100 scan for deliberate package/release audits rather than every deployment.

## Development and deployment

Development remains local-first. After the local npm/public-contract/build gate passes, validated changes are merged into `main` and deployed through the Netlify project `bgonzalezbustamante`, which serves the canonical production domain `https://bgonzalezbustamante.com`.

Search metadata is environment-aware. Canonicals use `NEXT_PUBLIC_SITE_URL`; non-production hosts receive metadata-level `noindex` plus a disallowing `robots.txt`, while production `robots.txt` allows indexing and advertises the generated sitemap. Baseline security headers are configured in `next.config.ts`.

The production cut-over completed on 1 Oct 2026 after temporary-deployment smoke testing, SEO/accessibility/security/performance hardening, exact legacy-redirect verification and a post-cut-over Website Carbon re-test. `www.bgonzalezbustamante.com` redirects to the apex domain, and the default production Netlify hostname redirects permanently to the equivalent canonical `.com` path.

The predecessor remains temporarily available at `legacy-bgonzalezbustamante.netlify.app` as a rollback copy.

## Deferred work

- Continue population and reconciliation of historical publication, project, conference and teaching records as required.
- Add remaining profile/service/CV material only when it has a clear place in the current information architecture.
- Archive the legacy Netlify project and predecessor repository after the post-migration observation period and once rollback is no longer required.
