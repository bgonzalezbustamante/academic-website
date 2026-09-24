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

`Phase 4 foundation`

- Added a Next.js App Router and TypeScript foundation with a distinct public academic-site design.
- Added responsive global navigation, footer, homepage, publication listing and stable publication-detail routes.
- Replaced the initial developer-facing homepage architecture card with a public academic profile presentation covering dual appointments and research interests.
- Refined the responsive site shell for smaller screens.
- Added an RPC-only Supabase client for explicitly curated public paper data.
- Confirmed that zero Public papers is a valid current state of `list_public_papers()` and designed the site to handle that state without private-data fallback.
- Reserved the aggregate public work-analytics contract for the later analytics phase without exposing additional Dashboard data.
- Added a public-safe application error boundary that does not reveal internal Dashboard information.

`local development and validation`

- Added `npm run typecheck` and `npm run check` for local TypeScript and lint validation.
- Added `npm run check:public-contract` to validate the three public RPCs using only the Supabase publishable key.
- Added payload-shape validation for public papers and aggregate work analytics while accepting an empty curated publication list.
- Declared Node.js 20.9 or later as the supported runtime for the Next.js 16 application.
- Documented the local-first workflow and target information architecture in the README and architecture notes.

`release management`

- Established v6.0.0-rc.1 "Swift Harbour" as the first release identity in the new repository.
- Added structured public release-note data and a dedicated Release Notes page following the Research Dashboard release model.
- Added the current release identity to the site footer.
- Updated the package version to `6.0.0-rc.1`.

`development and deployment`

- Documented local development as the default workflow during early release-candidate work.
- Deferred automatic GitHub-to-Netlify deployment on every push to a later development stage to conserve build minutes.
- Kept `bgonzalezbustamante.com` on the legacy Hugo/Wowchemy deployment until the verified production-migration phase.

## Previous implementation

This repository continues the academic website maintained in [`academic-kickstart`](https://github.com/bgonzalezbustamante/academic-kickstart), whose final legacy release is **v5.4.9 (21 Sep 2026)**.

The pre-v6 site evolved through several generations of the Academic/Wowchemy Hugo stack and Netlify deployment, adding publication management and automation, academic profile content, projects and resources, presentations, and other research-facing material. The complete historical record remains in the [academic-kickstart CHANGELOG](https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md) and is intentionally not duplicated here.
