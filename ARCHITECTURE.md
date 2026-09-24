# Architecture

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

### Legacy Hugo site

Still static/deferred:

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

## Deferred work

- Phase 5 legacy publication reconciliation/import
- Phase 6 full profile/projects/teaching content
- Phase 7 activity heatmap, citation metadata, OpenGraph, sitemap, redirects and SEO hardening
- Phase 8 production domain migration
- Phase 9 archival of `academic-kickstart`
