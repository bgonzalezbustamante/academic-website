# CHANGELOG

## v6.0.0-rc.1 "Swift Harbour" (in development)

### Summary

- Started the Next.js replacement of `bgonzalezbustamante.com` as a separate public/read-only application.
- Continued the website version line from the Hugo/Wowchemy implementation in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart) while starting a fresh v6 changelog.
- Established Research Dashboard's curated Supabase RPCs as the only dynamic research-data boundary.
- Adopted a local-first development workflow during the release-candidate stage, with Netlify reserved for selective milestone verification.

`project continuity`

- Defined v6 as a technical replacement and continuation of the existing academic website rather than an unrelated new product.
- Kept [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart) unchanged and in production during parallel development.
- Preserved the detailed pre-v6 history in the [legacy CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md).

`design system and academic identity`

- Reworked the site around the Research Dashboard visual language: Roboto interface typography, Noto Serif editorial text, Oxford blue, charcoal, ash, stone, off-white and cool-grey surfaces.
- Added the OCPSG Benchmarking coral (`#FE615A`) and teal (`#00AAB4`) palette as restrained accent colours for links, icons and small emphasis states.
- Reduced the homepage name scale further and restored a portrait-led academic profile layout, with the three positions shown as compact one-line entries directly below the name.
- Added a third main position: Research Leader, Oxford Computational Political Science Group, with external institutional links for Leiden University, Universidad Diego Portales and OCPSG.
- Replaced the BGB header mark with a three-affiliation home link using the supplied Leiden University, Universidad Diego Portales and OCPSG logo assets in a consistent monochrome treatment.
- Added Font Awesome 7 and Academicons for academic profiles, external links and publication resources.
- Restored the profile portrait from `academic-kickstart` and prioritised the supplied Leiden seal as the site favicon.
- Added the revised two-paragraph academic biography with consistent external-link arrows for the ECPR Political Methodology Steering Committee, TERGAP, COST Action CA22150 and the Enlace-Inserción UDP project.
- Added compact public email and Leiden University Wijnhaven address information to the footer, with a Creative Commons mark beside the year and name.
- Renamed the research-interest panel to `Main Interests` and restored compact coral square bullets.
- Removed the redundant Publications button below the biography.
- Rebalanced the colour system toward Oxford blue and Oxford coral, reserving Oxford aqua for small interactive states and using a washed Oxford-blue background for supporting surfaces.

`Phase 4 foundation`

- Added a Next.js App Router and TypeScript foundation with a distinct public academic-site design.
- Added responsive global navigation, footer, homepage, publication listing and stable publication-detail routes.
- Replaced the initial developer-facing homepage architecture card with a public academic profile presentation covering three main appointments and research interests.
- Refined the responsive site shell for smaller screens.
- Added an RPC-only Supabase client for explicitly curated public paper data.
- Confirmed that zero Public papers is a valid current state of `list_public_papers()` and designed the site to handle that state without private-data fallback.
- Added a current-year public Activity over time heatmap using only `get_public_work_analytics(year)` and the same working-time thresholds as Research Dashboard.
- Added current-year cards for Working Hours per day and Coffee per working day, with working time shown as hours/minutes and coffee shown to one decimal, both with an `on average` label, without exposing individual sessions or daily coffee counts.
- Tightened the vertical spacing between the Academic profile, Featured publications and Activity over time sections.
- Added paired DORA signer and Pro CRediT research-practice cards immediately below the Academic profile.
- Added a British-English `/dora` page summarising the San Francisco Declaration on Research Assessment and its implications for responsible research assessment.
- Added the official horizontal DORA signatory badge as a local public asset.
- Migrated the legacy `/credit` Contributor Roles Taxonomy page, including all fourteen CRediT badges, while dropping the former Training Data Lab cross-reference.
- Integrated detail-only publication Key highlights from `get_public_paper(slug)`, with optional text, local static images, supplied alt text and restrained captions under `/public/publication-highlights/<paper-slug>/`.
- Added RPC-backed `/projects` and `/project/[slug]` routes with Featured projects, canonical project URLs, years, status, funder presentation, optional local project/funder imagery and associated Public publications.
- Added an RPC-backed `/conferences` page using presentation-specific ordered authors while deliberately excluding private notes and Dashboard paper relationships.
- Added Projects and Conferences to standalone navigation.
- Added a top-level `/teaching` Teaching Portfolio after Conferences in primary navigation, backed exclusively by `list_public_teaching()`.
- Added one self-contained Teaching card per row with course image/fallback, current/period/level tags, course name, institution, summary, cumulative times taught and cumulative student count; no Teaching detail routes or card links are created.
- Added Teaching KPI cards for cumulative Teaching occurrences (sum of `times_taught`), distinct Institutions and cumulative Students.
- Calibrated the Teaching card visual to a maximum 320 px desktop column and matched the responsive Next.js `sizes` hint to the actual rendered width.
- Teaching card imagery now follows the Project funder/logo treatment: images remain centred and fully visible with `object-fit: contain`, are capped at 190 px wide / 120 px high, and sit inside the same 180 px Oxford-blue-wash visual area used by Project cards.
- The Teaching Portfolio alternates course-image placement by overall item order (left, right, left, right, …) while retaining image-above-content cards on mobile.
- Added client-side Teaching pagination at five portfolio items per page; the left/right sequence continues across page boundaries rather than restarting on each page.
- Updated the Teaching introduction to “Courses taught and supervision across undergraduate, postgraduate, and doctoral programmes.” and renamed the Teaching KPI label to “Teaching/Supervision”.
- Expanded the Teaching introductory text to use the full site-shell width rather than the shared narrow page-lead constraint.
- Added the local `/public/teaching/<course_image_filename>` asset convention with a teaching-icon fallback for missing files.
- Extended public-contract validation to cover Teaching Portfolio arrays/counts/years and reject private teaching IDs, activity-label relationships, tracked hours and session counts.
- Presented Featured publications and Featured projects as two-card-per-row grids on wider screens; Featured projects remain ordered by later project end year first and use configured funder imagery before project imagery.
- Added a current-year horizontal two-sided Roadmap after Featured projects, using only public `event_short_name` labels ordered chronologically by presentation date.
- Reordered the homepage to Academic profile → DORA / CRediT → Featured publications → Featured projects → Activity over time → Roadmap.
- Restyled publication year/index/Featured metadata and project status/period/Featured metadata as compact tags.
- Added a citation-based Publications listing using the detail-only public citation field, while retaining tags above and resource links below.
- Added Publications filters for Year and Publication index.
- Replaced the dynamically alphabetised Publication Index filter with a fixed seven-category Publication Index taxonomy in this order: WoS-SSCI, Scopus, WoS-ESCI, Book chapter, SciELO/Latindex, Working paper, Preprint.
- Added Publications KPI cards for total papers, distinct journals and single-author percentage, using only the public publication list.
- Extended citation rendering to support Markdown bold (`**text**`) and display bold citation emphasis in Oxford coral.
- Added small status icons to the homepage Roadmap: a completed-state icon for past presentations and a calendar icon for forthcoming presentations.
- Institutional logos remain monochrome at rest and transition to their original colour on hover; position-logo links also support the colour treatment on keyboard focus.
- Kept the Conference map data scale in Oxford aqua/blue tones and reserved Oxford coral for the hover state.
- Updated the Publications introduction to “Papers ordered from the most recent publication onwards.”
- Aligned the Publications page width with Projects and Conferences by using the full site shell instead of the narrower content shell.
- Removed the separator between the Academic profile and DORA / CRediT cards.
- Updated the current-year Roadmap heading to “Conferences”, added the contextual line “Public presentations at conferences, workshops, and seminars during [year].”, and retained the past/upcoming visual distinction.
- Changed Roadmap event labels to two lines: status icon + short event name on the first line, with the presentation location in smaller text below.
- Moved publication Key highlights below the Abstract on publication-detail pages.
- Key highlight text now supports safe Markdown rendering for headings, bold/italic emphasis, lists, links, inline/fenced code and blockquotes without executing raw HTML.
- Publication and project abstracts now use the same safe Markdown renderer as Key highlights, replacing the earlier project-only bold-text helper with one shared research-text pipeline.
- Extended Project Funding presentation with the configured funder logo and public `funder_note`.
- Project Research outputs now combine associated public publications and the public `conference_presentations[]` contract; conference presentations reuse the Conferences Overview table.
- Reordered project detail content so Research outputs follows About the project and Funding is always the final section.
- Moved project visuals, including the TERGAP map, below the About the project section and above Research outputs / Funding.
- Improved project-image sharpness by separating card and detail rendering expectations: detail images now use a full-width responsive hint, optimized non-PNG assets can use quality 90, and PNG figures/logos are served losslessly to avoid compression artefacts.
- Restored two project cards per row on wider screens.
- Added a TERGAP-specific world coverage map on the TERGAP detail page, using a compact 47-country snapshot derived from `tergap-dashboard` and displaying its generation timestamp.
- Reused the TERGAP dashboard ERC logo as the TERGAP funder image on Home/Projects cards and in the Funding block when no Dashboard funder-image filename is configured.
- Matched the TERGAP detail map to the original dashboard: map canvas `#eef0f7`, grey not-collected countries `#e8eaed`, original six-step scale from `#e7eaf4` to `#001158`, and teal hover `#007679`. Conferences uses the same canvas/grey no-data treatment with an Oxford aqua/blue scale and Oxford coral hover.
- Reworked `/conferences` into a dashboard-style view headed by “Conference and public presentations”: KPI cards first, then the geographic map, followed by a compact presentation table.
- Changed the Publications and Conferences authorship KPI from co-authorship percentage to single-author percentage.
- Removed the Conference Type column and added client-side pagination at 10 presentation rows per page.
- Removed the optional external-link column from conference presentation tables so rows without URLs no longer show a trailing dash; the shared change applies both to the Conferences overview and project Research outputs.
- Conference presentation titles now become external links when a public URL is available, using the same small coral external-arrow treatment as biography links.
- Added the same reusable Oxford-styled world-map system for TERGAP and Conferences using `react-simple-maps`, `world-atlas` and ISO-country conversion.
- Added a public-safe application error boundary that does not reveal internal Dashboard information.

`local development and validation`

- Added `npm run typecheck` and `npm run check` for local TypeScript and lint validation.
- Expanded `npm run check:public-contract` to validate Publications/detail highlights, Projects/detail, Conferences and aggregate work analytics using only the Supabase publishable key.
- Added boundary checks ensuring Key highlights remain detail-only, project publication slugs resolve only to Public papers, and conference notes/owner/paper IDs are absent.
- Standardised the application on Node.js 22 or later because the current Supabase JavaScript stack has ended Node 20 support and uses native WebSocket support available in Node 22+.
- Documented the local-first workflow and target information architecture in the README and architecture notes.

`release management`

- Established v6.0.0-rc.1 "Swift Harbour" as the first release identity in the new repository.
- Added structured public release-note data and a dedicated Release Notes page following the Research Dashboard release model.
- Condensed the public Release Notes into a plain-language capability summary while retaining implementation-level detail in this CHANGELOG.
- Added direct links from Release Notes to this repository's v6 CHANGELOG and, afterwards, the legacy academic-kickstart CHANGELOG.
- Added the current release identity to the site footer.
- Updated the package version to `6.0.0-rc.1`.

`development and deployment`

- Documented local development as the default workflow during early release-candidate work.
- Deferred automatic GitHub-to-Netlify deployment on every push to a later development stage to conserve build minutes.
- Kept `bgonzalezbustamante.com` on the legacy Hugo/Wowchemy deployment until the verified production-migration phase.

## Previous implementation

This repository continues the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart), whose final legacy release is **v5.4.9 (21 Sep 2026)**.

The pre-v6 site evolved through several generations of the Academic/Wowchemy Hugo stack and Netlify deployment, adding publication management and automation, academic profile content, projects and resources, presentations, and other research-facing material. The complete historical record remains in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md) and is intentionally not duplicated here.
