import type { Metadata } from 'next'

import PublicationCard from '@/components/publication-card'
import { listPublicPapers } from '@/lib/publications'
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

  return (
    <section className="page-section">
      <div className="site-shell narrow-shell">
        <p className="eyebrow">Research output</p>
        <h1>Publications</h1>
        <p className="page-lead">
          Papers explicitly published through the Research Dashboard public
          contract, ordered from the most recent publication onwards.
        </p>

        {!available ? (
          <div className="empty-state">
            <p>Publications are temporarily unavailable.</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="empty-state">
            <p>No public papers are currently available.</p>
          </div>
        ) : (
          <div className="publication-list">
            {papers.map((paper) => (
              <PublicationCard key={paper.slug} paper={paper} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
