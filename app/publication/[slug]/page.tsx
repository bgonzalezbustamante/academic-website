import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PublicationLinks from '@/components/publication-links'
import { getPublicPaper } from '@/lib/publications'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const paper = await getPublicPaper(slug)

  if (!paper) return { title: 'Publication not found' }

  return {
    title: paper.title,
    description: paper.abstract ?? paper.venue ?? 'Academic publication.',
  }
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params
  const paper = await getPublicPaper(slug)

  if (!paper) notFound()

  return (
    <article className="page-section">
      <div className="site-shell narrow-shell publication-detail">
        <p className="eyebrow">Publication</p>
        <h1>{paper.title}</h1>
        <p className="authors detail-authors">{paper.authors.join(', ')}</p>
        {paper.venue && <p className="venue detail-venue">{paper.venue}</p>}
        {paper.publication_date && (
          <p className="publication-date">
            Published {new Intl.DateTimeFormat('en-GB', { year: 'numeric', month: 'long' }).format(new Date(`${paper.publication_date}T00:00:00Z`))}
          </p>
        )}
        <PublicationLinks paper={paper} />

        {paper.abstract && (
          <section className="abstract-section">
            <h2>Abstract</h2>
            <p>{paper.abstract}</p>
          </section>
        )}
      </div>
    </article>
  )
}
