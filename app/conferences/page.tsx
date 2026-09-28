import {
  faEarthEurope,
  faMicrophoneLines,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'

import AcademicWorldMap, {
  type WorldMapCountry,
} from '@/components/academic-world-map'
import ConferenceOverviewTable from '@/components/conference-overview-table'
import PresentationRoadmap from '@/components/presentation-roadmap'
import SectionPopulationProgress from '@/components/section-population-progress'
import { firstAuthorPercentage } from '@/lib/authorship'
import { listPublicConferencePresentations } from '@/lib/conferences'
import {
  POPULATION_TARGETS,
  conferencePopulationYears,
} from '@/lib/site-population'
import {
  countryNameToIso3,
  extractCountryFromLocation,
} from '@/lib/geography'
import type { PublicConferencePresentation } from '@/types/public'

export const metadata: Metadata = {
  title: 'Conferences',
  description:
    'Conference and public presentations by Bastián González-Bustamante and collaborators.',
  alternates: {
    canonical: '/conferences',
  },
}

export const revalidate = 300

function getCurrentAmsterdamDateParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const value = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return {
    year: Number(value.year),
    date: `${value.year}-${value.month}-${value.day}`,
  }
}

export default async function ConferencesPage() {
  let presentations: PublicConferencePresentation[] = []
  let available = true

  try {
    presentations =
      await listPublicConferencePresentations()
  } catch {
    available = false
  }

  const countryCounts = new Map<
    string,
    { label: string; value: number }
  >()
  let virtualPresentationCount = 0

  for (const presentation of presentations) {
    const location = presentation.location?.trim()

    if (location?.toLowerCase() === 'virtual') {
      virtualPresentationCount += 1
      continue
    }

    const country = extractCountryFromLocation(location ?? null)

    if (!country) continue

    const iso3 = countryNameToIso3(country)

    if (!iso3) continue

    const current = countryCounts.get(iso3)

    countryCounts.set(iso3, {
      label: current?.label ?? country,
      value: (current?.value ?? 0) + 1,
    })
  }

  const mapCountries: WorldMapCountry[] = Array.from(
    countryCounts.entries()
  ).map(([iso3, { label, value }]) => ({
    iso3,
    label,
    value,
  }))

  const firstAuthorShare = firstAuthorPercentage(presentations)

  const currentAmsterdam = getCurrentAmsterdamDateParts()

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

        <SectionPopulationProgress
          label="Conferences"
          value={available ? presentations.length : null}
          total={POPULATION_TARGETS.conferences}
          unit="conferences"
          coveredYears={
            available
              ? conferencePopulationYears(presentations)
              : null
          }
        />

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
            <section
              className="conference-stats-grid"
              aria-label="Conference summary"
            >
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
                  {virtualPresentationCount > 0 && (
                    <span className="conference-stat-note">
                      {virtualPresentationCount.toLocaleString('en-GB')}{' '}
                      virtual {virtualPresentationCount === 1
                        ? 'conference/workshop'
                        : 'conferences/workshops'}
                    </span>
                  )}
                </div>
              </article>

              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faUserPen}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>First author</p>
                  <strong>
                    {firstAuthorShare.toFixed(1)}%
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
                ariaLabel="World map showing conference presentations by country across all years"
                valueLabel="presentations"
                singularValueLabel="presentation"
                palette="conference"
                noDataLabel="No presentations"
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

            <PresentationRoadmap
              presentations={presentations}
              year={currentAmsterdam.year}
              currentDate={currentAmsterdam.date}
              embedded
            />
          </>
        )}
      </div>
    </section>
  )
}
