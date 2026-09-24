export type PublicPaper = {
  slug: string
  title: string
  authors: string[]
  abstract: string | null
  venue: string | null
  publication_date: string | null
  doi_url: string | null
  publication_url: string | null
  preprint_url: string | null
  github_url: string | null
  dataset_url: string | null
  featured: boolean
  publication_index: string | null
}

export type PublicPaperDetail = PublicPaper & {
  citation: string | null
  highlight_text: string | null
  highlight_image_filename: string | null
  highlight_image_alt: string | null
  highlight_image_caption: string | null
}

export type PublicProject = {
  slug: string
  short_title: string
  title: string
  abstract: string
  funder: string
  funder_note: string | null
  url: string | null
  start_year: number | null
  end_year: number | null
  status: string
  featured: boolean
  project_image_filename: string | null
  funder_image_filename: string | null
  publication_slugs: string[]
  conference_presentations: PublicConferencePresentation[]
}

export type PublicConferencePresentation = {
  event_name: string
  event_short_name: string
  location: string | null
  presentation_date: string | null
  presentation_title: string | null
  authors: string[]
  presentation_type: string | null
  url: string | null
}

export type PublicWorkDay = {
  date: string
  net_minutes: number
}

export type PublicWorkAnalytics = {
  year: number
  average_net_minutes_per_working_day: number
  average_coffees_per_working_day: number
  days: PublicWorkDay[]
}
