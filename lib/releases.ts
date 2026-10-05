export type ReleaseNoteSection = {
  title: string
  items: string[]
}

export type ReleaseNote = {
  version: string
  codename: string
  status?: string
  releasedOn: string
  comparison: string
  summary: string
  sections: ReleaseNoteSection[]
}

export const releases: ReleaseNote[] = [
  {
    version: 'v6.0.0-rc.2',
    codename: 'Bold River',
    status: 'In development',
    releasedOn: 'TBC',
    comparison: 'Second release candidate in the Next.js repository',
    summary:
      'Bold River hardens collaboration analytics, introduces a public Software Ecosystem catalogue, refines footer presentation, and prepares the repository for eventual public visibility with explicit licensing boundaries.',
    sections: [
      {
        title: 'Software Ecosystem',
        items: [
          'Added a non-navigation /software catalogue backed exclusively by Research Dashboard public Software Ecosystem RPCs.',
          'Linked Software ecosystem inline beside Academic trajectory on the homepage without a separator, added a complete colour-coded development-stage legend, and kept software profiles self-contained as cards without detail routes.',
        ],
      },
      {
        title: 'Personal curation',
        items: [
          'Added a non-navigation Selected paintings page with a rights-aware editorial mosaic, visible image provenance, and a single-column mobile fallback.',
          'Expanded the mosaic with El coloso and Pieter Bruegel the Elder’s Turmbau zu Babel, reorganised selections whose images are not republished into compact linked cards, and standardised artwork titles to the canonical catalogue wording used by each holding institution.',
        ],
      },
      {
        title: 'Robustness and presentation',
        items: [
          'Normalised publication author arrays before collaboration calculations and identified the exceptional large collaboration by stable slug rather than exact title.',
          'Moved the Creative Commons/year/name line to the left footer column above the public email address and added a Dashboard-controlled Catholic Calendar composed display above Website Carbon, including a maximum-width stress mode.',
          'Included the updated 404 penguin assets and revised publication population target already added after rc.1.',
        ],
      },
      {
        title: 'Public-repository preparation',
        items: [
          'Added explicit software, editorial-content and third-party asset licensing boundaries in preparation for making the repository public.',
          'Extended the website public-contract checker to validate Software Ecosystem fields, controlled vocabularies, repository privacy invariants and clean publication author arrays.',
        ],
      },
    ],
  },
  {
    version: 'v6.0.0-rc.1',
    codename: 'Swift Harbour',
    status: 'Current release',
    releasedOn: '1 Oct 2026',
    comparison: 'First release candidate in the Next.js repository',
    summary:
      'Swift Harbour is the first release candidate for the rebuilt academic website and the production version of bgonzalezbustamante.com: a modern public research profile connected safely to Research Dashboard, deployed after staged validation and production-domain migration.',
    sections: [
      {
        title: 'Academic profile and trajectory',
        items: [
          'Introduced a new portrait-led homepage with current appointments, research interests, institutional links, DORA and CRediT research-practice information, and an Academic trajectory page covering selected education and professional positions.',
          'Added a clearer view of completed and ongoing appointments while keeping the main navigation focused on the core public research sections.',
        ],
      },
      {
        title: 'Research portfolio',
        items: [
          'Expanded Publications with filters, citation information, language indicators, related projects, publication analytics and a co-authorship network.',
          'Added Projects, Conferences and Teaching sections, including research outputs, funding information, presentation maps and roadmaps, keynote markers, controlled teaching-role tags, academic-level tags, and cumulative teaching information.',
        ],
      },
      {
        title: 'Activity and site coverage',
        items: [
          'Added public yearly work-activity summaries and a compact view of recent and forthcoming conference presentations.',
          'Added population-progress indicators showing how much of the intended Publications, Projects, Conferences and Teaching record has been added while the new site is still being populated.',
        ],
      },
      {
        title: 'Platform and privacy',
        items: [
          'Rebuilt the site with Next.js and a responsive Oxford-inspired visual system designed for the new public academic profile.',
          'Connected the site to Research Dashboard only through deliberately public, anonymous-safe data contracts; private research-management records, account information and individual work sessions remain outside the public website.',
          'Improved search metadata, preview indexing safeguards, keyboard/reduced-motion accessibility, browser security headers and homepage loading behaviour for the production launch.',
          'Added permanent redirects for legacy website URLs that have clear replacements while preserving unchanged publication URLs and normal not-found behaviour for material without a current equivalent.',
          'Added a Website Carbon estimate in the footer, maintained as a local snapshot rather than fetched from an external service on each visit; the production site was re-tested after cut-over.',
        ],
      },
    ],
  },
  {
    version: 'v5.4.9 and earlier',
    codename: 'Legacy academic website',
    releasedOn: 'Through 21 Sep 2026',
    comparison: 'Pre-v6 Hugo/Wowchemy implementation',
    summary:
      'Versions before v6 belong to the academic-kickstart generation of the website, which remains the historical record for the Hugo/Wowchemy implementation.',
    sections: [
      {
        title: 'Historical scope',
        items: [
          'Maintained the academic profile, publications, projects, presentations and other research-facing material for bgonzalezbustamante.com.',
          'The full pre-v6 release history remains available in the academic-kickstart CHANGELOG.',
        ],
      },
    ],
  },
]

export const currentRelease =
  releases.find(
    (release) =>
      release.status === 'Current release'
  ) ?? releases[0]
