import type {
  PublicConferencePresentation,
  PublicPaper,
  PublicProject,
  PublicTeachingItem,
} from '@/types/public'

export const POPULATION_END_YEAR = 2026

export const POPULATION_TARGETS = {
  publications: 63,
  projects: 16,
  conferences: 139,
  teaching: 35,
} as const

export type PopulationDomain = keyof typeof POPULATION_TARGETS

export const POPULATION_PERIODS: Record<
  PopulationDomain,
  { startYear: number; endYear: number }
> = {
  publications: {
    startYear: 2012,
    endYear: POPULATION_END_YEAR,
  },
  projects: {
    startYear: 2019,
    endYear: POPULATION_END_YEAR,
  },
  conferences: {
    startYear: 2012,
    endYear: POPULATION_END_YEAR,
  },
  teaching: {
    startYear: 2013,
    endYear: POPULATION_END_YEAR,
  },
}

export function populationYears(domain: PopulationDomain) {
  const { startYear, endYear } = POPULATION_PERIODS[domain]

  return Array.from(
    { length: endYear - startYear + 1 },
    (_, index) => startYear + index
  )
}

export function populationPercentage(
  value: number,
  total: number
) {
  if (total <= 0) return 0

  return Math.min(
    100,
    Math.round((value / total) * 100)
  )
}

function yearsInRange(
  startYear: number | null,
  endYear: number | null,
  domain: PopulationDomain
) {
  if (startYear == null && endYear == null) {
    return []
  }

  const period = POPULATION_PERIODS[domain]
  const start = Math.max(
    period.startYear,
    startYear ?? endYear ?? period.startYear
  )
  const end = Math.min(
    period.endYear,
    endYear ?? startYear ?? period.endYear
  )

  if (end < start) return []

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  )
}

export function publicationPopulationYears(
  papers: PublicPaper[]
) {
  const period = POPULATION_PERIODS.publications

  return new Set(
    papers
      .map((paper) =>
        paper.publication_date
          ? Number(paper.publication_date.slice(0, 4))
          : Number.NaN
      )
      .filter(
        (year) =>
          Number.isInteger(year) &&
          year >= period.startYear &&
          year <= period.endYear
      )
  )
}

export function conferencePopulationYears(
  presentations: PublicConferencePresentation[]
) {
  return new Set(
    presentations.flatMap((presentation) => {
      const startYear = Number(
        presentation.start_date.slice(0, 4)
      )
      const endYear = Number(
        presentation.end_date.slice(0, 4)
      )

      return yearsInRange(
        Number.isInteger(startYear) ? startYear : null,
        Number.isInteger(endYear) ? endYear : null,
        'conferences'
      )
    })
  )
}

export function projectPopulationYears(
  projects: PublicProject[]
) {
  return new Set(
    projects.flatMap((project) =>
      yearsInRange(
        project.start_year,
        project.end_year,
        'projects'
      )
    )
  )
}

export function teachingPopulationYears(
  teaching: PublicTeachingItem[]
) {
  return new Set(
    teaching.flatMap((item) =>
      yearsInRange(
        item.start_year,
        item.is_current
          ? POPULATION_PERIODS.teaching.endYear
          : item.end_year,
        'teaching'
      )
    )
  )
}
