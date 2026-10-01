# CHANGELOG

## v6.0.0-rc.1 "Swift Harbour" (in development)

### Summary

- Rebuilt `bgonzalezbustamante.com` as a Next.js 16 / TypeScript public academic website while preserving continuity with the previous Hugo/Wowchemy site in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).
- Established Research Dashboard's curated anonymous-safe Supabase RPCs as the only dynamic research-data boundary; runtime code does not query private Dashboard tables directly or use service-role credentials.
- Adopted a local-first release-candidate workflow. The legacy site remains in production while Swift Harbour is populated, tested and prepared for Netlify migration.
- Kept `v6.0.0-rc.1` open as an in-development release candidate for remaining content population, deployment work, SEO, accessibility and minor visual refinements.

### Application foundation and design

- Added the Next.js App Router, React 19, TypeScript, Node.js 22+ requirement, reproducible npm lockfile and local validation scripts; the pre-cut-over security pass moves Next.js and `eslint-config-next` to 16.3.8.
- Added responsive global navigation, footer, error handling, stable public detail routes and a shared site shell.
- Refined the global 404 page with the local transparent penguin illustration, using a responsive two-column desktop composition that stacks cleanly on smaller screens while preserving the existing 404 copy and home action.
- Added a keyboard-accessible “Skip to main content” link at the root layout level so keyboard users can bypass the repeated header/navigation on every route.
- Standardised the visual system around Roboto interface typography, Noto Serif editorial text, Oxford blue and Oxford coral, with Oxford aqua reserved for limited interaction states and washed Oxford-blue supporting surfaces.
- Standardised interface, academic-profile and research-resource iconography on locally bundled Font Awesome 7; the pre-cut-over quality pass removed the runtime Academicons CDN stylesheet/font dependency.
- Replaced the legacy header treatment with a three-affiliation home link using Leiden University, Universidad Diego Portales and OCPSG logos; institutional marks remain monochrome at rest and reveal their original colour on hover/focus.
- Added a content-hashed profile-portrait workflow: one JPG/JPEG/PNG source in `public/profile` is copied to a generated hash-named asset before development, checks and builds so image replacements invalidate caches automatically.
- Standardised safe Markdown rendering for publication/project abstracts and publication Key highlights, supporting headings, emphasis, lists, links, code and blockquotes without executing raw HTML.
- Added an optional manually maintained Website Carbon footer note as the first row of the right-hand footer metadata, followed by the Creative Commons/year/name line and the release version. `content/site-carbon.ts` stores the measured/report URLs, CO₂e-per-view estimate, rating, cleaner-than percentile and test date; `showInFooter` can suppress the public note without deleting the stored snapshot. The public label is intentionally compact (`Website Carbon · ~X.XX g CO₂e/view · Rating X`), and no Website Carbon API request is made at runtime.

### Academic profile and research practice

- Reworked Home around a portrait-led academic profile with three current positions, research interests, external-link cues, public contact information and institutional branding.
- The profile icon row begins with the public email contact, followed by ORCID, Google Scholar, GitHub and LinkedIn.
- Added paired DORA signer and Pro CRediT cards beneath the profile, plus dedicated `/dora` and `/credit` pages with local badge assets.
- Added a non-navigation `/trajectory` Academic trajectory page linked from the Home biography. It presents selected education, faculty appointments, research positions, teaching positions and consultancy as overlapping interval bands from 2004 to the present.
- The trajectory uses Oxford blue for completed periods and coral for ongoing periods; desktop uses a shared year axis and mobile collapses to grouped vertical entries.
- `content/trajectory.ts` is an intentionally manually maintained content source, grouped by category for straightforward editing and supporting optional `order` values as tie-breakers for identical intervals.
- Trajectory section icons identify Education, Faculty appointments, Research positions, Teaching positions and Consultancy. The bottom legend separates Building Columns = Tenure track, Research/Teaching icons = Non-tenure track, and Completed/Ongoing colour status.

### Public data boundary

- Public research data is consumed only through curated Research Dashboard RPCs: `list_public_papers()`, `get_public_paper(slug)`, `list_public_projects()`, `get_public_project(slug)`, `list_public_conference_presentations()`, `list_public_teaching()` and `get_public_work_analytics(year)`.
- Public-contract validation rejects private identifiers, workflow data, notes, activity-label relationships, tracked work-session detail, private links and other Dashboard-only metadata.
- Unknown public paper/project slugs map to the normal Next.js not-found behaviour; zero-row public lists are treated as valid empty states rather than triggering private-data fallbacks.
- The site uses the Supabase publishable/anonymous boundary only; service-role credentials are not part of the public application.

### Publications

- Added a full-width Publications browser with fixed Publication Index taxonomy, Year/Index filters, ten-record pagination with First/Previous/Next/Last controls, and KPI cards for Papers, distinct Journals/Venues and first-author percentage.
- Publication cards use the public citation when available, support safe Markdown abstracts and expose public DOI/Publication, Preprint, Project, Code, Dataset and SI File resources while keeping Overleaf private.
- Publication metadata supports English, Spanish, Portuguese, Dutch, German, French and Italian with accessible local SVG flags.
- Future publication dates are consistently treated as `Forthcoming`; publication details distinguish published month/year from forthcoming year.
- Detail pages support optional Key highlights with local images, alt text and captions, and reverse public Project relationships so multiple associated projects can be shown.
- The public paper client consumes only the latest stored Google Scholar citation snapshot exposed by Research Dashboard: nullable citation count plus capture date, never citation history or source metadata.
- Added `/publications/profile` with output-over-time, latest Google Scholar citation profile, publication-index/language composition, average citations by index/language/authorship, and authorship structure.
- Publication-profile co-author/average-author KPIs exclude the exceptional 494-author collaboration `Investigating the analytical robustness of the social and behavioural sciences`; other profile analyses continue to use the complete public corpus.
- Added `/publications/coauthorship`, excluding publications with more than five authors. Node size represents publications in the displayed network and edge width represents joint publications.
- Co-authorship layout uses deterministic weighted modularity on the collaborator-only graph (central-profile edges excluded from community detection). Repeated co-authorship to the profile shortens central links; within-community collaborator links use a common preferred distance.
- Cross-community bridge ties remain visible and exert only weak long-range attraction. Community-envelope spacing, cross-community collision buffers and node-level collision resolution preserve distinct groups while allowing bridge relationships to influence orientation.

### Projects

- Added `/projects` and `/project/[slug]` using only public Project RPCs, with Featured/Other grouping and one shared ordering rule: later `end_year`, later `start_year`, then title.
- Project cards and detail pages support status/period tags, funder notes, canonical project URLs and optional local funder/project imagery.
- Detail pages follow About the project → visual/map → Research outputs → Funding.
- Research outputs combine associated public publications and project-linked public conference presentations; the conference table is shared with Conferences, including Keynote markers.
- Publication detail pages reverse the public `publication_slugs` relationship to show associated projects.
- Added the TERGAP 47-country derived map snapshot under `public/data/tergap-map.json` using `react-simple-maps`, `world-atlas` and ISO-country conversion. The website stores only the compact derived snapshot, not the source dashboard dataset.
- TERGAP uses its ERC funding asset as a configured presentation fallback where no public funder-image filename is supplied. PNG project figures/logos are served losslessly; other detail imagery can use quality 90.

### Conferences

- Added `/conferences` as a dashboard-style public presentation record with KPI cards, Presentation map, paginated Overview table with First/Previous/Next/Last controls, and full current-year roadmap.
- Public conference data supports ordered authors, event short names, start/end date ranges, location, presentation type and optional external URL; private notes and Dashboard paper relationships remain excluded.
- Presentation types are constrained to Conference paper, Keynote and Workshop. Keynotes carry a small coral marker and legend in the shared conference table.
- Country totals/maps exclude `Virtual` presentations and report the virtual count separately.
- Conference presentation titles become external links when a public URL exists; the former trailing external-link column is not rendered.
- The full current-year roadmap is a multi-row continuous snake timeline ordered by `start_date`, with state determined by `end_date`; labels show short event name plus location.
- Home uses a compact five-presentation timeline instead, prioritising ongoing/forthcoming presentations and then the most recently completed presentations.

### Teaching

- Added `/teaching`, backed exclusively by `list_public_teaching()`, with no Teaching detail routes.
- Teaching cards expose only public course name, institution, summary, controlled role, period/current status, levels, times taught, cumulative students and optional local image filename. The role is rendered as a metadata tag after the academic level tag(s), using the controlled values Course Convenor, Lecturer, Tutor, Thesis Supervisor and Examiner.
- Cards use a one-per-row layout, alternate image placement across the complete ordered list, collapse to image-above-content on mobile and paginate at five records with First/Previous/Next/Last controls.
- Teaching imagery uses the Project logo/contain treatment inside an Oxford-blue-wash visual area, with a local teaching icon fallback.
- KPI cards report cumulative Teaching/Supervision occurrences, distinct Institutions and cumulative Students.
- Public-contract checks validate the controlled Teaching role when present and explicitly reject internal Teaching IDs, activity-label relationships, tracked hours/sessions and owner metadata.

### Home population, activity and roadmap

- Home order is Academic profile → DORA/CRediT → Population in progress → Featured publications → Featured projects → Activity over time → compact Conferences timeline.
- Featured publications are capped at four; Featured projects use the shared public project ordering and two-column layouts on wider screens.
- Added Population in progress using live public record counts against deliberately manual intended-ingestion targets maintained in `lib/site-population.ts`.
- Added `POPULATION_SETTINGS.showProgress` as the single manual display switch for population progress; setting it to `false` hides both the Home population card and all section-level progress strips without removing targets, periods or coverage logic.
- Population year strips use domain-specific periods and align to a common Home grid. Publications, Projects, Conferences and Teaching also expose lightweight section-level population strips.
- Site population readiness uses fixed category weights of 35/30/15/20 for Publications/Projects/Conferences/Teaching and marks a 60% launch threshold.
- Added current-year aggregate Activity over time using `get_public_work_analytics(year)`, with daily net-minute heatmap bins plus Working hours per day and Coffee per working day annual averages. Individual work sessions and daily coffee counts are never exposed.

### Maps, dates and shared presentation behaviour

- Conferences and TERGAP share the same responsive geographic-map system and no-data canvas treatment while retaining domain-specific colour scales and hover states.
- Conference and Roadmap date handling uses explicit start/end ranges; future/past state and ordering no longer depend on the deprecated single presentation-date model.
- Shared conference tables are reused in project Research outputs to keep presentation formatting, external links and Keynote markers consistent.
- Public page introductions for Publications, Projects, Conferences, Teaching, Publication profile, Co-authorship network and Academic trajectory use the full site-shell width where appropriate.

### SEO and metadata

- Standardised explicit canonical metadata across the public surface. Home now declares `/`, while DORA, CRediT and Release Notes declare `/dora`, `/credit` and `/release-notes`; existing section/detail canonicals remain unchanged and resolve against `NEXT_PUBLIC_SITE_URL`.
- Added an environment-aware `robots.txt` route: only the final HTTPS production hosts (`bgonzalezbustamante.com` and `www.bgonzalezbustamante.com`) are indexable; localhost, Netlify previews and temporary deployment URLs are disallowed by default.
- Added matching metadata-level `noindex`/nofollow protection for non-production hosts so preview URLs are protected even beyond crawler-level `robots.txt` controls.
- Added a generated `/sitemap.xml` covering static public routes plus live public publication/project detail routes; production `robots.txt` advertises it.
- Added author/creator/publisher root metadata while preserving per-route canonical metadata.

### Accessibility, security and performance

- Added a consistent visible keyboard focus treatment, restored focus visibility on interactive map countries, and added table captions/column scopes for conference and CRediT tables.
- Added reduced-motion handling for global smooth scrolling/transitions and the Featured projects carousel.
- Added baseline response hardening with a restrictive framing/object/base CSP, Permissions Policy, strict-origin referrer policy, MIME sniffing protection and frame denial.
- Removed the external Academicons runtime request by using bundled Font Awesome equivalents for ORCID and Google Scholar and a local link icon for DOI.
- Parallelised independent homepage public-data requests with `Promise.allSettled()` while retaining independent failure/empty states.

### Legacy URL migration

- Added permanent Next.js redirects for the legacy Publications and Projects section indexes, the former author profile, the CPS Ranking landing page, and legacy Project URLs with clear Swift Harbour replacements.
- Preserved publication detail URLs wherever the Hugo/Wowchemy slug already matches the current public publication slug, avoiding unnecessary redirect hops.
- Intentionally avoided catch-all redirects for legacy publications, projects and specialist pages that have no current equivalent; those continue to use normal not-found behaviour rather than soft-404-style generic destinations.

### Release notes and documentation

- Established `v6.0.0-rc.1 "Swift Harbour"` as the first Next.js release-candidate identity; package version and footer use the same release data.
- Added structured public Release Notes as a plain-language capability summary; detailed implementation history remains in this CHANGELOG.
- Release Notes link to the current v6 CHANGELOG and the legacy `academic-kickstart` CHANGELOG without duplicating pre-v6 technical history.
- The Release Notes introductory description now uses the full site-shell width rather than the generic narrow reading measure.
- The current release remains `In development` with `Release date TBC`; merging the development branch into `main` does not close or tag rc.1.
- Reworked README around the current rc.1 architecture, public surface, intentionally manual population/trajectory/carbon sources, validation commands and staged Netlify-to-production deployment plan; removed obsolete Phase 4/intermediate implementation wording already covered by this CHANGELOG.

### Local validation and deployment preparation

- `npm run check` runs ESLint and TypeScript; `npm run check:public-contract` validates anonymous-safe RPC payloads; `npm run build` performs the production Next.js build.
- Profile portrait synchronisation runs automatically before development, checks and builds.
- Local-first development remains the default through rc.1; the separate `academic-website-swift-harbour` Netlify project now follows validated `main` for deployment verification.
- The temporary Netlify deployment and manual public-surface smoke test completed successfully before the quality-hardening pass.
- The legacy `bgonzalezbustamante.com` deployment remains untouched until the Netlify replacement is verified.
- Legacy redirect implementation is complete; deployment-level redirect verification, Website Carbon re-testing, production-domain migration and final release tagging remain rc.1 work.

## Previous implementation

This repository continues the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart), whose final legacy release is **v5.4.9 (21 Sep 2026)**.

The pre-v6 site evolved through several generations of the Academic/Wowchemy Hugo stack and Netlify deployment, adding publication management and automation, academic profile content, projects and resources, presentations, and other research-facing material. The complete historical record remains in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md) and is intentionally not duplicated here.
