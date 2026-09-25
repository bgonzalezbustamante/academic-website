'use client'

import {
  faArrowUpRightFromSquare,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'

import type { PublicConferencePresentation } from '@/types/public'

type Props = {
  presentations: PublicConferencePresentation[]
}

const PAGE_SIZE = 10

function isKeynotePresentation(
  presentation: PublicConferencePresentation
) {
  return (
    presentation.presentation_type?.trim().toLowerCase() ===
    'keynote'
  )
}

function formatPresentationDate(value: string | null) {
  if (!value) return 'Undated'

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export default function ConferenceOverviewTable({
  presentations,
}: Props) {
  const [page, setPage] = useState(1)
  const totalPages = Math.max(
    1,
    Math.ceil(presentations.length / PAGE_SIZE)
  )

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return presentations.slice(start, start + PAGE_SIZE)
  }, [page, presentations])

  const start = presentations.length === 0
    ? 0
    : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(
    page * PAGE_SIZE,
    presentations.length
  )

  const hasKeynote = presentations.some(isKeynotePresentation)

  return (
    <>
      <div className="conference-table-wrap">
        <table className="conference-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Event</th>
              <th>Presentation</th>
              <th>Location</th>
              <th>Authors</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((presentation, index) => (
              <tr
                key={[
                  presentation.event_name,
                  presentation.presentation_date ?? 'undated',
                  presentation.presentation_title ?? 'untitled',
                  (page - 1) * PAGE_SIZE + index,
                ].join('-')}
              >
                <td className="conference-date-cell">
                  {formatPresentationDate(
                    presentation.presentation_date
                  )}
                </td>
                <td>
                  <strong>
                    {presentation.event_short_name ||
                      presentation.event_name}
                  </strong>
                  <span className="conference-event-full">
                    {presentation.event_name}
                  </span>
                </td>
                <td>
                  {presentation.presentation_title ? (
                    presentation.url ? (
                      <a
                        className="conference-presentation-title-link"
                        href={presentation.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <span>{presentation.presentation_title}</span>
                        {isKeynotePresentation(presentation) && (
                          <FontAwesomeIcon
                            className="conference-keynote-icon"
                            icon={faStar}
                            aria-hidden="true"
                          />
                        )}
                        <FontAwesomeIcon
                          className="inline-external-icon"
                          icon={faArrowUpRightFromSquare}
                          aria-hidden="true"
                        />
                      </a>
                    ) : (
                      <span className="conference-presentation-title-static">
                        <span>{presentation.presentation_title}</span>
                        {isKeynotePresentation(presentation) && (
                          <FontAwesomeIcon
                            className="conference-keynote-icon"
                            icon={faStar}
                            aria-hidden="true"
                          />
                        )}
                      </span>
                    )
                  ) : (
                    '—'
                  )}
                </td>
                <td>{presentation.location ?? '—'}</td>
                <td>
                  {presentation.authors.length > 0
                    ? presentation.authors.join(', ')
                    : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasKeynote && (
        <p className="conference-table-note">
          <FontAwesomeIcon
            className="conference-keynote-icon"
            icon={faStar}
            aria-hidden="true"
          />
          <span>Keynote presentation</span>
        </p>
      )}

      {totalPages > 1 && (
        <nav
          className="conference-pagination"
          aria-label="Conference overview pagination"
        >
          <p>
            Showing {start}–{end} of {presentations.length}
          </p>

          <div className="conference-pagination-controls">
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
  )
}
