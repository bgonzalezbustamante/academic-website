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
    version: 'v6.1.0',
    codename: 'Jade Prairie',
    status: 'In development',
    releasedOn: 'In development',
    comparison: 'Next minor release in preparation',
    summary:
      'Jade Prairie is a set of improvements to accessibility, search visibility and loading speed.',
    sections: [
      {
        title: 'Small refinements',
        items: [
          'Retired the old version of the website, which now forwards visitors to this one.',
          'Made keyboard focus easier to see in the Weekly timeline.',
          'Made small coral labels and link highlights easier to read.',
          'Made the browser tab icon much lighter to download.',
          'Made the page-not-found illustration much faster to load.',
          'Helped search engines and Google Scholar find and describe every publication, and added a preview card for when the website is shared.',
          'Made older publication and dataset links open through secure addresses.',
          'Applied routine software maintenance updates.',
        ],
      },
    ],
  },
  {
    version: 'v6.0.0',
    codename: 'Crimson Delta',
    status: 'Current release',
    releasedOn: '2 Nov 2026',
    comparison: 'First stable v6 release',
    summary:
      'Crimson Delta is the first stable v6 release, making navigation, calendars, research pages and images clearer and faster.',
    sections: [
      {
        title: 'Small refinements',
        items: [
          'Made the current section easier to see in the main menu.',
          'Made project lists easier to browse and added a closer view of Europe to the conference map.',
          'Made project and publication images load faster while keeping their quality.',
          'Added dates to the Catholic Calendar footer and improved its mobile layout.',
          'Improved the fit of longer working-time labels in the Weekly timeline.',
          'Restored project and conference displays for guest lectures, and added Dataset to publication filters.',
          'Applied security updates to important website tools.',
        ],
      },
    ],
  },
  {
    version: 'v6.0.0-rc.2',
    codename: 'Bold River',
    status: 'Previous release',
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
