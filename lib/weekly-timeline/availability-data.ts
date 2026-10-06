import { assertValidIsoDate } from '@/lib/weekly-timeline/date-utils'
import type {
  PublicAvailabilityItem,
  PublicAvailabilityType,
} from '@/types/weekly-timeline'

const PUBLIC_AVAILABILITY_TYPES = new Set<PublicAvailabilityType>([
  'winter_holiday',
  'summer_holiday',
  'trip',
  'unavailable',
])

const PUBLIC_AVAILABILITY_KEYS = [
  'type',
  'start_date',
  'end_date',
  'label',
] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertExactKeys(
  value: Record<string, unknown>,
  expected: readonly string[],
  label: string
) {
  const actual = Object.keys(value).sort()
  const wanted = [...expected].sort()

  if (
    actual.length !== wanted.length ||
    actual.some((key, index) => key !== wanted[index])
  ) {
    throw new Error(
      `${label} has an unexpected object shape; expected keys [${wanted.join(', ')}].`
    )
  }
}

function assertAvailabilityYear(expectedYear: number) {
  const currentYear = new Date().getUTCFullYear()

  if (
    !Number.isInteger(expectedYear) ||
    expectedYear < 2000 ||
    expectedYear > currentYear + 5
  ) {
    throw new Error(
      `Public availability year must be an integer from 2000 through ${currentYear + 5}.`
    )
  }
}

export function parsePublicAvailability(
  payload: unknown,
  expectedYear: number
): PublicAvailabilityItem[] {
  assertAvailabilityYear(expectedYear)

  if (!Array.isArray(payload)) {
    throw new Error('Public availability returned an unexpected payload.')
  }

  const seenProjections = new Set<string>()

  return payload.map((entry, index) => {
    const label = `Public availability item ${index + 1}`

    if (!isRecord(entry)) {
      throw new Error(`${label} must be an object.`)
    }

    assertExactKeys(entry, PUBLIC_AVAILABILITY_KEYS, label)

    if (
      typeof entry.type !== 'string' ||
      !PUBLIC_AVAILABILITY_TYPES.has(entry.type as PublicAvailabilityType)
    ) {
      throw new Error(`${label} has an unsupported type.`)
    }

    assertValidIsoDate(entry.start_date, `${label} start_date`)
    assertValidIsoDate(entry.end_date, `${label} end_date`)

    if (
      Number(entry.start_date.slice(0, 4)) !== expectedYear ||
      Number(entry.end_date.slice(0, 4)) !== expectedYear
    ) {
      throw new Error(`${label} falls outside requested year ${expectedYear}.`)
    }

    if (entry.end_date < entry.start_date) {
      throw new Error(`${label} end_date must be on or after start_date.`)
    }

    if (typeof entry.label !== 'string' || entry.label.trim().length === 0) {
      throw new Error(`${label} label must be a non-empty string.`)
    }

    if (entry.type === 'unavailable' && entry.label !== 'Unavailable') {
      throw new Error(
        `${label} label must be "Unavailable" for unavailable ranges.`
      )
    }

    const projectionKey = [
      entry.type,
      entry.start_date,
      entry.end_date,
      entry.label,
    ].join('|')

    if (seenProjections.has(projectionKey)) {
      throw new Error(
        `Public availability contains duplicate range ${projectionKey}.`
      )
    }

    seenProjections.add(projectionKey)

    return entry as unknown as PublicAvailabilityItem
  })
}
