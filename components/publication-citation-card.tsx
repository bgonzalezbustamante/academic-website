import Link from 'next/link'

import PublicationLanguageFlag from '@/components/publication-language-flag'
import PublicationLinks from '@/components/publication-links'
import { publicationYearLabel } from '@/lib/publication-dates'
import type { PublicPaper } from '@/types/public'

export type CitationPaper = PublicPaper & {
  citation: string | null
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
          {publicationYearLabel(paper.publication_date)}
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
        {paper.language && (
          <PublicationLanguageFlag language={paper.language} />
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
        <div className="publication-card-abstract">
          <p className="research-markdown-source">
            {paper.abstract}
          </p>
        </div>
      )}

      <PublicationLinks paper={paper} />
    </article>
  )
}
