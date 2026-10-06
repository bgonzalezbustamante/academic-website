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
    status: 'Current release',
    releasedOn: '6 Oct 2026',
    comparison: 'Second release candidate',
    summary:
      'Bold River adds new ways to explore my software, favourite paintings and weekly activity, with improvements across the website.',
    sections: [
      {
        title: 'New things to explore',
        items: [
          'Explore the Software Ecosystem catalogue of applications, packages and other tools.',
          'Browse Selected paintings, with museum links and image credits.',
          'Visit the Weekly timeline to see illustrated penguins representing daily work and coffee activity.',
        ],
      },
      {
        title: 'Website improvements',
        items: [
          'Refreshed the profile photograph and artwork, and improved navigation on mobile.',
          'Made research activity and collaboration summaries clearer, and updated the illustrated page-not-found screen.',
          'Added Catholic Calendar highlights to the footer and clearer information about artwork credits.',
        ],
      },
    ],
  },
  {
    version: 'v6.0.0-rc.1',
    codename: 'Swift Harbour',
    status: 'Previous release',
    releasedOn: '1 Oct 2026',
    comparison: 'First release candidate',
    summary:
      'Swift Harbour launched the rebuilt academic website with a clearer research profile and a responsive design.',
    sections: [
      {
        title: 'Academic profile and research',
        items: [
          'Introduced the new homepage, Academic trajectory and information about research practices.',
          'Expanded Publications, Projects, Conferences and Teaching, including research links, maps and summaries.',
        ],
      },
      {
        title: 'Activity and navigation',
        items: [
          'Added yearly work-activity summaries and recent and forthcoming conference presentations.',
          'Made the site easier to navigate on different screens and improved links from the previous website.',
        ],
      },
      {
        title: 'Website experience',
        items: [
          'Improved accessibility, page loading and search visibility while keeping private research-management records off the public site.',
          'Added a Website Carbon estimate to the footer and introduced the illustrated page-not-found screen.',
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
