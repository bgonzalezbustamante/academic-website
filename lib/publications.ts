import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type { PublicPaper } from '@/types/public'

function normalizePaper(row: Record<string, unknown>): PublicPaper {
  return {
    slug: String(row.slug ?? ''),
    title: String(row.title ?? ''),
    authors: Array.isArray(row.authors)
      ? row.authors.map((author) => String(author))
      : [],
    abstract: row.abstract == null ? null : String(row.abstract),
    venue: row.venue == null ? null : String(row.venue),
    publication_date:
      row.publication_date == null ? null : String(row.publication_date),
    doi_url: row.doi_url == null ? null : String(row.doi_url),
    publication_url:
      row.publication_url == null ? null : String(row.publication_url),
    preprint_url:
      row.preprint_url == null ? null : String(row.preprint_url),
    github_url: row.github_url == null ? null : String(row.github_url),
    dataset_url: row.dataset_url == null ? null : String(row.dataset_url),
    featured: row.featured === true,
    publication_index:
      row.publication_index == null ? null : String(row.publication_index),
  }
}

export async function listPublicPapers(): Promise<PublicPaper[]> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('list_public_papers')

  if (error) {
    throw new Error(`Could not load public papers: ${error.message}`)
  }

  return ((data ?? []) as Record<string, unknown>[]).map(normalizePaper)
}

export async function getPublicPaper(slug: string): Promise<PublicPaper | null> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc('get_public_paper', {
    p_slug: slug,
  })

  if (error) {
    throw new Error(`Could not load public paper: ${error.message}`)
  }

  const first = ((data ?? []) as Record<string, unknown>[])[0]
  return first ? normalizePaper(first) : null
}
