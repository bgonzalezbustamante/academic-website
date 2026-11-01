'use client'

import { useState } from 'react'

import AcademicWorldMap, {
  type WorldMapCountry,
} from '@/components/academic-world-map'

const MAP_VIEWS = [
  { value: 'europe', label: 'Europe' },
  { value: 'america', label: 'America' },
  { value: 'world', label: 'World' },
] as const

type ConferenceMapView = (typeof MAP_VIEWS)[number]['value']

export default function ConferenceRegionMap({
  countries,
}: {
  countries: WorldMapCountry[]
}) {
  const [view, setView] = useState<ConferenceMapView>('europe')
  const selected = MAP_VIEWS.find((option) => option.value === view)!

  return (
    <div className="conference-region-map">
      <div className="conference-map-region-selector">
        <span className="conference-map-region-label">Map view</span>
        <div
          className="conference-map-region-controls"
          role="group"
          aria-label="Conference map view"
        >
          {MAP_VIEWS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={view === option.value}
              onClick={() => setView(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <AcademicWorldMap
        key={view}
        countries={countries}
        view={view}
        ariaLabel={`${selected.label} map showing conference presentations by country across all years`}
        valueLabel="presentations"
        singularValueLabel="presentation"
        palette="conference"
        noDataLabel="No presentations"
      />
    </div>
  )
}
