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
    version: 'v6.0.0-rc.1',
    codename: 'Swift Harbour',
    status: 'In development',
    releasedOn: 'Release date TBC',
    comparison: 'First release candidate in the Next.js repository',
    summary:
      'Swift Harbour is the first release candidate for the rebuilt academic website: a modern public research profile connected safely to Research Dashboard, with the existing website kept online while the replacement is completed and tested.',
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
          'Added Projects, Conferences and Teaching sections, including research outputs, funding information, presentation maps and roadmaps, keynote markers, and cumulative teaching information.',
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
          'Added an optional, dated Website Carbon estimate in the footer, maintained as a local snapshot rather than fetched from an external service on each visit.',
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
