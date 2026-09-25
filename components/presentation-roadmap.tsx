import {
  faCalendarDays,
  faCircleCheck,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import type { CSSProperties } from 'react'

import type { PublicConferencePresentation } from '@/types/public'

type Props = {
  presentations: PublicConferencePresentation[]
  year: number
  currentDate: string
}

function formatAccessibleDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export default function PresentationRoadmap({
  presentations,
  year,
  currentDate,
}: Props) {
  const ordered = presentations
    .filter((presentation) =>
      presentation.presentation_date?.startsWith(
        String(year)
      )
    )
    .sort((a, b) =>
      (a.presentation_date ?? '').localeCompare(
        b.presentation_date ?? ''
      )
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
              {rows.map((row, rowIndex) => (
                <ol
                  className="roadmap-timeline"
                  aria-label={`Conference presentation roadmap for ${year}, row ${rowIndex + 1}`}
                  start={rowIndex * 5 + 1}
                  style={
                    {
                      '--roadmap-row-count': row.length,
                    } as CSSProperties
                  }
                  key={rowIndex}
                >
                  {row.map((presentation, rowItemIndex) => {
                    const index = rowIndex * 5 + rowItemIndex
                    const date = presentation.presentation_date!
                    const shortName =
                      presentation.event_short_name ||
                      presentation.event_name
                    const isPast = date < currentDate

                    const positionClass =
                      index % 2 === 0
                        ? 'roadmap-item-upper'
                        : 'roadmap-item-lower'

                    const accessibleLocation =
                      presentation.location
                        ? `, ${presentation.location}`
                        : ''

                    return (
                      <li
                        className={[
                          'roadmap-item',
                          positionClass,
                          isPast
                            ? 'roadmap-item-past'
                            : 'roadmap-item-upcoming',
                        ].join(' ')}
                        key={`${date}-${shortName}-${index}`}
                        title={`${shortName} — ${formatAccessibleDate(date)}${accessibleLocation}`}
                        aria-label={`${shortName}, ${formatAccessibleDate(date)}${accessibleLocation}${isPast ? ', past presentation' : ', upcoming presentation'}`}
                      >
                        <span className="roadmap-label">
                          <span className="roadmap-label-main">
                            <FontAwesomeIcon
                              className="roadmap-status-icon"
                              icon={
                                isPast
                                  ? faCircleCheck
                                  : faCalendarDays
                              }
                              aria-hidden="true"
                            />
                            <span>{shortName}</span>
                          </span>

                          {presentation.location && (
                            <span className="roadmap-label-location">
                              {presentation.location}
                            </span>
                          )}
                        </span>
                        <span
                          className="roadmap-node"
                          aria-hidden="true"
                        />
                      </li>
                    )
                  })}
                </ol>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
