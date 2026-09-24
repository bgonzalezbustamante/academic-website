import {
  faEarthEurope,
  faMicrophoneLines,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'

import AcademicWorldMap, {
  type WorldMapCountry,
} from '@/components/academic-world-map'
import ConferenceOverviewTable from '@/components/conference-overview-table'
import { listPublicConferencePresentations } from '@/lib/conferences'
import {
  countryNameToIso3,
  extractCountryFromLocation,
} from '@/lib/geography'
import type { PublicConferencePresentation } from '@/types/public'

export const metadata: Metadata = {
  title: 'Conferences',
  description:
    'Conference presentations by Bastián González-Bustamante and collaborators from 2020 onwards.',
  alternates: {
    canonical: '/conferences',
  },
}

export const revalidate = 300

function from2020(
  presentation: PublicConferencePresentation
) {
  return Boolean(
    presentation.presentation_date &&
    presentation.presentation_date >= '2020-01-01'
  )
}

export default async function ConferencesPage() {
  let presentations: PublicConferencePresentation[] = []
  let available = true

  try {
    presentations = (
      await listPublicConferencePresentations()
    ).filter(from2020)
  } catch {
    available = false
  }

  const countryCounts = new Map<string, number>()

  for (const presentation of presentations) {
    const country = extractCountryFromLocation(
      presentation.location
    )

    if (!country) continue

    countryCounts.set(
      country,
      (countryCounts.get(country) ?? 0) + 1
    )
  }

  const mapCountries: WorldMapCountry[] = Array.from(
    countryCounts.entries()
  )
    .map(([country, value]) => {
      const iso3 = countryNameToIso3(country)

      return iso3
        ? {
            iso3,
            label: country,
            value,
          }
        : null
    })
    .filter(
      (
        country
      ): country is WorldMapCountry => Boolean(country)
    )

  const coauthored = presentations.filter(
    (presentation) => presentation.authors.length > 1
  ).length

  const coauthorshipPercentage =
    presentations.length > 0
      ? (coauthored / presentations.length) * 100
      : 0

  return (
    <section className="page-section">
      <div className="site-shell conference-dashboard">
        <div className="conference-dashboard-heading">
          <p className="eyebrow">Academic presentations</p>
          <h1>Conferences</h1>
          <p className="page-lead">
            Conference and public presentations.
          </p>
        </div>

        {!available ? (
          <div className="empty-state">
            <p>Conference presentations are temporarily unavailable.</p>
          </div>
        ) : presentations.length === 0 ? (
          <div className="empty-state">
            <p>No public conference presentations are currently available.</p>
          </div>
        ) : (
          <>
            <section className="conference-stats-grid" aria-label="Conference summary">
              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faMicrophoneLines}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>Presentations</p>
                  <strong>
                    {presentations.length.toLocaleString('en-GB')}
                  </strong>
                </div>
              </article>

              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faEarthEurope}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>Countries</p>
                  <strong>
                    {countryCounts.size.toLocaleString('en-GB')}
                  </strong>
                </div>
              </article>

              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faUserGroup}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>Co-authorship</p>
                  <strong>
                    {coauthorshipPercentage.toFixed(1)}%
                  </strong>
                </div>
              </article>
            </section>

            <section className="conference-map-section">
              <div className="section-heading compact-heading">
                <div>
                  <p className="eyebrow">Geographic coverage</p>
                  <h2>Presentation map</h2>
                </div>
              </div>

              <AcademicWorldMap
                countries={mapCountries}
                ariaLabel="World map showing conference presentations by country from 2020 onwards"
                valueLabel="presentations"
                singularValueLabel="presentation"
                palette="conference"
              />
            </section>

            <section className="conference-overview-section">
              <div className="section-heading compact-heading">
                <div>
                  <p className="eyebrow">Presentation record</p>
                  <h2>Overview</h2>
                </div>
              </div>

              <ConferenceOverviewTable
                presentations={presentations}
              />
            </section>
          </>
        )}
      </div>
    </section>
  )
}
