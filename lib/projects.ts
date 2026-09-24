import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicProject } from '@/types/public'

function nullableString(value: unknown) {
  return value == null ? null : String(value)
}

function nullableYear(value: unknown) {
  if (value == null) return null

  const year = Number(value)
  return Number.isInteger(year) ? year : null
}

function normalizeProject(
  row: Record<string, unknown>
): PublicProject {
  return {
    slug: String(row.slug ?? ''),
    short_title: String(row.short_title ?? ''),
    title: String(row.title ?? ''),
    abstract: String(row.abstract ?? ''),
    funder: String(row.funder ?? ''),
    funder_note: nullableString(row.funder_note),
    url: nullableString(row.url),
    start_year: nullableYear(row.start_year),
    end_year: nullableYear(row.end_year),
    status: String(row.status ?? ''),
    featured: row.featured === true,
    project_image_filename:
      nullableString(row.project_image_filename),
    funder_image_filename:
      nullableString(row.funder_image_filename),
    publication_slugs: Array.isArray(row.publication_slugs)
      ? row.publication_slugs.map((slug) => String(slug))
      : [],
  }
}

export async function listPublicProjects(): Promise<PublicProject[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('list_public_projects')

  if (error) {
    throw new Error('Could not load public projects.')
  }

  return ((data ?? []) as Record<string, unknown>[]).map(
    normalizeProject
  )
}

export async function getPublicProject(
  slug: string
): Promise<PublicProject | null> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('get_public_project', {
    p_slug: slug,
  })

  if (error) {
    throw new Error('Could not load public project.')
  }

  const first = ((data ?? []) as Record<string, unknown>[])[0]
  return first ? normalizeProject(first) : null
}
