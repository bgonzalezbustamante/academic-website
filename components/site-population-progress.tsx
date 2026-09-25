import type { CSSProperties } from 'react'

import ExternalInlineLink from '@/components/external-inline-link'
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

const START_YEAR = 2012
const END_YEAR = 2026
const YEARS = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, index) => START_YEAR + index
)

function percentage(value: number, total: number) {
  if (total <= 0) return 0
  return Math.min(100, Math.round((value / total) * 100))
}

function yearsInRange(
  startYear: number | null,
  endYear: number | null
) {
  if (startYear == null && endYear == null) {
    return []
  }

  const start = Math.max(
    START_YEAR,
    startYear ?? endYear ?? START_YEAR
  )
  const end = Math.min(
    END_YEAR,
    endYear ?? startYear ?? END_YEAR
  )

  if (end < start) return []

  return Array.from(
    { length: end - start + 1 },
    (_, index) => start + index
  )
}

function publicationYears(papers: PublicPaper[]) {
  return new Set(
    papers
      .map((paper) =>
        paper.publication_date
          ? Number(paper.publication_date.slice(0, 4))
          : Number.NaN
      )
      .filter(
        (year) =>
          Number.isInteger(year) &&
          year >= START_YEAR &&
          year <= END_YEAR
      )
  )
}

function conferenceYears(
  presentations: PublicConferencePresentation[]
) {
  return new Set(
    presentations.flatMap((presentation) => {
      const startYear = Number(
        presentation.start_date.slice(0, 4)
      )
      const endYear = Number(
        presentation.end_date.slice(0, 4)
      )

      return yearsInRange(
        Number.isInteger(startYear) ? startYear : null,
        Number.isInteger(endYear) ? endYear : null
      )
    })
  )
}

function projectYears(projects: PublicProject[]) {
  return new Set(
    projects.flatMap((project) =>
      yearsInRange(project.start_year, project.end_year)
    )
  )
}

function teachingYears(teaching: PublicTeachingItem[]) {
  return new Set(
    teaching.flatMap((item) =>
      yearsInRange(
        item.start_year,
        item.is_current ? END_YEAR : item.end_year
      )
    )
  )
}

type Metric = {
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

      {metric.coveredYears && (
        <figure className="population-year-figure">
          <div
            className="population-year-strip"
            aria-label={`Yearly coverage from ${START_YEAR} to ${END_YEAR}`}
          >
            {YEARS.map((year) => (
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
          <figcaption>
            <span>{START_YEAR}</span>
            <span>{END_YEAR}</span>
          </figcaption>
        </figure>
      )}
    </div>
  )
}

export default function SitePopulationProgress({
  papers,
  projects,
  presentations,
  teaching,
}: Props) {
  const paperYears = papers ? publicationYears(papers) : null
  const projectCoverageYears = projects
    ? projectYears(projects)
    : null
  const presentationYears = presentations
    ? conferenceYears(presentations)
    : null
  const teachingCoverageYears = teaching
    ? teachingYears(teaching)
    : null
  const teachingTimes = teaching
    ? teaching.reduce(
        (total, item) => total + item.times_taught,
        0
      )
    : null

  const metrics: Metric[] = [
    {
      label: 'Publications',
      value: papers
        ? percentage(papers.length, 61)
        : null,
      detail: papers
        ? `${papers.length} of 61 publications (intended to ingest)`
        : '',
      coveredYears: paperYears ?? undefined,
    },
    {
      label: 'Projects',
      value: projects
        ? percentage(projects.length, 14)
        : null,
      detail: projects
        ? `${projects.length} of 14 projects (intended to ingest)`
        : '',
      coveredYears: projectCoverageYears ?? undefined,
    },
    {
      label: 'Conferences',
      value: presentations
        ? percentage(presentations.length, 137)
        : null,
      detail: presentations
        ? `${presentations.length} of 137 conferences (intended to ingest)`
        : '',
      coveredYears: presentationYears ?? undefined,
    },
    {
      label: 'Teaching/Supervision',
      value:
        teachingTimes !== null
          ? percentage(teachingTimes, 35)
          : null,
      detail:
        teachingTimes !== null
          ? `${teachingTimes} of 35 times taught (intended to ingest)`
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
        </div>
      </div>
    </section>
  )
}
