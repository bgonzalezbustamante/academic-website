import type { Metadata } from 'next'

import PublicationBrowser from '@/components/publication-browser'
import SectionPopulationProgress from '@/components/section-population-progress'
import { getPublicPaper, listPublicPapers } from '@/lib/publications'
import {
  POPULATION_TARGETS,
  publicationPopulationYears,
} from '@/lib/site-population'
import type { PublicPaper } from '@/types/public'

export const metadata: Metadata = {
  title: 'Publications',
  description:
    'Publications and working papers by Bastián González-Bustamante.',
  alternates: {
    canonical: '/publications',
  },
}

export const revalidate = 300

export default async function PublicationsPage() {
  let papers: PublicPaper[] = []
  let available = true

  try {
    papers = await listPublicPapers()
  } catch {
    available = false
  }

  const papersWithCitation = await Promise.all(
    papers.map(async (paper) => {
      try {
        const detail = await getPublicPaper(paper.slug)

        return {
          ...paper,
          citation: detail?.citation ?? null,
        }
      } catch {
        return {
          ...paper,
          citation: null,
        }
      }
    })
  )

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="publications-page-heading">
          <p className="eyebrow">Research output</p>
          <h1>Publications</h1>
          <p className="page-lead">
            Papers ordered from the most recent publication onwards.
          </p>
        </div>

        <SectionPopulationProgress
          label="Publications"
          value={available ? papers.length : null}
          total={POPULATION_TARGETS.publications}
          unit="publications"
          coveredYears={
            available
              ? publicationPopulationYears(papers)
              : null
          }
        />

        {!available ? (
          <div className="empty-state">
            <p>Publications are temporarily unavailable.</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="empty-state">
            <p>No public papers are currently available.</p>
          </div>
        ) : (
          <PublicationBrowser papers={papersWithCitation} />
        )}
      </div>
    </section>
  )
}
