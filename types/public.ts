export type PublicPaperLanguage =
  | 'English'
  | 'Spanish'
  | 'Portuguese'
  | 'Dutch'
  | 'German'
  | 'French'
  | 'Italian'

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
  project_url: string | null
  si_file_url: string | null
  featured: boolean
  publication_index: string | null
  language: PublicPaperLanguage | null
  google_scholar_citations: number | null
  google_scholar_citations_captured_on: string | null
}

export type PublicPaperDetail = PublicPaper & {
  citation: string | null
  highlight_text: string | null
  highlight_image_filename: string | null
  highlight_image_alt: string | null
  highlight_image_caption: string | null
}

export type ConferencePresentationType =
  | 'Conference paper'
  | 'Keynote'
  | 'Workshop'

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
  start_date: string
  end_date: string
  /** @deprecated Transitional Dashboard alias for start_date. */
  presentation_date?: string | null
  presentation_title: string | null
  authors: string[]
  presentation_type: ConferencePresentationType
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


export type PublicTeachingRole =
  | 'Course Convenor'
  | 'Lecturer'
  | 'Tutor'
  | 'Thesis Supervisor'
  | 'Examiner'

export type PublicTeachingItem = {
  name: string
  institution: string
  summary: string
  role: PublicTeachingRole | null
  start_year: number | null
  end_year: number | null
  is_current: boolean
  levels: string[]
  times_taught: number
  student_count: number
  course_image_filename: string | null
}

export type PublicSoftwareCategory =
  | 'Application'
  | 'Website'
  | 'Utility'
  | 'Reusable component'
  | 'Package/library'
  | 'API/service'
  | 'Data product'
  | 'Template'
  | 'Other'

export type PublicSoftwareDevelopmentStage =
  | 'Alpha'
  | 'Beta'
  | 'Release candidate'
  | 'Stable'
  | 'Maintenance'

export type PublicSoftwareStatus =
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'

export type PublicRepositoryVisibility = 'public' | 'private'

export type PublicSoftwareItem = {
  slug: string
  name: string
  short_description: string
  category: PublicSoftwareCategory
  current_version: string | null
  development_stage: PublicSoftwareDevelopmentStage
  status: PublicSoftwareStatus
  repository_visibility: PublicRepositoryVisibility
  repository_url: string | null
  production_url: string | null
  documentation_url: string | null
  start_year: number | null
  end_year: number | null
  featured: boolean
}
