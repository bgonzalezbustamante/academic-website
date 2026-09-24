# Academic Website

Next.js replacement for `bgonzalezbustamante.com`.

## Architecture

This repository is the public/read-only presentation layer. Research Dashboard remains the authenticated administrative application and the canonical source for public paper metadata.

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

The legacy Hugo/Wowchemy publication corpus is intentionally **not** imported here. Phase 5 remains deferred.

## Local development

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

Before deployment:

```bash
npm run lint
npm run build
```

## Deployment

The project is intended for Netlify. During parallel development it should use a temporary Netlify domain. `bgonzalezbustamante.com` must remain attached to the existing Hugo/Wowchemy site until the production migration phase.
