import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type {
  ConferencePresentationType,
  PublicConferencePresentation,
} from '@/types/public'

const PRESENTATION_TYPES: ConferencePresentationType[] = [
  'Conference paper',
  'Keynote',
  'Workshop',
]

function nullableString(value: unknown) {
  return value == null ? null : String(value)
}

function requiredDate(
  value: unknown,
  fallback: unknown,
  field: 'start_date' | 'end_date'
) {
  const date = nullableString(value) ?? nullableString(fallback)

  if (!date) {
    throw new Error(
      `Public conference presentation is missing ${field}.`
    )
  }

  return date
}

function normalizePresentationType(
  value: unknown
): ConferencePresentationType {
  const presentationType = String(value ?? '').trim()

  if (
    PRESENTATION_TYPES.includes(
      presentationType as ConferencePresentationType
    )
  ) {
    return presentationType as ConferencePresentationType
  }

  throw new Error(
    `Unsupported conference presentation type: ${presentationType || 'empty'}`
  )
}

export function normalizeConferencePresentation(
  row: Record<string, unknown>
): PublicConferencePresentation {
  const legacyPresentationDate = nullableString(
    row.presentation_date
  )

  return {
    event_name: String(row.event_name ?? ''),
    event_short_name: String(row.event_short_name ?? ''),
    location: nullableString(row.location),
    start_date: requiredDate(
      row.start_date,
      legacyPresentationDate,
      'start_date'
    ),
    end_date: requiredDate(
      row.end_date,
      legacyPresentationDate,
      'end_date'
    ),
    presentation_date: legacyPresentationDate,
    presentation_title: nullableString(row.presentation_title),
    authors: Array.isArray(row.authors)
      ? row.authors.map((author) => String(author))
      : [],
    presentation_type: normalizePresentationType(
      row.presentation_type
    ),
    url: nullableString(row.url),
  }
}

export async function listPublicConferencePresentations(): Promise<
  PublicConferencePresentation[]
> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc(
    'list_public_conference_presentations'
  )

  if (error) {
    throw new Error('Could not load public conference presentations.')
  }

  return ((data ?? []) as Record<string, unknown>[]).map(
    normalizeConferencePresentation
  )
}
