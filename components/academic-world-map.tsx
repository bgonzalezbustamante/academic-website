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

type Props = {
  countries: WorldMapCountry[]
  ariaLabel: string
  valueLabel: string
  singularValueLabel?: string
  compact?: boolean
  updatedAt?: string | null
  palette?: MapPalette
}

type HoveredCountry = {
  label: string
  value: number | null
}

const WORLD_MAP = worldMap as unknown as GeographyData

const MAP_PALETTES: Record<
  MapPalette,
  { shades: string[]; empty: string; hover: string }
> = {
  tergap: {
    shades: [
      '#d5e1ed',
      '#afc2d4',
      '#809db9',
      '#557b9c',
      '#315a7d',
      '#002147',
    ],
    empty: '#f4f0e9',
    hover: '#00AAB4',
  },
  conference: {
    shades: [
      '#d9f3f5',
      '#9fdee2',
      '#55c5cc',
      '#00AAB4',
      '#456d91',
      '#002147',
    ],
    empty: '#f6eee9',
    hover: '#FE615A',
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
      <div className="world-map-frame">
        <ComposableMap
          projection="geoEqualEarth"
          projectionConfig={{ scale: 150 }}
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
                    stroke="#ffffff"
                    strokeWidth={0.6}
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
                    style={{ outline: 'none' }}
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
                ? 'No records'
                : formatValue(hovered.value)}
            </span>
          </div>
        )}
      </div>

      <div className="world-map-footer">
        <div className="world-map-legend">
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
