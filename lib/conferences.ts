import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicConferencePresentation } from '@/types/public'

function nullableString(value: unknown) {
  return value == null ? null : String(value)
}

export function normalizeConferencePresentation(
  row: Record<string, unknown>
): PublicConferencePresentation {
  return {
    event_name: String(row.event_name ?? ''),
    event_short_name: String(row.event_short_name ?? ''),
    location: nullableString(row.location),
    presentation_date: nullableString(row.presentation_date),
    presentation_title: nullableString(row.presentation_title),
    authors: Array.isArray(row.authors)
      ? row.authors.map((author) => String(author))
      : [],
    presentation_type: nullableString(row.presentation_type),
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
