import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type {
  PublicRepositoryVisibility,
  PublicSoftwareCategory,
  PublicSoftwareDevelopmentStage,
  PublicSoftwareItem,
  PublicSoftwareStatus,
} from '@/types/public'

const SOFTWARE_CATEGORIES = new Set<PublicSoftwareCategory>([
  'Application',
  'Website',
  'Utility',
  'Reusable component',
  'Package/library',
  'API/service',
  'Data product',
  'Template',
  'Other',
])

const SOFTWARE_STAGES = new Set<PublicSoftwareDevelopmentStage>([
  'Alpha',
  'Beta',
  'Release candidate',
  'Stable',
  'Maintenance',
])

const SOFTWARE_STATUSES = new Set<PublicSoftwareStatus>([
  'active',
  'paused',
  'completed',
  'archived',
])

const REPOSITORY_VISIBILITIES = new Set<PublicRepositoryVisibility>([
  'public',
  'private',
])

function nullableString(value: unknown) {
  return value == null ? null : String(value)
}

function nullableInteger(value: unknown) {
  if (value == null) return null
  const number = Number(value)
  return Number.isInteger(number) ? number : null
}

function controlledValue<T extends string>(
  value: unknown,
  allowed: Set<T>,
  field: string
): T {
  const candidate = String(value ?? '') as T
  if (!allowed.has(candidate)) {
    throw new Error(`Invalid public software ${field}.`)
  }
  return candidate
}

function normalizeSoftware(
  row: Record<string, unknown>
): PublicSoftwareItem {
  const repositoryVisibility = controlledValue(
    row.repository_visibility,
    REPOSITORY_VISIBILITIES,
    'repository_visibility'
  )

  return {
    slug: String(row.slug ?? ''),
    name: String(row.name ?? ''),
    short_description: String(row.short_description ?? ''),
    category: controlledValue(row.category, SOFTWARE_CATEGORIES, 'category'),
    current_version: nullableString(row.current_version),
    development_stage: controlledValue(
      row.development_stage,
      SOFTWARE_STAGES,
      'development_stage'
    ),
    status: controlledValue(row.status, SOFTWARE_STATUSES, 'status'),
    repository_visibility: repositoryVisibility,
    repository_url:
      repositoryVisibility === 'private'
        ? null
        : nullableString(row.repository_url),
    production_url: nullableString(row.production_url),
    documentation_url: nullableString(row.documentation_url),
    start_year: nullableInteger(row.start_year),
    end_year: nullableInteger(row.end_year),
    featured: row.featured === true,
  }
}

export async function listPublicSoftware(): Promise<PublicSoftwareItem[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('list_public_software')

  if (error) {
    throw new Error('Could not load public software.')
  }

  return ((data ?? []) as Record<string, unknown>[]).map(normalizeSoftware)
}
