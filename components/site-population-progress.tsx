import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { CSSProperties } from 'react'

import ExternalInlineLink from '@/components/external-inline-link'
import {
  POPULATION_PERIODS,
  POPULATION_TARGETS,
  type PopulationDomain,
  conferencePopulationYears,
  populationPercentage,
  populationYears,
  projectPopulationYears,
  publicationPopulationYears,
  teachingPopulationYears,
} from '@/lib/site-population'
import type {
  PublicConferencePresentation,
  PublicPaper,
  PublicProject,
  PublicTeachingItem,
} from '@/types/public'

type Props = {
  papers: PublicPaper[] | null
  projects: PublicProject[] | null
  presentations: PublicConferencePresentation[] | null
  teaching: PublicTeachingItem[] | null
}

const READINESS_THRESHOLD = 55
const READINESS_WEIGHTS = {
  publications: 0.35,
  projects: 0.3,
  teaching: 0.2,
  conferences: 0.15,
} as const

const POPULATION_GRID_YEARS = Math.max(
  ...Object.values(POPULATION_PERIODS).map(
    ({ startYear, endYear }) => endYear - startYear + 1
  )
)

type Metric = {
  domain: PopulationDomain
  label: string
  value: number | null
  detail: string
  coveredYears?: Set<number>
}

function CoverageMetric({ metric }: { metric: Metric }) {
  const available = metric.value !== null
  const value = metric.value ?? 0

  return (
    <div className="population-metric">
      <div className="population-metric-heading">
        <h3>{metric.label}</h3>
        <strong>{available ? `${value}%` : '—'}</strong>
      </div>

      <div
        className="population-progress-track"
        role="progressbar"
        aria-label={`${metric.label} approximate coverage`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={available ? value : undefined}
      >
        <span
          className="population-progress-fill"
          style={
            {
              '--population-progress': available
                ? `${value}%`
                : '0%',
            } as CSSProperties
          }
        />
      </div>

      <p className="population-metric-detail">
        {available ? metric.detail : 'Public data temporarily unavailable'}
      </p>

      {metric.coveredYears && (() => {
        const period = POPULATION_PERIODS[metric.domain]
        const years = populationYears(metric.domain)
        const leadingYearSlots =
          POPULATION_GRID_YEARS - years.length
        const yearGridStyle = {
          gridTemplateColumns: `repeat(${POPULATION_GRID_YEARS}, minmax(0, 1fr))`,
        }

        return (
          <figure className="population-year-figure">
            <div
              className="population-year-strip"
              style={yearGridStyle}
              aria-label={`Yearly coverage from ${period.startYear} to ${period.endYear}`}
            >
              {leadingYearSlots > 0 && (
                <span
                  className="population-year-spacer"
                  style={{
                    gridColumn: `span ${leadingYearSlots}`,
                  }}
                  aria-hidden="true"
                />
              )}
              {years.map((year) => (
                <span
                  key={year}
                  className={
                    metric.coveredYears?.has(year)
                      ? 'population-year-cell population-year-cell-covered'
                      : 'population-year-cell'
                  }
                  aria-label={`${year}: ${metric.coveredYears?.has(year) ? 'covered' : 'not yet covered'}`}
                />
              ))}
            </div>
            <figcaption style={yearGridStyle}>
              <span
                style={{
                  gridColumn: leadingYearSlots + 1,
                }}
              >
                {period.startYear}
              </span>
              <span
                style={{
                  gridColumn: POPULATION_GRID_YEARS,
                  justifySelf: 'end',
                }}
              >
                {period.endYear}
              </span>
            </figcaption>
          </figure>
        )
      })()}
    </div>
  )
}

export default function SitePopulationProgress({
  papers,
  projects,
  presentations,
  teaching,
}: Props) {
  const paperYears = papers ? publicationPopulationYears(papers) : null
  const projectCoverageYears = projects
    ? projectPopulationYears(projects)
    : null
  const presentationYears = presentations
    ? conferencePopulationYears(presentations)
    : null
  const teachingCoverageYears = teaching
    ? teachingPopulationYears(teaching)
    : null
  const teachingTimes = teaching
    ? teaching.reduce(
        (total, item) => total + item.times_taught,
        0
      )
    : null

  const readinessAvailable =
    papers !== null &&
    projects !== null &&
    presentations !== null &&
    teachingTimes !== null

  const siteReadiness = readinessAvailable
    ? Math.round(
        100 *
          (Math.min(1, papers.length / POPULATION_TARGETS.publications) *
            READINESS_WEIGHTS.publications +
            Math.min(1, projects.length / POPULATION_TARGETS.projects) *
              READINESS_WEIGHTS.projects +
            Math.min(1, teachingTimes / POPULATION_TARGETS.teaching) *
              READINESS_WEIGHTS.teaching +
            Math.min(1, presentations.length / POPULATION_TARGETS.conferences) *
              READINESS_WEIGHTS.conferences)
      )
    : null

  const metrics: Metric[] = [
    {
      domain: 'publications',
      label: 'Publications',
      value: papers
        ? populationPercentage(papers.length, POPULATION_TARGETS.publications)
        : null,
      detail: papers
        ? `${papers.length} of ${POPULATION_TARGETS.publications} publications (intended to ingest)`
        : '',
      coveredYears: paperYears ?? undefined,
    },
    {
      domain: 'projects',
      label: 'Projects',
      value: projects
        ? populationPercentage(projects.length, POPULATION_TARGETS.projects)
        : null,
      detail: projects
        ? `${projects.length} of ${POPULATION_TARGETS.projects} projects (intended to ingest)`
        : '',
      coveredYears: projectCoverageYears ?? undefined,
    },
    {
      domain: 'conferences',
      label: 'Conferences',
      value: presentations
        ? populationPercentage(presentations.length, POPULATION_TARGETS.conferences)
        : null,
      detail: presentations
        ? `${presentations.length} of ${POPULATION_TARGETS.conferences} conferences (intended to ingest)`
        : '',
      coveredYears: presentationYears ?? undefined,
    },
    {
      domain: 'teaching',
      label: 'Teaching/Supervision',
      value:
        teachingTimes !== null
          ? populationPercentage(teachingTimes, POPULATION_TARGETS.teaching)
          : null,
      detail:
        teachingTimes !== null
          ? `${teachingTimes} of ${POPULATION_TARGETS.teaching} times taught (intended to ingest)`
          : '',
      coveredYears: teachingCoverageYears ?? undefined,
    },
  ]

  return (
    <section
      className="population-progress-section"
      aria-labelledby="population-progress-title"
    >
      <div className="site-shell">
        <div className="population-progress-card">
          <div className="population-progress-intro">
            <div>
              <p className="eyebrow">New website</p>
              <h2 id="population-progress-title">
                Population in progress
              </h2>
            </div>
            <p>
              This new site is connected to my{' '}
              <ExternalInlineLink href="https://github.com/bgonzalezbustamante/research-dashboard">
                Research Dashboard
              </ExternalInlineLink>
              . I am progressively populating the public record, so these
              indicators provide an approximate snapshot of current coverage.
            </p>
          </div>

          <div className="population-metrics-grid">
            {metrics.map((metric) => (
              <CoverageMetric
                key={metric.label}
                metric={metric}
              />
            ))}
          </div>

          <div className="population-readiness">
            <div className="population-readiness-heading">
              <h3>Site population readiness</h3>
              <strong>
                {siteReadiness !== null ? `${siteReadiness}%` : '—'}
              </strong>
            </div>

            <div
              className="population-readiness-track"
              role="progressbar"
              aria-label="Weighted site population readiness"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={siteReadiness ?? undefined}
            >
              <span
                className="population-readiness-fill"
                style={
                  {
                    '--population-readiness':
                      siteReadiness !== null
                        ? `${siteReadiness}%`
                        : '0%',
                  } as CSSProperties
                }
              />
              <span
                className="population-readiness-marker"
                style={
                  {
                    '--population-readiness-threshold':
                      `${READINESS_THRESHOLD}%`,
                  } as CSSProperties
                }
                aria-hidden="true"
              />
            </div>

            <div
              className="population-readiness-scale"
              style={
                {
                  '--population-readiness-threshold':
                    `${READINESS_THRESHOLD}%`,
                } as CSSProperties
              }
            >
              <span>{READINESS_THRESHOLD}% launch threshold</span>
            </div>

            <p className="population-readiness-note">
              <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
              <span>
                Weighted indicator: categories contribute differently to the
                overall readiness score.
              </span>
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
