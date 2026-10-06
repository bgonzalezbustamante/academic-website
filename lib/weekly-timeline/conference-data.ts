import { assertValidIsoDate } from '@/lib/weekly-timeline/date-utils'
import type {
  ConferencePresentationType,
  PublicConferencePresentation,
} from '@/types/weekly-timeline'

const PUBLIC_CONFERENCE_TYPES = new Set<ConferencePresentationType>([
  'Conference paper',
  'Keynote',
  'Workshop',
])

const PUBLIC_CONFERENCE_KEYS = [
  'event_name',
  'event_short_name',
  'location',
  'presentation_date',
  'start_date',
  'end_date',
  'personal_attendance',
  'involves_trip',
  'presentation_title',
  'authors',
  'presentation_type',
  'url',
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

function assertNonEmptyString(value: unknown, label: string) {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string.`)
  }
}

function assertNullableString(value: unknown, label: string) {
  if (value !== null && typeof value !== 'string') {
    throw new Error(`${label} must be a string or null.`)
  }
}

function assertNullableHttpUrl(value: unknown, label: string) {
  assertNullableString(value, label)

  if (value === null) return
  if (typeof value !== 'string') {
    throw new Error(`${label} must be a valid HTTP(S) URL or null.`)
  }

  let parsed: URL

  try {
    parsed = new URL(value)
  } catch {
    throw new Error(`${label} must be a valid HTTP(S) URL or null.`)
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    throw new Error(`${label} must be a valid HTTP(S) URL or null.`)
  }
}

export function parsePublicConferencePresentations(
  payload: unknown
): PublicConferencePresentation[] {
  if (!Array.isArray(payload)) {
    throw new Error('Public conferences returned an unexpected payload.')
  }

  return payload.map((entry, index) => {
    const label = `Public conference item ${index + 1}`

    if (!isRecord(entry)) {
      throw new Error(`${label} must be an object.`)
    }

    assertExactKeys(entry, PUBLIC_CONFERENCE_KEYS, label)
    assertNonEmptyString(entry.event_name, `${label} event_name`)
    assertNonEmptyString(entry.event_short_name, `${label} event_short_name`)
    assertNullableString(entry.location, `${label} location`)
    assertValidIsoDate(entry.presentation_date, `${label} presentation_date`)
    assertValidIsoDate(entry.start_date, `${label} start_date`)
    assertValidIsoDate(entry.end_date, `${label} end_date`)

    if (entry.presentation_date !== entry.start_date) {
      throw new Error(
        `${label} presentation_date must equal start_date while the compatibility alias remains public.`
      )
    }

    if (entry.end_date < entry.start_date) {
      throw new Error(`${label} end_date must be on or after start_date.`)
    }

    if (typeof entry.personal_attendance !== 'boolean') {
      throw new Error(`${label} personal_attendance must be a boolean.`)
    }

    if (typeof entry.involves_trip !== 'boolean') {
      throw new Error(`${label} involves_trip must be a boolean.`)
    }

    if (entry.involves_trip && !entry.personal_attendance) {
      throw new Error(
        `${label} involves_trip requires personal_attendance to be true.`
      )
    }

    assertNullableString(entry.presentation_title, `${label} presentation_title`)

    if (
      !Array.isArray(entry.authors) ||
      entry.authors.some(
        (author) =>
          typeof author !== 'string' ||
          author.trim().length === 0
      )
    ) {
      throw new Error(
        `${label} authors must be an array of non-empty strings.`
      )
    }

    if (
      typeof entry.presentation_type !== 'string' ||
      !PUBLIC_CONFERENCE_TYPES.has(
        entry.presentation_type as ConferencePresentationType
      )
    ) {
      throw new Error(
        `${label} presentation_type must be Conference paper, Keynote or Workshop.`
      )
    }
    assertNullableHttpUrl(entry.url, `${label} url`)

    return entry as unknown as PublicConferencePresentation
  })
}
