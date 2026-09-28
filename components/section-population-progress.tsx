import type { CSSProperties } from 'react'

import {
  POPULATION_END_YEAR,
  POPULATION_START_YEAR,
  POPULATION_YEARS,
  populationPercentage,
} from '@/lib/site-population'

type Props = {
  label: string
  value: number | null
  total: number
  unit: string
  coveredYears?: Set<number> | null
}

export default function SectionPopulationProgress({
  label,
  value,
  total,
  unit,
  coveredYears,
}: Props) {
  const available = value !== null
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
          {POPULATION_START_YEAR}–{POPULATION_END_YEAR}
        </span>
      </div>

      {coveredYears && (
        <div
          className="section-population-year-strip"
          aria-label={`Yearly coverage from ${POPULATION_START_YEAR} to ${POPULATION_END_YEAR}`}
        >
          {POPULATION_YEARS.map((year) => (
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
    </section>
  )
}
