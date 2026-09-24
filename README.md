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

The current foundation includes:

- Next.js App Router + TypeScript
- distinct academic-site design system inspired by the existing projects' Oxford palette
- public-facing academic profile hero with dual appointments and research interests
- global header/footer and responsive layout
- RPC-only Supabase client
- public publication listing
- stable publication detail routes
- public-safe error handling
- local validation of the Supabase public contract
- v6 changelog and structured public release notes

The legacy Hugo/Wowchemy publication corpus is intentionally **not** imported here. Phase 5 remains deferred.

## Local development

Next.js 16 requires Node.js 20.9 or later. The repository also declares this requirement in `package.json`.

```bash
git clone https://github.com/bgonzalezbustamante/academic-website.git
cd academic-website
npm install
cp .env.example .env.local
npm run dev
```

On Windows without a Unix-like shell, create `.env.local` by copying `.env.example` manually.

Required environment variables:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

The application expects a modern Supabase publishable key (`sb_publishable_...`), not a service-role key.

### Local checks

Run linting and TypeScript validation:

```bash
npm run check
```

Validate the three public Supabase contracts using the publishable key in `.env.local`:

```bash
npm run check:public-contract
```

The contract check:

- verifies `list_public_papers()`;
- resolves one listed slug through `get_public_paper(text)` when at least one paper is Public;
- accepts zero public papers as a valid curated state;
- validates the shape of `get_public_work_analytics(year)`;
- never queries internal Research Dashboard tables.

Before a milestone merge or deployment:

```bash
npm run check
npm run check:public-contract
npm run build
```

## Deployment

Development is intentionally **local-first during the release-candidate stage**. Routine pushes should not be used merely to trigger Netlify builds.

Netlify should be used selectively for milestone and integration verification during the release-candidate period. At a later stage, the repository will be connected to Netlify continuous deployment so pushes can deploy automatically, following the workflow previously used by [academic-kickstart](https://github.com/bgonzalezbustamante/academic-kickstart).

The production domain `bgonzalezbustamante.com` must remain attached to the existing Hugo/Wowchemy site until the production migration phase.

## Release history

- Current v6 history: [CHANGELOG.md](CHANGELOG.md)
- Public-facing release notes: [`/release-notes`](./app/release-notes/page.tsx)
- Detailed pre-v6 history: [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md)
