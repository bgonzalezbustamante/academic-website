import {
  faCalendarDays,
  faCircleCheck,
  faRoute,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'

import { formatConferenceDateRange } from '@/lib/conference-dates'
import type { PublicConferencePresentation } from '@/types/public'

type Props = {
  presentations: PublicConferencePresentation[]
  year: number
  currentDate: string
  variant?: 'full' | 'compact'
  embedded?: boolean
}

function orderPresentations(
  presentations: PublicConferencePresentation[]
) {
  return [...presentations].sort(
    (a, b) =>
      a.start_date.localeCompare(b.start_date) ||
      a.end_date.localeCompare(b.end_date)
  )
}

function compactPresentations(
  presentations: PublicConferencePresentation[],
  currentDate: string
) {
  const ordered = orderPresentations(presentations)
  const forthcoming = ordered
    .filter((presentation) => presentation.end_date >= currentDate)
    .slice(0, 5)

  if (forthcoming.length === 5) {
    return forthcoming
  }

  const recent = ordered
    .filter((presentation) => presentation.end_date < currentDate)
    .slice(-(5 - forthcoming.length))

  return orderPresentations([...recent, ...forthcoming])
}

function RoadmapShell({
  embedded,
  children,
}: {
  embedded: boolean
  children: ReactNode
}) {
  if (embedded) return children

  return <div className="site-shell">{children}</div>
}

export default function PresentationRoadmap({
  presentations,
  year,
  currentDate,
  variant = 'full',
  embedded = false,
}: Props) {
  const isCompact = variant === 'compact'

  const ordered = isCompact
    ? compactPresentations(presentations, currentDate)
    : orderPresentations(
        presentations.filter((presentation) =>
          presentation.start_date.startsWith(String(year))
        )
      )

  const rows = isCompact
    ? [ordered]
    : Array.from(
        { length: Math.ceil(ordered.length / 5) },
        (_, rowIndex) =>
          ordered.slice(rowIndex * 5, rowIndex * 5 + 5)
      )

  const heading = isCompact
    ? 'Latest/forthcoming presentations'
    : 'Presentation roadmap'

  const description = isCompact
    ? 'The five most recent and forthcoming public presentations at conferences, workshops, and seminars.'
    : `Public presentations at conferences, workshops, and seminars during ${year}.`

  return (
    <section
      className={[
        'section',
        'roadmap-section',
        embedded ? 'roadmap-section-embedded' : '',
        isCompact ? 'roadmap-section-compact' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id="roadmap"
    >
      <RoadmapShell embedded={embedded}>
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              {isCompact ? 'Conferences' : 'Current year'}
            </p>
            <h2>{heading}</h2>
            <p className="section-intro">{description}</p>
            {isCompact && (
              <p className="roadmap-full-note">
                <FontAwesomeIcon icon={faRoute} aria-hidden="true" />
                <span>
                  The full current-year roadmap is available in the{' '}
                  <Link href="/conferences">Conferences section</Link>.
                </span>
              </p>
            )}
          </div>

          {isCompact && (
            <Link className="section-link" href="/conferences">
              View all
              <span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {ordered.length === 0 ? (
          <div className="empty-state">
            <p>
              {isCompact
                ? 'No public presentations are currently available.'
                : `No public presentations are currently scheduled for ${year}.`}
            </p>
          </div>
        ) : (
          <div className="roadmap-scroll">
            <div className="roadmap-rows">
              {rows.map((row, rowIndex) => {
                const nextRow = rows[rowIndex + 1]
                const isReversed = !isCompact && rowIndex % 2 === 1
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
                      aria-label={
                        isCompact
                          ? 'Latest and forthcoming conference presentations'
                          : `Conference presentation roadmap for ${year}, row ${rowIndex + 1}`
                      }
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
      </RoadmapShell>
    </section>
  )
}
