import type { Metadata } from 'next'

import PublicationCard from '@/components/publication-card'
import { listPublicPapers } from '@/lib/publications'

export const metadata: Metadata = {
  title: 'Publications',
  description: 'Publications and working papers by Bastián González-Bustamante.',
}

export const revalidate = 300

export default async function PublicationsPage() {
  const papers = await listPublicPapers()

  return (
    <section className="page-section">
      <div className="site-shell narrow-shell">
        <p className="eyebrow">Research output</p>
        <h1>Publications</h1>
        <p className="page-lead">
          This list is generated from papers explicitly marked Public in Research Dashboard.
        </p>

        {papers.length === 0 ? (
          <div className="empty-state"><p>No public papers are currently available.</p></div>
        ) : (
          <div className="publication-list">
            {papers.map((paper) => <PublicationCard key={paper.slug} paper={paper} />)}
          </div>
        )}
      </div>
    </section>
  )
}
