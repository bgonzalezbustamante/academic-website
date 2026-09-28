import type {
  PublicConferencePresentation,
  PublicPaper,
  PublicProject,
  PublicTeachingItem,
} from '@/types/public'

export const POPULATION_START_YEAR = 2012
export const POPULATION_END_YEAR = 2026

export const POPULATION_TARGETS = {
  publications: 61,
  projects: 15,
  conferences: 137,
  teaching: 35,
} as const

export const POPULATION_YEARS = Array.from(
  {
    length:
      POPULATION_END_YEAR - POPULATION_START_YEAR + 1,
  },
  (_, index) => POPULATION_START_YEAR + index
)

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
  endYear: number | null
) {
  if (startYear == null && endYear == null) {
    return []
  }

  const start = Math.max(
    POPULATION_START_YEAR,
    startYear ?? endYear ?? POPULATION_START_YEAR
  )
  const end = Math.min(
    POPULATION_END_YEAR,
    endYear ?? startYear ?? POPULATION_END_YEAR
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
          year >= POPULATION_START_YEAR &&
          year <= POPULATION_END_YEAR
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
        Number.isInteger(endYear) ? endYear : null
      )
    })
  )
}

export function projectPopulationYears(
  projects: PublicProject[]
) {
  return new Set(
    projects.flatMap((project) =>
      yearsInRange(project.start_year, project.end_year)
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
          ? POPULATION_END_YEAR
          : item.end_year
      )
    )
  )
}
