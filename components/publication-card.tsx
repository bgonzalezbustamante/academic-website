import Link from 'next/link'

import PublicationLinks from '@/components/publication-links'
import type { PublicPaper } from '@/types/public'

function publicationYear(date: string | null) {
  return date ? date.slice(0, 4) : 'Forthcoming'
}

type Props = {
  paper: PublicPaper
}

export default function PublicationCard({ paper }: Props) {
  return (
    <article className="publication-card">
      <div className="metadata-tags publication-meta">
        <span className="metadata-tag">
          {publicationYear(paper.publication_date)}
        </span>
        {paper.publication_index && (
          <span className="metadata-tag">{paper.publication_index}</span>
        )}
        {paper.featured && (
          <span className="metadata-tag metadata-tag-accent">Featured</span>
        )}
      </div>
      <h2>
        <Link href={`/publication/${paper.slug}`}>{paper.title}</Link>
      </h2>
      <p className="authors">{paper.authors.join(', ')}</p>
      {paper.venue && <p className="venue">{paper.venue}</p>}
      <PublicationLinks paper={paper} />
    </article>
  )
}
