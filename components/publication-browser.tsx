'use client'

import { useMemo, useState } from 'react'

import PublicationCitationCard, {
  type CitationPaper,
} from '@/components/publication-citation-card'

type Props = {
  papers: CitationPaper[]
}

function yearForPaper(paper: CitationPaper) {
  return paper.publication_date
    ? paper.publication_date.slice(0, 4)
    : 'Forthcoming'
}

export default function PublicationBrowser({ papers }: Props) {
  const [year, setYear] = useState('all')
  const [publicationIndex, setPublicationIndex] =
    useState('all')

  const years = useMemo(
    () =>
      Array.from(
        new Set(papers.map(yearForPaper))
      ).sort((a, b) => {
        if (a === 'Forthcoming') return -1
        if (b === 'Forthcoming') return 1
        return Number(b) - Number(a)
      }),
    [papers]
  )

  const publicationIndexes = useMemo(
    () =>
      Array.from(
        new Set(
          papers
            .map((paper) => paper.publication_index)
            .filter((value): value is string => Boolean(value))
        )
      ).sort((a, b) => a.localeCompare(b)),
    [papers]
  )

  const filtered = useMemo(
    () =>
      papers.filter((paper) => {
        const matchesYear =
          year === 'all' || yearForPaper(paper) === year
        const matchesIndex =
          publicationIndex === 'all' ||
          paper.publication_index === publicationIndex

        return matchesYear && matchesIndex
      }),
    [papers, publicationIndex, year]
  )

  const filtersActive =
    year !== 'all' || publicationIndex !== 'all'

  return (
    <>
      <div className="publication-filters">
        <label>
          <span>Year</span>
          <select
            value={year}
            onChange={(event) => setYear(event.target.value)}
          >
            <option value="all">All years</option>
            {years.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Publication index</span>
          <select
            value={publicationIndex}
            onChange={(event) =>
              setPublicationIndex(event.target.value)
            }
          >
            <option value="all">All indexes</option>
            {publicationIndexes.map((value) => (
              <option value={value} key={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        {filtersActive && (
          <button
            type="button"
            className="publication-filter-reset"
            onClick={() => {
              setYear('all')
              setPublicationIndex('all')
            }}
          >
            Clear filters
          </button>
        )}

        <p className="publication-filter-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'paper' : 'papers'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="publication-list">
          {filtered.map((paper) => (
            <PublicationCitationCard
              key={paper.slug}
              paper={paper}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>No publications match the selected filters.</p>
        </div>
      )}
    </>
  )
}
