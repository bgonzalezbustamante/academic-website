# Architecture

This repository is the Next.js continuation of the academic website previously implemented in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart). The predecessor remains the production Hugo/Wowchemy implementation until the later domain-migration phase.

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
- `get_public_work_analytics(year)`

The current production contract can validly return zero public papers when no Dashboard paper has been explicitly marked Public. The site must treat that as a curated empty state rather than falling back to private tables or the legacy publication corpus.

Aggregate work analytics are rendered on the homepage for the current Europe/Amsterdam calendar year. The public site reproduces the Dashboard Activity over time heatmap from daily net working minutes and shows only the two annual averages already exposed by the RPC: net working time per working day and coffees per working day.

### Publication Key highlights

Key highlights are deliberately detail-only presentation metadata. `list_public_papers()` remains the compact canonical publication listing and does not expose them. `get_public_paper(text)` additionally provides:

- `highlight_text`
- `highlight_image_filename`
- `highlight_image_alt`
- `highlight_image_caption`

When configured, the publication detail route resolves the image only from the academic website's local static convention:

```text
/public/publication-highlights/<paper-slug>/<filename>
→ /publication-highlights/<paper-slug>/<filename>
```

The site never derives a Supabase Storage URL for these assets. The supplied alt text is used when an image filename exists, captions remain optional, and an entirely empty highlight configuration renders nothing.

### Projects and Conferences

Projects are supplied exclusively through `list_public_projects()` and `get_public_project(text)`. Associated papers are represented only as already-public publication slugs and are resolved against `list_public_papers()`; the website never queries project-paper tables. Project Funding presentation may use the public `funder_note`, and project cards prefer the configured funder image before the project image. Homepage Featured projects are ordered by later `end_year` first.

Project images and funder logos are local static assets:

```text
/public/projects/<slug>/<project_image_filename>
/public/funders/<funder_image_filename>
```

Conferences are supplied exclusively through `list_public_conference_presentations()`. The standalone Conferences dashboard derives its country count from the final `City, Country` location segment, computes co-authorship from the supplied ordered `authors[]`, presents KPI cards before an Oxford blue/coral/aqua map, and uses a compact 10-row paginated presentation table while preserving the RPC's descending-date record order. The homepage Roadmap filters presentations to the current Europe/Amsterdam year, orders them chronologically by `presentation_date`, and uses only `event_short_name` as its visible timeline label. Notes, internal owner IDs and optional Dashboard paper relationships are intentionally absent and are neither requested nor inferred.

### TERGAP geographic snapshot

TERGAP geographic coverage is sourced from the separate public [tergap-dashboard](https://github.com/bgonzalezbustamante/tergap-dashboard), not from Research Dashboard. The academic website stores a compact derived snapshot at:

```text
/public/data/tergap-map.json
```

It contains only the TERGAP dashboard generation timestamp, collection window and country-level ISO-3/article-count values required for the map. The shared map component uses `react-simple-maps` and bundled `world-atlas` geometry, matching the TERGAP dashboard's technical approach while applying the Oxford blue/coral/aqua Swift Harbour visual system. The TERGAP map is shown on the TERGAP detail page; project cards use funder imagery instead, with the TERGAP ERC logo supplied locally as a presentation fallback.

## Information architecture

The current Hugo/Wowchemy homepage combines profile, publications/preprints, projects/resources and contact information. The replacement preserves that conceptual structure without reproducing Wowchemy's widget system.

The planned public structure is:

```text
/
├── academic profile / research interests
├── DORA / CRediT research-practice cards
├── featured publications
├── featured projects carousel
├── Activity over time
├── current-year presentation Roadmap
└── contact / external links

/publications
└── /publication/[slug]

/projects
└── /project/[slug]

/conferences

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
- Font Awesome provides general interface/brand icons; Academicons provides scholarly identifiers such as ORCID, Google Scholar and DOI.

Institutional branding is presented as a compact monochrome affiliation strip using the supplied Leiden University, Universidad Diego Portales and OCPSG assets. The strip links back to the website home page; the smaller logos next to each position link to the corresponding institution. The supplied Leiden seal is also the favicon. The profile portrait is carried forward from `academic-kickstart`.

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

### Legacy academic website

Still static/deferred in [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart):

- education detail beyond the current short biography
- legacy project/resource material not yet represented by a Public Research Dashboard project record
- teaching/service detail
- CV asset/link
- historic publication corpus not yet present in Research Dashboard

The homepage profile, three main appointments, portrait, selected project links, email and institutional address are now maintained directly in this public repository as presentation content. The same applies to the DORA statement and the migrated CRediT taxonomy page, which are static research-practice content rather than Dashboard-managed records.

These should not be copied into a new database or CMS in this repository.

## Local validation

The repository includes `scripts/check-public-contract.mjs` so the public RPC boundary can be tested locally with the same Supabase publishable key used by the website.

The check deliberately calls public RPCs only. It provides a reproducible way to verify integration without creating Netlify builds.

## Development and deployment

During the release-candidate stage, development is local-first. Netlify deployments should be used selectively for milestone or integration verification rather than on every push.

Continuous deployment from GitHub to Netlify is intentionally deferred. When the site reaches a later stage, automatic deployment can be enabled using the same broad GitHub-to-Netlify workflow that supported the predecessor repository.

The production domain remains on the predecessor site until Phase 8.

## Deferred work

- Phase 5 legacy publication reconciliation/import
- Phase 6 remaining full-profile, teaching/service and CV content
- Phase 7 citation metadata, sitemap, redirects and SEO hardening beyond the detail metadata and public activity heatmap already implemented
- Phase 8 production domain migration and continuous-deployment finalisation
- Phase 9 archival of `academic-kickstart` after verified migration
