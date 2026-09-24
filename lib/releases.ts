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
      'Swift Harbour establishes the Next.js foundation for the next generation of bgonzalezbustamante.com while preserving continuity with the academic-kickstart website and using Research Dashboard only through curated public Supabase contracts.',
    sections: [
      {
        title: 'Project continuity',
        items: [
          'Continued the academic website version line from the Hugo/Wowchemy implementation maintained in academic-kickstart.',
          'Started a fresh v6 changelog while keeping the detailed pre-v6 history authoritative in the predecessor repository.',
          'Kept the existing production website unchanged during parallel development.',
        ],
      },
      {
        title: 'Public website foundation',
        items: [
          'Added a Next.js App Router and TypeScript foundation for a distinct public academic website.',
          'Added responsive site navigation, footer, homepage, publication listing and stable publication detail routes.',
          'Introduced a restrained academic design system drawing on the visual language used across related projects without reproducing the Research Dashboard interface.',
        ],
      },
      {
        title: 'Public data boundary',
        items: [
          'Connected publication rendering only to explicit anonymous-safe Supabase RPC contracts maintained by Research Dashboard.',
          'Kept service-role credentials, private Dashboard tables, internal workflow metadata, work-session details and account data outside the public application.',
          'Reserved aggregate public work analytics for the later analytics phase without broadening the existing public contract.',
        ],
      },
      {
        title: 'Development and deployment',
        items: [
          'Adopted local-first development during the release-candidate stage so routine changes do not consume Netlify build minutes.',
          'Reserved Netlify deployments for selective milestone and integration verification during early development.',
          'Deferred automatic GitHub-to-Netlify deployment on every push until a later stage of the replacement project.',
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
      'Versions before v6 are maintained in the academic-kickstart repository. The legacy site evolved across several generations of the Academic/Wowchemy Hugo stack and remains the production website while the Next.js replacement is developed.',
    sections: [
      {
        title: 'Historical scope',
        items: [
          'Maintained the academic profile, publications, projects and resources, presentations and other research-facing content for bgonzalezbustamante.com.',
          'Added and refined publication automation, profile content, deployment configuration and academic-site features over multiple major versions.',
          'The complete detailed record remains in the academic-kickstart CHANGELOG rather than being duplicated in this repository.',
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
