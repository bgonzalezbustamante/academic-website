import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type {
  PublicPaper,
  PublicPaperDetail,
} from '@/types/public'

function nullableString(value: unknown) {
  return value == null ? null : String(value)
}

function normalizePaper(row: Record<string, unknown>): PublicPaper {
  return {
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    authors: Array.isArray(row.authors)
      ? row.authors.map((author) => String(author))
      : [],
    abstract: nullableString(row.abstract),
    venue: nullableString(row.venue),
    publication_date: nullableString(row.publication_date),
    doi_url: nullableString(row.doi_url),
    publication_url: nullableString(row.publication_url),
    preprint_url: nullableString(row.preprint_url),
    github_url: nullableString(row.github_url),
    dataset_url: nullableString(row.dataset_url),
    project_url: nullableString(row.project_url),
    si_file_url: nullableString(row.si_file_url),
    featured: row.featured === true,
    publication_index: nullableString(row.publication_index),
    language: nullableString(row.language),
  }
}

function normalizePaperDetail(
  row: Record<string, unknown>
): PublicPaperDetail {
  return {
    ...normalizePaper(row),
    citation: nullableString(row.citation),
    highlight_text: nullableString(row.highlight_text),
    highlight_image_filename:
      nullableString(row.highlight_image_filename),
    highlight_image_alt:
      nullableString(row.highlight_image_alt),
    highlight_image_caption:
      nullableString(row.highlight_image_caption),
  }
}

export async function listPublicPapers(): Promise<PublicPaper[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('list_public_papers')

  if (error) {
    throw new Error('Could not load public papers.')
  }

  return ((data ?? []) as Record<string, unknown>[]).map(normalizePaper)
}

export async function getPublicPaper(
  slug: string
): Promise<PublicPaperDetail | null> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('get_public_paper', {
    p_slug: slug,
  })

  if (error) {
    throw new Error('Could not load public paper.')
  }

  const first = ((data ?? []) as Record<string, unknown>[])[0]
  return first ? normalizePaperDetail(first) : null
}
