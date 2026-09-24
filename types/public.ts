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
