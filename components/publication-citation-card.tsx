import Link from 'next/link'

import PublicationLinks from '@/components/publication-links'
import type { PublicPaper } from '@/types/public'

export type CitationPaper = PublicPaper & {
  citation: string | null
}

function publicationYear(date: string | null) {
  return date ? date.slice(0, 4) : 'Forthcoming'
}

function renderCitation(citation: string) {
  return citation
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (
        segment.startsWith('**') &&
        segment.endsWith('**')
      ) {
        return (
          <strong className="citation-bold" key={index}>
            {segment.slice(2, -2)}
          </strong>
        )
      }

      if (
        segment.startsWith('*') &&
        segment.endsWith('*')
      ) {
        return <em key={index}>{segment.slice(1, -1)}</em>
      }

      return segment
    })
}

export default function PublicationCitationCard({
  paper,
}: {
  paper: CitationPaper
}) {
  return (
    <article className="publication-card publication-citation-card">
      <div className="metadata-tags publication-meta">
        <span className="metadata-tag">
          {publicationYear(paper.publication_date)}
        </span>
        {paper.publication_index && (
          <span className="metadata-tag">
            {paper.publication_index}
          </span>
        )}
        {paper.featured && (
          <span className="metadata-tag metadata-tag-accent">
            Featured
          </span>
        )}
      </div>

      <h2 className="sr-only">{paper.title}</h2>

      <p className="publication-citation">
        <Link href={`/publication/${paper.slug}`}>
          {paper.citation
            ? renderCitation(paper.citation)
            : paper.title}
        </Link>
      </p>

      {paper.abstract && (
        <p className="publication-card-abstract">
          {paper.abstract}
        </p>
      )}

      <PublicationLinks paper={paper} />
    </article>
  )
}
