'use client'

import {
  faBookOpen,
  faFileLines,
  faFolderOpen,
  faShareNodes,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import PublicationCitationCard, {
  type CitationPaper,
} from '@/components/publication-citation-card'
import { firstAuthorPercentage } from '@/lib/authorship'
import { publicationYearLabel } from '@/lib/publication-dates'
import ResearchMarkdownEnhancer from '@/components/research-markdown-enhancer'

type Props = {
  papers: CitationPaper[]
}

const PUBLICATION_INDEX_ORDER = [
  'WoS-SSCI',
  'Scopus',
  'WoS-ESCI',
  'Book chapter',
  'SciELO/Latindex',
  'Working paper',
  'Preprint',
] as const

const PAGE_SIZE = 10

export default function PublicationBrowser({ papers }: Props) {
  const [year, setYear] = useState('all')
  const [publicationIndex, setPublicationIndex] =
    useState('all')
  const [page, setPage] = useState(1)

  const years = useMemo(
    () =>
      Array.from(
        new Set(papers.map((paper) => publicationYearLabel(paper.publication_date)))
      ).sort((a, b) => {
        if (a === 'Forthcoming') return -1
        if (b === 'Forthcoming') return 1
        return Number(b) - Number(a)
      }),
    [papers]
  )

  const journalCount = useMemo(
    () =>
      new Set(
        papers
          .map((paper) => paper.venue?.trim())
          .filter((value): value is string => Boolean(value))
      ).size,
    [papers]
  )

  const firstAuthorShare = useMemo(
    () => firstAuthorPercentage(papers),
    [papers]
  )

  const filtered = useMemo(
    () =>
      papers.filter((paper) => {
        const matchesYear =
          year === 'all' || publicationYearLabel(paper.publication_date) === year
        const matchesIndex =
          publicationIndex === 'all' ||
          paper.publication_index === publicationIndex

        return matchesYear && matchesIndex
      }),
    [papers, publicationIndex, year]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE)
  )

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  const start = filtered.length === 0
    ? 0
    : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(page * PAGE_SIZE, filtered.length)

  const filtersActive =
    year !== 'all' || publicationIndex !== 'all'

  return (
    <>
      <section
        className="conference-stats-grid publication-stats-grid"
        aria-label="Publication summary"
      >
        <article className="conference-stat-card">
          <div className="conference-stat-icon">
            <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
          </div>
          <div>
            <p>Papers</p>
            <strong>{papers.length.toLocaleString('en-GB')}</strong>
          </div>
        </article>

        <article className="conference-stat-card">
          <div className="conference-stat-icon">
            <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
          </div>
          <div>
            <p>Journals/Venues</p>
            <strong>{journalCount.toLocaleString('en-GB')}</strong>
          </div>
        </article>

        <article className="conference-stat-card">
          <div className="conference-stat-icon">
            <FontAwesomeIcon icon={faUserPen} aria-hidden="true" />
          </div>
          <div>
            <p>First author</p>
            <strong>{firstAuthorShare.toFixed(1)}%</strong>
          </div>
        </article>
      </section>

      <div className="publication-filters">
        <label>
          <span>Year</span>
          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value)
              setPage(1)
            }}
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
            onChange={(event) => {
              setPublicationIndex(event.target.value)
              setPage(1)
            }}
          >
            <option value="all">All indexes</option>
            {PUBLICATION_INDEX_ORDER.map((value) => (
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
              setPage(1)
            }}
          >
            Clear filters
          </button>
        )}

        <div className="publication-filter-links">
          <Link
            className="publication-filter-link"
            href="/publications/resources"
          >
            <FontAwesomeIcon
              icon={faFolderOpen}
              aria-hidden="true"
            />
            Open research resources
          </Link>
          <Link
            className="publication-filter-link"
            href="/publications/coauthorship"
          >
            <FontAwesomeIcon
              icon={faShareNodes}
              aria-hidden="true"
            />
            Co-authorship network
          </Link>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="publication-list">
            {visible.map((paper) => (
              <PublicationCitationCard
                key={paper.slug}
                paper={paper}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="publication-pagination"
              aria-label="Publication pagination"
            >
              <p>
                Showing {start}–{end} of {filtered.length}
              </p>

              <div className="publication-pagination-controls">
                <button
                  type="button"
                  disabled={page === 1}
                  onClick={() =>
                    setPage((value) => Math.max(1, value - 1))
                  }
                >
                  Previous
                </button>

                <span>
                  Page {page} of {totalPages}
                </span>

                <button
                  type="button"
                  disabled={page === totalPages}
                  onClick={() =>
                    setPage((value) =>
                      Math.min(totalPages, value + 1)
                    )
                  }
                >
                  Next
                </button>
              </div>
            </nav>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>No publications match the selected filters.</p>
        </div>
      )}

      <ResearchMarkdownEnhancer />
    </>
  )
}
