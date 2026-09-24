# Academic Website

Next.js replacement for [bgonzalezbustamante.com](https://bgonzalezbustamante.com/) and continuation of the website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart).

The pre-v6 Hugo/Wowchemy implementation remains the production website while this repository is developed in parallel. Its detailed version history is preserved in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md).

Current development release: **v6.0.0-rc.1 "Swift Harbour"**.

## Architecture

This repository is the public/read-only presentation layer. [Research Dashboard](https://github.com/bgonzalezbustamante/research-dashboard) remains the authenticated administrative application and the canonical source for public paper metadata.

The website consumes only the explicit anonymous-safe Supabase RPC contracts:

- `list_public_papers()`
- `get_public_paper(text)`
- `get_public_work_analytics(year)` (reserved for the later public-analytics phase)

It must not query Research Dashboard tables directly or use a service-role key.

## Phase 4 scope

The initial foundation includes:

- Next.js App Router + TypeScript
- distinct academic-site design system inspired by the existing projects' Oxford palette
- global header/footer and responsive layout
- RPC-only Supabase client
- public publication listing
- stable publication detail routes
- minimal static profile bootstrap content
- v6 changelog and structured public release notes

The legacy Hugo/Wowchemy publication corpus is intentionally **not** imported here. Phase 5 remains deferred.

## Local development

Development is intentionally **local-first during the release-candidate stage**. Routine pushes should not be used merely to trigger Netlify builds.

```bash
npm install
cp .env.example .env.local
npm run dev
```

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Before merging substantial changes:

```bash
npm run lint
npm run build
```

## Deployment

The project is intended for Netlify, but automatic deployment on every push is deliberately deferred during early development to conserve build minutes.

Netlify should be used selectively for milestone and integration verification during the release-candidate period. At a later stage, the repository will be connected to Netlify continuous deployment so pushes can deploy automatically, following the workflow previously used by [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart).

The production domain `bgonzalezbustamante.com` must remain attached to the existing Hugo/Wowchemy site until the production migration phase.

## Release history

- Current v6 history: [CHANGELOG.md](CHANGELOG.md)
- Public-facing release notes: [`/release-notes`](./app/release-notes/page.tsx)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)
