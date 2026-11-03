import type { MetadataRoute } from 'next'

import { isForthcomingPublicationDate } from '@/lib/publication-dates'
import { listPublicPapers } from '@/lib/publications'
import { listPublicProjects } from '@/lib/projects'
import { getAbsoluteSiteUrl } from '@/lib/site-url'

export const revalidate = 300

const STATIC_PATHS = [
  '/',
  '/publications',
  '/publications/profile',
  '/publications/coauthorship',
  '/projects',
  '/software',
  '/paintings',
  '/weekly-timeline',
  '/conferences',
  '/teaching',
  '/trajectory',
  '/dora',
  '/credit',
  '/release-notes',
] as const

// lastModified is given only where the data dates the content: a paper's
// publication date, and for a project or /publications the latest past date
// among its papers (and, for projects, its conference presentations). Other
// pages carry no date rather than an invented one.
function latestPastDate(dates: (string | null | undefined)[]) {
  return dates
    .map((date) => date?.slice(0, 10) ?? null)
    .filter(
      (date): date is string =>
        date !== null && !isForthcomingPublicationDate(date)
    )
    .sort()
    .at(-1)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [papersResult, projectsResult] = await Promise.allSettled([
    listPublicPapers(),
    listPublicProjects(),
  ])

  const papers =
    papersResult.status === 'fulfilled' ? papersResult.value : []
  const paperDates = new Map(
    papers.map((paper) => [paper.slug, paper.publication_date])
  )
  const latestPaperDate = latestPastDate(
    papers.map((paper) => paper.publication_date)
  )

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: getAbsoluteSiteUrl(path),
    ...(path === '/publications' && latestPaperDate
      ? { lastModified: latestPaperDate }
      : {}),
  }))

  entries.push(
    ...papers.map((paper) => {
      const lastModified = latestPastDate([paper.publication_date])

      return {
        url: getAbsoluteSiteUrl(`/publication/${paper.slug}`),
        ...(lastModified ? { lastModified } : {}),
      }
    })
  )

  if (projectsResult.status === 'fulfilled') {
    entries.push(
      ...projectsResult.value.map((project) => {
        const lastModified = latestPastDate([
          ...project.publication_slugs.map((slug) => paperDates.get(slug)),
          ...project.conference_presentations.map(
            (presentation) => presentation.start_date
          ),
        ])

        return {
          url: getAbsoluteSiteUrl(`/project/${project.slug}`),
          ...(lastModified ? { lastModified } : {}),
        }
      })
    )
  }

  return entries
}
