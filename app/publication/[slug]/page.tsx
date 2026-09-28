import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import PublicationKeyHighlight from '@/components/publication-key-highlight'
import PublicationLanguageFlag from '@/components/publication-language-flag'
import ResearchMarkdownEnhancer from '@/components/research-markdown-enhancer'
import PublicationLinks from '@/components/publication-links'
import {
  formatPublicationMonthYear,
  isForthcomingPublicationDate,
} from '@/lib/publication-dates'
import { getPublicPaper } from '@/lib/publications'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const paper = await getPublicPaper(slug)

  if (!paper) return { title: 'Publication not found' }

  const description =
    paper.abstract ?? paper.venue ?? 'Academic publication.'

  return {
    title: paper.title,
    description,
    alternates: {
      canonical: `/publication/${paper.slug}`,
    },
    openGraph: {
      title: paper.title,
      description,
      type: 'article',
    },
  }
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params
  const paper = await getPublicPaper(slug)

  if (!paper) notFound()

  const publicationMonthYear =
    formatPublicationMonthYear(paper.publication_date)
  const publicationYear =
    paper.publication_date?.slice(0, 4) ?? null
  const forthcoming = isForthcomingPublicationDate(
    paper.publication_date
  )

  return (
    <article className="page-section">
      <div className="site-shell narrow-shell publication-detail">
        <p className="eyebrow">Publication</p>
        <h1>{paper.title}</h1>

        {paper.authors.length > 0 && (
          <p className="authors detail-authors">
            {paper.authors.join(', ')}
          </p>
        )}

        {paper.venue && (
          <p className="venue detail-venue">{paper.venue}</p>
        )}

        <div className="publication-detail-meta">
          {(paper.publication_date || forthcoming) && (
            <span>
              {forthcoming
                ? publicationYear
                  ? `Forthcoming · ${publicationYear}`
                  : 'Forthcoming'
                : `Published ${publicationMonthYear}`}
            </span>
          )}
          {paper.publication_index && (
            <span>{paper.publication_index}</span>
          )}
          {paper.language && (
            <PublicationLanguageFlag language={paper.language} />
          )}
        </div>

        <PublicationLinks paper={paper} />

        {paper.abstract && (
          <section className="abstract-section">
            <h2>Abstract</h2>
            <p className="research-markdown-source abstract-markdown-source">
              {paper.abstract}
            </p>
          </section>
        )}

        <PublicationKeyHighlight paper={paper} />
        <ResearchMarkdownEnhancer />
      </div>
    </article>
  )
}
