import { assertValidIsoDate } from '@/lib/weekly-timeline/date-utils'
import type {
  PublicWorkAnalytics,
  PublicWorkDay,
} from '@/types/weekly-timeline'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function assertNonNegativeFiniteNumber(
  value: unknown,
  label: string
): asserts value is number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0
  ) {
    throw new Error(`${label} must be a non-negative finite number.`)
  }
}

function assertNonNegativeInteger(
  value: unknown,
  label: string
): asserts value is number {
  assertNonNegativeFiniteNumber(value, label)

  if (!Number.isInteger(value)) {
    throw new Error(`${label} must be an integer.`)
  }
}

function daysInYear(year: number) {
  return new Date(Date.UTC(year + 1, 0, 1)).getTime() -
    new Date(Date.UTC(year, 0, 1)).getTime()
}

export function assertValidPublicWorkDays(
  value: unknown,
  {
    expectedYear,
    requireCompleteYear = false,
  }: {
    expectedYear?: number
    requireCompleteYear?: boolean
  } = {}
): asserts value is PublicWorkDay[] {
  if (!Array.isArray(value)) {
    throw new Error('Public work analytics days must be an array.')
  }

  const seen = new Set<string>()

  value.forEach((entry, index) => {
    if (!isRecord(entry)) {
      throw new Error(`Public work analytics day ${index + 1} must be an object.`)
    }

    assertValidIsoDate(
      entry.date,
      `Public work analytics day ${index + 1} date`
    )

    if (
      expectedYear !== undefined &&
      Number(entry.date.slice(0, 4)) !== expectedYear
    ) {
      throw new Error(
        `Public work analytics day ${entry.date} falls outside ${expectedYear}.`
      )
    }

    if (seen.has(entry.date)) {
      throw new Error(
        `Public work analytics contains duplicate date ${entry.date}.`
      )
    }
    seen.add(entry.date)

    assertNonNegativeInteger(
      entry.net_minutes,
      `Public work analytics net_minutes for ${entry.date}`
    )
    assertNonNegativeInteger(
      entry.coffee_count,
      `Public work analytics coffee_count for ${entry.date}`
    )
  })

  if (requireCompleteYear) {
    if (expectedYear === undefined) {
      throw new Error(
        'A complete-year work-data check requires an expected year.'
      )
    }

    const expectedDays =
      daysInYear(expectedYear) / (24 * 60 * 60 * 1000)

    if (value.length !== expectedDays) {
      throw new Error(
        `Public work analytics for ${expectedYear} must contain ${expectedDays} unique calendar days.`
      )
    }
  }
}

export function parsePublicWorkAnalytics(
  payload: unknown,
  expectedYear: number
): PublicWorkAnalytics {
  if (!Number.isInteger(expectedYear) || expectedYear < 2000) {
    throw new Error('Public work analytics year must be an integer from 2000 onwards.')
  }

  if (!isRecord(payload)) {
    throw new Error('Public work analytics returned an unexpected payload.')
  }

  if (payload.year !== expectedYear) {
    throw new Error(
      `Public work analytics returned year ${String(payload.year)} instead of ${expectedYear}.`
    )
  }

  assertNonNegativeInteger(
    payload.average_net_minutes_per_working_day,
    'Public work analytics average_net_minutes_per_working_day'
  )
  assertNonNegativeFiniteNumber(
    payload.average_coffees_per_working_day,
    'Public work analytics average_coffees_per_working_day'
  )
  assertValidPublicWorkDays(payload.days, {
    expectedYear,
    requireCompleteYear: true,
  })

  return {
    year: expectedYear,
    average_net_minutes_per_working_day:
      payload.average_net_minutes_per_working_day,
    average_coffees_per_working_day:
      payload.average_coffees_per_working_day,
    days: payload.days,
  }
}
