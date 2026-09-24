import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicWorkAnalytics } from '@/types/public'

export async function getPublicWorkAnalytics(
  year: number
): Promise<PublicWorkAnalytics> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('get_public_work_analytics', {
    p_year: year,
  })

  if (error) {
    throw new Error(`Could not load public work analytics: ${error.message}`)
  }

  const payload = data as PublicWorkAnalytics | null

  if (!payload || !Array.isArray(payload.days)) {
    throw new Error('Public work analytics returned an unexpected payload.')
  }

  return payload
}
