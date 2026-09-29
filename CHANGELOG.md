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
- Restored the profile portrait from `academic-kickstart` and prioritised the supplied Leiden seal as the site favicon. The portrait is now discovered from the single JPG/JPEG/PNG source file in `public/profile`, with a content-hashed generated asset so replacements and format changes invalidate image caches automatically. The homepage requests a high-density 660px source at quality 95 for the 220px rendered portrait to improve sharpness on high-DPI displays.
- Added the revised two-paragraph academic biography with consistent external-link arrows for the ECPR Political Methodology Steering Committee, TERGAP, COST Action CA22150 and the Enlace-Inserción UDP project.
- Linked the DPhil (PhD) in Politics degree reference directly to the University of Oxford using the same external-link treatment as other biography links.
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
- Added RPC-backed `/projects` and `/project/[slug]` routes with Featured projects, canonical project URLs, years, status, funder presentation, optional local project/funder imagery and associated Public publications. Publication-detail pages now reverse the same public `publication_slugs` relationship and show associated project cards at the bottom; multiple project associations are supported.
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
- Standardised the introductory lead width across Publications, Projects, Conferences and Teaching so all four top-level portfolio/dashboard pages use the full site-shell width while longer-form/detail prose retains its narrower reading measure.
- Added the local `/public/teaching/<course_image_filename>` asset convention with a teaching-icon fallback for missing files.
- Extended public-contract validation to cover Teaching Portfolio arrays/counts/years and reject private teaching IDs, activity-label relationships, tracked hours and session counts.
- Presented Featured publications and Featured projects as two-card-per-row grids on wider screens; Featured projects remain ordered by later project end year first and use configured funder imagery before project imagery.
- Standardised project ordering across Home and Projects using one shared rule: later `end_year` first, then later `start_year`, then title alphabetically. The Projects page applies this order before separating Featured and Other projects.
- Added a current-year horizontal two-sided Roadmap after Featured projects, using only public `event_short_name` labels ordered chronologically by presentation date.
- Wrapped the homepage Roadmap into chronological rows of at most five presentations. The upper/lower label rhythm continues across row boundaries, a partial final row draws its timeline only between its populated nodes, and each completed row now connects continuously to the first node of the next row with a right-edge return path.
- Corrected the Roadmap into a continuous snake layout so the fifth presentation connects to the sixth, with alternating row direction and continuous edge connectors across subsequent rows.
- Migrated Roadmap chronology to conference `start_date`/`end_date` ranges: ordering uses `start_date`, completed/upcoming state uses `end_date`, and labels now show the formatted date or date range together with location instead of a redundant hover tooltip.
- Moved the full current-year multi-row Roadmap from Home to the Conferences page after the presentation Overview.
- Replaced the homepage Roadmap with a single-row five-presentation timeline that prioritises ongoing/forthcoming presentations and backfills with the most recently completed presentations when necessary; a compact route-icon note links visitors to the full roadmap in Conferences.
- Kept the three presentation/country/first-author KPI cards at the top of the Conferences dashboard and retained the geographic section title `Presentation map`.
- Reordered the homepage to Academic profile → DORA / CRediT → Population in progress → Featured publications → Featured projects → Activity over time → compact presentation timeline; the timeline uses its bottom-right Conferences note as the sole navigation cue rather than a separate `View all` link.
- Added a `Population in progress` card below DORA / CRediT. Current populated counts are derived from the Dashboard-backed public records, while the intended-ingestion totals for Publications, Projects, Conferences, and Teaching/Supervision are deliberately maintained manually in `lib/site-population.ts`; this keeps the ingestion plan explicit and easy to update without changing the public-data contract. The card normalises current counts against those targets and uses domain-specific year-coverage strips: Publications and Conferences from 2012, Teaching/Supervision from 2013, and Projects from 2019 (all through 2026). A subtle weighted `Site population readiness` indicator summarises overall progress, marks the 60% launch threshold, and explicitly shows the 35/30/15/20 category weights in the public interface. Publications, Projects, Conferences and Teaching also show lightweight section-specific population strips beneath their page introductions, reusing the same targets and year-coverage logic without the Home readiness weighting. Each strip includes a small right-aligned note clarifying that this is the new site and that the section is still being populated.
- Increased the homepage Featured publications cap from three to four.
- Restyled publication year/index/Featured metadata and project status/period/Featured metadata as compact tags. Publication dates later than the current Amsterdam date are now treated consistently as `Forthcoming` in cards and filters, while detail pages retain only the planned publication year.
- Added a citation-based Publications listing using the detail-only public citation field, while retaining tags above and resource links below.
- Added Publications filters for Year and Publication index. Added right-aligned `Publication profile` and `Co-authorship network` links in the filter panel, with reciprocal cross-links between both analytical subpages. `/publications/profile` provides an analytical view of output over time, latest stored Google Scholar citation snapshots, publication-index and language composition, average citations by publication index, language and authorship group, and authorship structure. Language composition sits beside average citations per language, while authorship structure sits beside average citations per authorship; the Google Scholar explanatory labels for all average-citation cards are placed at the bottom of their cards. Google Scholar metrics use the existing Academicons mark. Distinct co-authors and average authors per paper deliberately exclude the 494-author `Investigating the analytical robustness of the social and behavioural sciences` collaboration; both KPI labels carry an info marker and a shared explanatory note. Stored citation counts are clearly presented as dated month/year snapshots with an info note and external-link cue to the live Google Scholar profile. `/publications/coauthorship` excludes publications with more than five authors, then renders every author and observed co-authorship tie in the remaining corpus. Its deterministic force layout applies weighted label propagation to the collaborator-only graph after removing the central profile links and uses the resulting communities only for layout. Community separation was strengthened substantially: the network now uses a larger canvas, fewer communities per ring, wider ring radii, tighter within-community initial placement, stronger anchor attraction, and substantially greater repulsion between different communities. Edge weight now controls preferred spring length with a much steeper curve, so repeated co-authorship produces markedly shorter links, including links to the central profile. The final collision pass is community-aware: strong connected pairs retain small safe gaps, while nodes from different communities receive a much larger exclusion and label-spacing buffer. Co-author/link counts remain in the legend below the graph; stronger ties are represented by both thicker and shorter links, and the public method note now explains these encodings and the community-layout heuristic in reader-facing language. The filter-panel links intentionally omit a redundant publication count because the Papers KPI already provides that total.
- Added publication-card abstracts to the Publications browser between the citation and resource links, rendered through the shared safe Markdown pipeline in a compact text style.
- Extended the public paper contract with nullable `project_url` and `si_file_url` fields in both list and detail RPCs, and exposed them as Project and SI File resource links on publication cards and detail pages.
- Extended the public paper contract with nullable `language` in both list and detail RPCs, constrained to English, Spanish, Portuguese, Dutch, German, French and Italian; Home, Publications and publication-detail metadata now show accessible local SVG language flags (UK for English, Spain for Spanish) for consistent cross-platform rendering.
- Extended the Academic Website public-paper client contract with nullable latest Google Scholar citation count and capture-date fields, mirroring the Dashboard's anonymous-safe RPCs without exposing citation history or snapshot metadata.
- Added client-side Publications pagination at ten records per page, applied after filters and reset to page 1 whenever filters change.
- Replaced the dynamically alphabetised Publication Index filter with a fixed seven-category Publication Index taxonomy in this order: WoS-SSCI, Scopus, WoS-ESCI, Book chapter, SciELO/Latindex, Working paper, Preprint.
- Added Publications KPI cards for total papers, distinct journals/venues and first-author percentage, with first authorship defined by Bastián González-Bustamante appearing first in the ordered public `authors[]` array.
- Extended citation rendering to support Markdown bold (`**text**`) and display bold citation emphasis in Oxford coral.
- Added small status icons to the homepage Roadmap: a completed-state icon for past presentations and a calendar icon for forthcoming presentations.
- Institutional logos remain monochrome at rest and transition to their original colour on hover; position-logo links also support the colour treatment on keyboard focus.
- Kept the Conference map data scale in Oxford aqua/blue tones and reserved Oxford coral for the hover state.
- Updated the Publications introduction to “Peer-reviewed articles, book chapters, working papers, and occasional preprints.”
- Aligned the Publications page width with Projects and Conferences by using the full site shell instead of the narrower content shell.
- Removed the separator between the Academic profile and DORA / CRediT cards.
- Updated the current-year Roadmap heading to “Conferences”, added the contextual line “Public presentations at conferences, workshops, and seminars during [year].”, and retained the past/upcoming visual distinction.
- Changed Roadmap event labels to two lines: status icon + short event name on the first line, with the presentation location in smaller text below.
- Moved publication Key highlights below the Abstract on publication-detail pages.
- Key highlight text now supports safe Markdown rendering for headings, bold/italic emphasis, lists, links, inline/fenced code and blockquotes without executing raw HTML.
- Publication and project abstracts now use the same safe Markdown renderer as Key highlights, replacing the earlier project-only bold-text helper with one shared research-text pipeline.
- Extended Project Funding presentation with the configured funder logo and public `funder_note`.
- Project Research outputs now combine associated public publications and the public `conference_presentations[]` contract; conference presentations reuse the Conferences Overview table. A compact note clarifies that the section shows project outputs in which I am involved and may therefore not represent the project's complete output record.
- Reordered project detail content so Research outputs follows About the project and Funding is always the final section.
- Moved project visuals, including the TERGAP map, below the About the project section and above Research outputs / Funding.
- Improved project-image sharpness by separating card and detail rendering expectations: detail images now use a full-width responsive hint, optimized non-PNG assets can use quality 90, and PNG figures/logos are served losslessly to avoid compression artefacts.
- Restored two project cards per row on wider screens.
- Added a TERGAP-specific world coverage map on the TERGAP detail page, using a compact 47-country snapshot derived from `tergap-dashboard` and displaying its generation timestamp.
- Reused the TERGAP dashboard ERC logo as the TERGAP funder image on Home/Projects cards and in the Funding block when no Dashboard funder-image filename is configured.
- Matched the TERGAP detail map to the original dashboard: map canvas `#eef0f7`, grey not-collected countries `#e8eaed`, original six-step scale from `#e7eaf4` to `#001158`, and teal hover `#007679`. Conferences uses the same canvas/grey no-data treatment with an Oxford aqua/blue scale and Oxford coral hover.
- Reworked `/conferences` into a dashboard-style view headed by “Conference and public presentations”: KPI cards first, then the geographic map, followed by a compact presentation table.
- Standardised the third KPI across Publications and Conferences as first-author percentage, defined by Bastián González-Bustamante appearing first in the ordered public `authors[]` array.
- Removed the Conference Type column and added client-side pagination at 10 presentation rows per page.
- Replaced single conference presentation dates with required public `start_date` and `end_date` fields and constrained `presentation_type` to Conference paper, Keynote or Workshop; the transitional `presentation_date = start_date` alias is treated as deprecated by new website code.
- Removed the former 2020 cutoff so the Conferences page, KPIs and map use the complete public presentation record.
- Updated the Countries KPI to count only locations that resolve to valid countries; presentations with location `Virtual` are excluded from the country total/map and reported separately as a small virtual conferences/workshops note.
- Removed the optional external-link column from conference presentation tables so rows without URLs no longer show a trailing dash; the shared change applies both to the Conferences overview and project Research outputs.
- Conference presentation titles now become external links when a public URL is available, using the same small coral external-arrow treatment as biography links.
- Keynote presentations are marked with a small coral star immediately after the presentation title, with a compact legend below the shared conference table; the same marker therefore appears in project Research-output tables.
- Added the same reusable Oxford-styled world-map system for TERGAP and Conferences using `react-simple-maps`, `world-atlas` and ISO-country conversion.
- Added a public-safe application error boundary that does not reveal internal Dashboard information.

`local development and validation`

- Added `npm run typecheck` and `npm run check` for local TypeScript and lint validation.
- Added the npm lockfile to the new repository and accepted the current Next.js-generated TypeScript include for `.next/dev/types/**/*.ts` to keep local and future deployment installs reproducible.
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
