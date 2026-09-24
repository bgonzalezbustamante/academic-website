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
- `get_public_work_analytics(year)`

The current production contract can validly return zero public papers when no Dashboard paper has been explicitly marked Public. The site must treat that as a curated empty state rather than falling back to private tables or the legacy publication corpus.

Aggregate work analytics are available but remain unrendered until Phase 7.

### Proposed publication key-highlight extension

A publication-detail **Key highlight** block with an image is feasible, but the current public paper RPC intentionally does not expose presentation fields for it. The public site must not work around that boundary with direct table access or a per-slug hard-coded data source.

The minimal future contract change should remain in the public-presentation layer, conceptually adding nullable fields such as:

- `highlight_text`
- `highlight_image_url`
- `highlight_image_alt`
- optionally `highlight_caption`

These belong naturally with `paper_public_metadata`, because they describe website presentation rather than the canonical research record. Only `get_public_paper(slug)` needs to expose them initially; `list_public_papers()` does not need the fields unless a future listing design also uses highlight imagery.

For Dashboard-managed images, a dedicated explicitly public Supabase Storage location would preserve the same security model: the Dashboard manages the asset, while the public site receives only the curated public URL and metadata through the RPC. This extension remains **proposed only** in Phase 4 and requires a separate Dashboard/public-contract change before implementation.

## Information architecture

The current Hugo/Wowchemy homepage combines profile, publications/preprints, projects/resources and contact information. The replacement preserves that conceptual structure without reproducing Wowchemy's widget system.

The planned public structure is:

```text
/
├── academic profile / research interests
├── featured research
├── projects and resources          (Phase 6)
└── contact / external links        (Phase 6)

/publications
└── /publication/[slug]

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

### Legacy academic website

Still static/deferred in [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart):

- long-form biography
- detailed appointments/positions
- education
- projects/resource cards
- teaching/service
- contact presentation
- CV asset/link
- historic publication corpus not yet present in Research Dashboard

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
- Phase 6 full profile/projects/teaching content
- Phase 7 activity heatmap, citation metadata, OpenGraph, sitemap, redirects and SEO hardening
- Phase 8 production domain migration and continuous-deployment finalisation
- Phase 9 archival of `academic-kickstart` after verified migration
