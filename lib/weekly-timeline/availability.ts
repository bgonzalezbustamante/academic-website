import { parsePublicAvailability } from '@/lib/weekly-timeline/availability-data'
import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicAvailabilityItem } from '@/types/weekly-timeline'

export async function getPublicAvailability(
  year: number
): Promise<PublicAvailabilityItem[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('list_public_availability', {
    p_year: year,
  })

  if (error) {
    throw new Error(`Could not load public availability: ${error.message}`)
  }

  return parsePublicAvailability(data, year)
}
