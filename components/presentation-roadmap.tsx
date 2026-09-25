import {
  faCalendarDays,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import { formatConferenceDateRange } from '@/lib/conference-dates'
import type { PublicConferencePresentation } from '@/types/public'

type Props = {
  presentations: PublicConferencePresentation[]
  year: number
  currentDate: string
}

export default function PresentationRoadmap({
  presentations,
  year,
  currentDate,
}: Props) {
  const ordered = presentations
    .filter((presentation) =>
      presentation.start_date.startsWith(String(year))
    )
    .sort(
      (a, b) =>
        a.start_date.localeCompare(b.start_date) ||
        a.end_date.localeCompare(b.end_date)
    )

  const rows = Array.from(
    { length: Math.ceil(ordered.length / 5) },
    (_, rowIndex) => ordered.slice(rowIndex * 5, rowIndex * 5 + 5)
  )

  return (
    <section className="section roadmap-section" id="roadmap">
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Roadmap</p>
            <h2>Conferences</h2>
            <p className="section-intro">
              Public presentations at conferences, workshops, and seminars
              during {year}.
            </p>
          </div>
          <Link className="section-link" href="/conferences">
            View all
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {ordered.length === 0 ? (
          <div className="empty-state">
            <p>No public presentations are currently scheduled for {year}.</p>
          </div>
        ) : (
          <div className="roadmap-scroll">
            <div className="roadmap-rows">
              {rows.map((row, rowIndex) => {
                const nextRow = rows[rowIndex + 1]
                const isReversed = rowIndex % 2 === 1
                const currentEndPosition = isReversed
                  ? `${50 / row.length}%`
                  : `${100 - 50 / row.length}%`
                const nextFirstPosition = nextRow
                  ? rowIndex % 2 === 0
                    ? `${100 - 50 / nextRow.length}%`
                    : `${50 / nextRow.length}%`
                  : null

                return (
                  <div className="roadmap-row-block" key={rowIndex}>
                    <ol
                      className={[
                        'roadmap-timeline',
                        isReversed ? 'roadmap-timeline-reverse' : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      aria-label={`Conference presentation roadmap for ${year}, row ${rowIndex + 1}`}
                      start={rowIndex * 5 + 1}
                      style={
                        {
                          '--roadmap-row-count': row.length,
                        } as CSSProperties
                      }
                    >
                      {row.map((presentation, rowItemIndex) => {
                        const index = rowIndex * 5 + rowItemIndex
                        const shortName =
                          presentation.event_short_name ||
                          presentation.event_name
                        const dateRange =
                          formatConferenceDateRange(
                            presentation.start_date,
                            presentation.end_date,
                            'long'
                          )
                        const isFinished =
                          presentation.end_date < currentDate

                        const positionClass =
                          index % 2 === 0
                            ? 'roadmap-item-upper'
                            : 'roadmap-item-lower'

                        const accessibleLocation =
                          presentation.location
                            ? `, ${presentation.location}`
                            : ''
                        const dateLocation =
                          presentation.location
                            ? `${dateRange}, ${presentation.location}`
                            : dateRange

                        return (
                          <li
                            className={[
                              'roadmap-item',
                              positionClass,
                              isFinished
                                ? 'roadmap-item-past'
                                : 'roadmap-item-upcoming',
                            ].join(' ')}
                            key={`${presentation.start_date}-${presentation.end_date}-${shortName}-${index}`}
                            aria-label={`${shortName}, ${dateRange}${accessibleLocation}${isFinished ? ', finished presentation' : ', upcoming or ongoing presentation'}`}
                          >
                            <span className="roadmap-label">
                              <span className="roadmap-label-main">
                                <FontAwesomeIcon
                                  className="roadmap-status-icon"
                                  icon={
                                    isFinished
                                      ? faCircleCheck
                                      : faCalendarDays
                                  }
                                  aria-hidden="true"
                                />
                                <span>{shortName}</span>
                              </span>

                              <span className="roadmap-label-location">
                                {dateLocation}
                              </span>
                            </span>
                            <span
                              className="roadmap-node"
                              aria-hidden="true"
                            />
                          </li>
                        )
                      })}
                    </ol>

                    {nextFirstPosition && (
                      <span
                        className={[
                          'roadmap-row-connector',
                          rowIndex % 2 === 0
                            ? 'roadmap-row-connector-right'
                            : 'roadmap-row-connector-left',
                        ].join(' ')}
                        style={
                          {
                            '--roadmap-current-end-position':
                              currentEndPosition,
                            '--roadmap-next-first-position':
                              nextFirstPosition,
                          } as CSSProperties
                        }
                        aria-hidden="true"
                      >
                        <span className="roadmap-row-connector-top" />
                        <span className="roadmap-row-connector-side" />
                        <span className="roadmap-row-connector-bottom" />
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
