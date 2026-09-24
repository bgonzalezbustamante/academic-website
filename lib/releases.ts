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
          'Replaced the development-oriented homepage architecture panel with a visitor-facing academic profile showing three main appointments and research interests.',
          'Aligned the visual system with Research Dashboard using Roboto, Noto Serif and Oxford-blue neutral surfaces, with Oxford coral as the main accent and Oxford aqua reserved for small interactive states.',
          'Reduced the homepage title scale further and restored a portrait-led profile layout with all three positions presented as one-line entries directly beneath the name.',
          'Replaced the BGB header mark with the supplied Leiden University, Universidad Diego Portales and OCPSG logos, presented as a consistent monochrome home link.',
          'Restored the profile portrait from the predecessor site and prioritised the supplied Leiden seal for the favicon.',
          'Added the revised academic biography with consistent external-link arrows for the ECPR Political Methodology Steering Committee, TERGAP, COST Action CA22150 and the Enlace-Inserción UDP project.',
          'Renamed the research-interest panel to Main Interests, restored compact coral square bullets and removed the redundant Publications button below the biography.',
          'Added compact public email and Wijnhaven address information to the footer with a Creative Commons mark beside the year and name.',
          'Added Font Awesome and Academicons for institutional, scholarly and publication-resource links.',
          'Added public-safe page error handling without falling back to private Dashboard data.',
        ],
      },
      {
        title: 'Public data boundary',
        items: [
          'Connected publication rendering only to explicit anonymous-safe Supabase RPC contracts maintained by Research Dashboard.',
          'Confirmed that an empty public-paper list is a valid curated state and does not trigger access to legacy or private data.',
          'Kept service-role credentials, private Dashboard tables, internal workflow metadata, work-session details and account data outside the public application.',
          'Rendered the current-year Activity over time heatmap from the anonymous aggregate work-analytics RPC using the same thresholds as Research Dashboard.',
          'Added public cards for Working Hours per day and Coffee per working day, with working time formatted as hours/minutes and coffee to one decimal, both with an on-average label, without exposing raw sessions or daily coffee counts.',
          'Tightened the homepage vertical rhythm between the profile, featured publications and public activity sections.',
          'Documented the minimal future contract extension required for optional publication Key highlight text and imagery without implementing it in the public repository.',
        ],
      },
      {
        title: 'Local development',
        items: [
          'Added local lint and TypeScript validation commands.',
          'Added a publishable-key public-contract check for publication listing, slug lookup and aggregate work analytics.',
          'Standardised local and deployment runtimes on Node.js 22 or later for compatibility with the current Supabase JavaScript stack.',
          'Defined the intended information architecture while keeping full profile, projects, teaching and contact content deferred to Phase 6.',
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
