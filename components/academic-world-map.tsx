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

type Props = {
  countries: WorldMapCountry[]
  ariaLabel: string
  valueLabel: string
  compact?: boolean
  updatedAt?: string | null
}

type HoveredCountry = {
  label: string
  value: number | null
}

const WORLD_MAP = worldMap as unknown as GeographyData

const MAP_SHADES = [
  '#e8edf3',
  '#cfdae6',
  '#a9bfd3',
  '#7d9fbd',
  '#477598',
  '#002147',
]

function numericIdToIso3(value: string | number | undefined) {
  if (value === undefined) return undefined

  return isoCountries.numericToAlpha3(
    String(value).padStart(3, '0')
  )
}

function getFill(value: number, maximum: number) {
  if (value <= 0 || maximum <= 0) {
    return '#e7e9ec'
  }

  const scaled = Math.log1p(value) / Math.log1p(maximum)
  const index = Math.min(
    MAP_SHADES.length - 1,
    Math.max(
      0,
      Math.ceil(scaled * MAP_SHADES.length) - 1
    )
  )

  return MAP_SHADES[index]
}

function formatUpdated(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Europe/Amsterdam',
    timeZoneName: 'short',
  }).format(new Date(value))
}

export default function AcademicWorldMap({
  countries,
  ariaLabel,
  valueLabel,
  compact = false,
  updatedAt = null,
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
                        ? '#FE615A'
                        : getFill(
                            datum?.value ?? 0,
                            maximum
                          )
                    }
                    stroke="#ffffff"
                    strokeWidth={0.55}
                    tabIndex={datum ? 0 : -1}
                    aria-label={
                      datum
                        ? `${datum.label}: ${datum.value.toLocaleString('en-GB')} ${valueLabel}`
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
                    style={{
                      cursor: datum
                        ? 'default'
                        : 'default',
                      outline: 'none',
                    }}
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
                : `${hovered.value.toLocaleString('en-GB')} ${valueLabel}`}
            </span>
          </div>
        )}
      </div>

      <div className="world-map-footer">
        <div className="world-map-legend">
          <span>Fewer</span>
          <span className="world-map-shades" aria-hidden="true">
            {MAP_SHADES.map((shade) => (
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
