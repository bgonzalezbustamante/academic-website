'use client'

import {
  faArrowUpRightFromSquare,
  faStar,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useMemo, useState } from 'react'

import { formatConferenceDateRange } from '@/lib/conference-dates'
import type { PublicConferencePresentation } from '@/types/public'

type Props = {
  presentations: PublicConferencePresentation[]
}

const PAGE_SIZE = 10

function isKeynotePresentation(
  presentation: PublicConferencePresentation
) {
  return presentation.presentation_type === 'Keynote'
}

export default function ConferenceOverviewTable({
  presentations,
}: Props) {
  const [page, setPage] = useState(1)
  const orderedPresentations = useMemo(
    () =>
      [...presentations].sort(
        (a, b) =>
          b.start_date.localeCompare(a.start_date) ||
          b.end_date.localeCompare(a.end_date)
      ),
    [presentations]
  )

  const totalPages = Math.max(
    1,
    Math.ceil(orderedPresentations.length / PAGE_SIZE)
  )

  const visible = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return orderedPresentations.slice(start, start + PAGE_SIZE)
  }, [page, orderedPresentations])

  const start = orderedPresentations.length === 0
    ? 0
    : (page - 1) * PAGE_SIZE + 1
  const end = Math.min(
    page * PAGE_SIZE,
    orderedPresentations.length
  )

  const hasKeynote = orderedPresentations.some(
    isKeynotePresentation
  )

  return (
    <>
      <div className="conference-table-wrap">
        <table className="conference-table">
          <caption className="sr-only">
            Conference presentations
          </caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Event</th>
              <th scope="col">Presentation</th>
              <th scope="col">Location</th>
              <th scope="col">Authors</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((presentation, index) => (
              <tr
                key={[
                  presentation.event_name,
                  presentation.start_date,
                  presentation.end_date,
                  presentation.presentation_title ?? 'untitled',
                  (page - 1) * PAGE_SIZE + index,
                ].join('-')}
              >
                <td className="conference-date-cell">
                  {formatConferenceDateRange(
                    presentation.start_date,
                    presentation.end_date
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
            Showing {start}–{end} of {orderedPresentations.length}
          </p>

          <div className="conference-pagination-controls">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage(1)}
            >
              First
            </button>

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

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage(totalPages)}
            >
              Last
            </button>
          </div>
        </nav>
      )}
    </>
  )
}
