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
      'Swift Harbour rebuilds the academic website as a modern public research profile connected safely to Research Dashboard, while preserving continuity with the previous site.',
    sections: [
      {
        title: 'Academic profile',
        items: [
          'Introduced the new portrait-led academic profile, current appointments, research interests, institutional branding and responsible-research statements for DORA and CRediT.',
          'Added a clearer homepage for featured publications and projects, yearly work activity, a compact five-presentation recent/forthcoming timeline, and a live population-progress snapshot connected to Research Dashboard.',
          'Added a public Teaching Portfolio for current and previous courses, teaching levels and cumulative teaching indicators.',
        ],
      },
      {
        title: 'Research outputs',
        items: [
          'Added public Publications with citation-based records, compact Markdown abstracts, filters, summary indicators, pagination, publication details, Project/SI File resource links and optional Key highlights.',
          'Added public Projects with funding information, associated publications and conference presentations, including the TERGAP geographic-coverage view.',
          'Added a Conferences dashboard with a full current-year presentation roadmap, all-years geographic coverage, presentation indicators, multi-day date ranges, virtual-presentation reporting and a paginated presentation record.',
        ],
      },
      {
        title: 'Public data and analytics',
        items: [
          'Connected the site to Research Dashboard only through deliberately public, anonymous-safe contracts rather than private application tables, including live progress indicators for the ongoing website population.',
          'Added aggregate yearly work analytics while keeping individual work sessions and private research-management data outside the public website.',
        ],
      },
      {
        title: 'Website foundation',
        items: [
          'Moved the site to Next.js with a responsive Oxford-inspired visual system, accessible navigation and local-first development during the release-candidate stage.',
          'Kept the existing Hugo/Wowchemy website in production while the replacement is populated, tested and prepared for migration.',
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
