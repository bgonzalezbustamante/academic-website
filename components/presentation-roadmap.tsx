import Link from 'next/link'

import type { PublicConferencePresentation } from '@/types/public'

type Props = {
  presentations: PublicConferencePresentation[]
  year: number
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

  return (
    <section className="section roadmap-section" id="roadmap">
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Current year</p>
            <h2>Roadmap</h2>
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
            <ol
              className="roadmap-timeline"
              aria-label={`Conference presentation roadmap for ${year}`}
            >
              {ordered.map((presentation, index) => {
                const date = presentation.presentation_date!
                const shortName =
                  presentation.event_short_name ||
                  presentation.event_name

                return (
                  <li
                    className={
                      index % 2 === 0
                        ? 'roadmap-item roadmap-item-upper'
                        : 'roadmap-item roadmap-item-lower'
                    }
                    key={`${date}-${shortName}-${index}`}
                    title={`${shortName} — ${formatAccessibleDate(date)}`}
                    aria-label={`${shortName}, ${formatAccessibleDate(date)}`}
                  >
                    <span className="roadmap-label">{shortName}</span>
                    <span className="roadmap-node" aria-hidden="true" />
                  </li>
                )
              })}
            </ol>
          </div>
        )}
      </div>
    </section>
  )
}
