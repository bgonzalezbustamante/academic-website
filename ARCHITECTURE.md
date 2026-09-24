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
- aggregate work analytics (not rendered until Phase 7)

### Legacy academic website

Still static/deferred in [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart):

- long-form biography
- appointments/positions
- education
- research interests
- project/resource cards
- teaching/service
- contact presentation
- CV asset/link
- historic publication corpus not yet present in Research Dashboard

These should not be copied into a new database or CMS in this repository.

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
