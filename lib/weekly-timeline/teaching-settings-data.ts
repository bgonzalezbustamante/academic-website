import type { PublicTeachingSettings } from '@/types/weekly-timeline'

const PUBLIC_TEACHING_SETTINGS_KEYS = ['teaching_season_active'] as const

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function parsePublicTeachingSettings(
  payload: unknown
): PublicTeachingSettings {
  if (!Array.isArray(payload)) {
    throw new Error('Public teaching settings returned an unexpected payload.')
  }

  if (payload.length !== 1) {
    throw new Error(
      'Public teaching settings must contain exactly one settings row.'
    )
  }

  const [entry] = payload

  if (!isRecord(entry)) {
    throw new Error('Public teaching settings row must be an object.')
  }

  const actualKeys = Object.keys(entry).sort()
  const expectedKeys = [...PUBLIC_TEACHING_SETTINGS_KEYS].sort()

  if (
    actualKeys.length !== expectedKeys.length ||
    actualKeys.some((key, index) => key !== expectedKeys[index])
  ) {
    throw new Error(
      'Public teaching settings row has an unexpected object shape.'
    )
  }

  if (typeof entry.teaching_season_active !== 'boolean') {
    throw new Error(
      'Public teaching settings teaching_season_active must be a boolean.'
    )
  }

  return {
    teaching_season_active: entry.teaching_season_active,
  }
}
