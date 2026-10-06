import type { MetadataRoute } from 'next'

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [papersResult, projectsResult] = await Promise.allSettled([
    listPublicPapers(),
    listPublicProjects(),
  ])

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: getAbsoluteSiteUrl(path),
  }))

  if (papersResult.status === 'fulfilled') {
    entries.push(
      ...papersResult.value.map((paper) => ({
        url: getAbsoluteSiteUrl(`/publication/${paper.slug}`),
      }))
    )
  }

  if (projectsResult.status === 'fulfilled') {
    entries.push(
      ...projectsResult.value.map((project) => ({
        url: getAbsoluteSiteUrl(`/project/${project.slug}`),
      }))
    )
  }

  return entries
}
