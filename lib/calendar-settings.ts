import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicCalendarSettings } from '@/types/public'

export async function getPublicCalendarSettings(): Promise<PublicCalendarSettings> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc(
    'get_public_calendar_settings'
  )

  if (error) {
    throw new Error('Could not load public calendar settings.')
  }

  const row = Array.isArray(data) ? data[0] : data

  if (
    !row ||
    typeof row.catholic_calendar_active !== 'boolean' ||
    typeof row.stress_test_active !== 'boolean'
  ) {
    throw new Error('Invalid public calendar settings payload.')
  }

  return {
    catholic_calendar_active: row.catholic_calendar_active,
    stress_test_active: row.stress_test_active,
  }
}
