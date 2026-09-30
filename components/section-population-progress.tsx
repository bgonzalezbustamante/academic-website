import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { CSSProperties } from 'react'

import {
  POPULATION_PERIODS,
  POPULATION_TARGETS,
  type PopulationDomain,
  populationPercentage,
  populationYears,
} from '@/lib/site-population'

type Props = {
  domain: PopulationDomain
  label: string
  value: number | null
  unit: string
  coveredYears?: Set<number> | null
}

export default function SectionPopulationProgress({
  domain,
  label,
  value,
  unit,
  coveredYears,
}: Props) {
  const available = value !== null
  const total = POPULATION_TARGETS[domain]
  const period = POPULATION_PERIODS[domain]
  const years = populationYears(domain)
  const progress = available
    ? populationPercentage(value, total)
    : 0

  return (
    <section
      className="section-population-progress"
      aria-label={`${label} population progress`}
    >
      <div className="section-population-heading">
        <span>Population progress</span>
        <strong>
          {available ? `${progress}%` : '—'}
        </strong>
      </div>

      <div
        className="section-population-track"
        role="progressbar"
        aria-label={`${label} approximate coverage`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={available ? progress : undefined}
      >
        <span
          className="section-population-fill"
          style={
            {
              '--section-population-progress': available
                ? `${progress}%`
                : '0%',
            } as CSSProperties
          }
        />
      </div>

      <div className="section-population-meta">
        <span>
          {available
            ? `${value} of ${total} ${unit} intended to ingest`
            : 'Public data temporarily unavailable'}
        </span>
        <span>
          {period.startYear}–{period.endYear}
        </span>
      </div>

      {coveredYears && (
        <div
          className="section-population-year-strip"
          style={{
            gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))`,
          }}
          aria-label={`Yearly coverage from ${period.startYear} to ${period.endYear}`}
        >
          {years.map((year) => (
            <span
              key={year}
              className={
                coveredYears.has(year)
                  ? 'section-population-year-cell section-population-year-cell-covered'
                  : 'section-population-year-cell'
              }
              aria-label={`${year}: ${coveredYears.has(year) ? 'covered' : 'not yet covered'}`}
            />
          ))}
        </div>
      )}

      <p className="section-population-note">
        <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
        <span>
          This is my new site, and I am still populating this section.
        </span>
      </p>
    </section>
  )
}
