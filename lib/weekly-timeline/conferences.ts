import { parsePublicConferencePresentations } from '@/lib/weekly-timeline/conference-data'
import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicConferencePresentation } from '@/types/weekly-timeline'

export async function getPublicConferencePresentations(): Promise<
  PublicConferencePresentation[]
> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc(
    'list_public_conference_presentations'
  )

  if (error) {
    throw new Error(`Could not load public conferences: ${error.message}`)
  }

  return parsePublicConferencePresentations(data)
}
