'use client'

import * as isoCountries from 'i18n-iso-countries'
import { useMemo, useState } from 'react'
import type { ComponentProps } from 'react'
import {
  ComposableMap,
  Geographies,
  Geography,
} from 'react-simple-maps'
import worldMap from 'world-atlas/countries-110m.json'

type GeographyData = ComponentProps<typeof Geographies>['geography']

export type WorldMapCountry = {
  iso3: string
  label: string
  value: number
}

type MapPalette = 'tergap' | 'conference'
type MapView = 'world' | 'africa'

type Props = {
  countries: WorldMapCountry[]
  ariaLabel: string
  valueLabel: string
  singularValueLabel?: string
  compact?: boolean
  updatedAt?: string | null
  palette?: MapPalette
  view?: MapView
  noDataLabel?: string
}

type HoveredCountry = {
  label: string
  value: number | null
}

const WORLD_MAP = worldMap as unknown as GeographyData

// Matches the latest TERGAP Dashboard Equal Earth viewport.
const AFRICA_CENTRE: [number, number] = [15, 5]

const MAP_PALETTES: Record<
  MapPalette,
  {
    shades: string[]
    empty: string
    hover: string
    background: string
    border: string
  }
> = {
  tergap: {
    shades: [
      '#e7eaf4',
      '#c5cbe0',
      '#9da7c8',
      '#707fab',
      '#3d5284',
      '#001158',
    ],
    empty: '#e8eaed',
    hover: '#007679',
    background: '#eef0f7',
    border: '#ffffff',
  },
  conference: {
    shades: [
      '#bfecef',
      '#79d5db',
      '#00AAB4',
      '#397d9c',
      '#31556f',
      '#002147',
    ],
    empty: '#e8eaed',
    hover: '#FE615A',
    background: '#eef0f7',
    border: '#ffffff',
  },
}

function numericIdToIso3(value: string | number | undefined) {
  if (value === undefined) return undefined

  return isoCountries.numericToAlpha3(
    String(value).padStart(3, '0')
  )
}

function getFill(
  value: number,
  maximum: number,
  shades: string[],
  empty: string
) {
  if (value <= 0 || maximum <= 0) {
    return empty
  }

  if (maximum === 1) {
    return shades[Math.floor(shades.length / 2)]
  }

  const scaled = Math.log1p(value) / Math.log1p(maximum)
  const index = Math.min(
    shades.length - 1,
    Math.max(
      0,
      Math.ceil(scaled * shades.length) - 1
    )
  )

  return shades[index]
}

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Amsterdam',
    timeZoneName: 'short',
  }).format(new Date(value))
}

export default function AcademicWorldMap({
  countries,
  ariaLabel,
  valueLabel,
  singularValueLabel,
  compact = false,
  updatedAt = null,
  palette = 'tergap',
  view = 'world',
  noDataLabel = 'Not collected',
}: Props) {
  const byIso3 = useMemo(
    () =>
      new Map(
        countries.map((country) => [
          country.iso3,
          country,
        ])
      ),
    [countries]
  )

  const maximum = Math.max(
    ...countries.map((country) => country.value),
    1
  )

  const [hovered, setHovered] =
    useState<HoveredCountry | null>(null)

  const mapPalette = MAP_PALETTES[palette]

  function formatValue(value: number) {
    const label =
      value === 1 && singularValueLabel
        ? singularValueLabel
        : valueLabel

    return `${value.toLocaleString('en-GB')} ${label}`
  }

  return (
    <div
      className={
        compact
          ? 'academic-world-map compact-world-map'
          : 'academic-world-map'
      }
    >
      <div
        className="world-map-frame"
        style={{ backgroundColor: mapPalette.background }}
      >
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={
            view === 'africa'
              ? { center: AFRICA_CENTRE, scale: 245 }
              : { scale: 150 }
          }
          width={800}
          height={430}
          aria-label={ariaLabel}
        >
          <Geographies geography={WORLD_MAP}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const iso3 = numericIdToIso3(geo.id)
                const datum = iso3
                  ? byIso3.get(iso3)
                  : undefined
                const geographyName =
                  typeof geo.properties?.name === 'string'
                    ? geo.properties.name
                    : iso3 ?? 'Unknown country'

                const hoverValue: HoveredCountry = {
                  label: datum?.label ?? geographyName,
                  value: datum?.value ?? null,
                }

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={
                      hovered?.label === hoverValue.label &&
                      datum
                        ? mapPalette.hover
                        : getFill(
                            datum?.value ?? 0,
                            maximum,
                            mapPalette.shades,
                            mapPalette.empty
                          )
                    }
                    stroke={mapPalette.border}
                    strokeWidth={0.55}
                    tabIndex={datum && !compact ? 0 : -1}
                    aria-label={
                      datum && !compact
                        ? `${datum.label}: ${formatValue(datum.value)}`
                        : undefined
                    }
                    onMouseEnter={() =>
                      setHovered(hoverValue)
                    }
                    onMouseLeave={() =>
                      setHovered(null)
                    }
                    onFocus={() =>
                      setHovered(hoverValue)
                    }
                    onBlur={() => setHovered(null)}
                  />
                )
              })
            }
          </Geographies>
        </ComposableMap>

        {hovered && (
          <div className="world-map-tooltip">
            <strong>{hovered.label}</strong>
            <span>
              {hovered.value == null
                ? noDataLabel
                : formatValue(hovered.value)}
            </span>
          </div>
        )}
      </div>

      <div className="world-map-footer">
        <div className="world-map-legend">
          <span className="world-map-gradient-key">
            <span>Fewer</span>
            <span className="world-map-shades" aria-hidden="true">
              {mapPalette.shades.map((shade) => (
                <span
                  key={shade}
                  style={{ backgroundColor: shade }}
                />
              ))}
            </span>
            <span>More</span>
          </span>

          <span className="world-map-no-data-key">
            <span
              className="world-map-no-data-swatch"
              style={{ backgroundColor: mapPalette.empty }}
              aria-hidden="true"
            />
            {noDataLabel}
          </span>
        </div>

        {updatedAt && (
          <span className="world-map-updated">
            Updated {formatUpdated(updatedAt)}
          </span>
        )}
      </div>
    </div>
  )
}
