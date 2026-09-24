import {
  faArrowUpRightFromSquare,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'

import { listPublicConferencePresentations } from '@/lib/conferences'
import type { PublicConferencePresentation } from '@/types/public'

export const metadata: Metadata = {
  title: 'Conferences',
  description:
    'Conference presentations by Bastián González-Bustamante and collaborators.',
  alternates: {
    canonical: '/conferences',
  },
}

export const revalidate = 300

function formatPresentationDate(value: string | null) {
  if (!value) return null

  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

export default async function ConferencesPage() {
  let presentations: PublicConferencePresentation[] = []
  let available = true

  try {
    presentations = await listPublicConferencePresentations()
  } catch {
    available = false
  }

  return (
    <section className="page-section">
      <div className="site-shell narrow-shell">
        <p className="eyebrow">Academic presentations</p>
        <h1>Conferences</h1>
        <p className="page-lead">
          Conference presentations in the order supplied by the public
          Research Dashboard contract.
        </p>

        {!available ? (
          <div className="empty-state">
            <p>Conference presentations are temporarily unavailable.</p>
          </div>
        ) : presentations.length === 0 ? (
          <div className="empty-state">
            <p>No public conference presentations are currently available.</p>
          </div>
        ) : (
          <div className="conference-list">
            {presentations.map((presentation, index) => {
              const date = formatPresentationDate(
                presentation.presentation_date
              )

              return (
                <article
                  className="conference-card"
                  key={[
                    presentation.event_name,
                    presentation.presentation_date ?? 'undated',
                    presentation.presentation_title ?? 'untitled',
                    index,
                  ].join('-')}
                >
                  <div className="conference-meta">
                    {date && <span>{date}</span>}
                    {presentation.presentation_type && (
                      <span>{presentation.presentation_type}</span>
                    )}
                  </div>

                  <h2>{presentation.event_name}</h2>

                  {presentation.presentation_title && (
                    <p className="conference-title">
                      {presentation.presentation_title}
                    </p>
                  )}

                  {presentation.authors.length > 0 && (
                    <p className="conference-authors">
                      {presentation.authors.join(', ')}
                    </p>
                  )}

                  {presentation.location && (
                    <p className="conference-location">
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        aria-hidden="true"
                      />
                      <span>{presentation.location}</span>
                    </p>
                  )}

                  {presentation.url && (
                    <a
                      className="conference-link"
                      href={presentation.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Presentation link
                      <FontAwesomeIcon
                        icon={faArrowUpRightFromSquare}
                        aria-hidden="true"
                      />
                    </a>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
