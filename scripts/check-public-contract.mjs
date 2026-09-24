import { createClient } from '@supabase/supabase-js'

const PUBLIC_PAPER_FIELDS = [
  'slug',
  'title',
  'authors',
  'abstract',
  'venue',
  'publication_date',
  'doi_url',
  'publication_url',
  'preprint_url',
  'github_url',
  'dataset_url',
  'featured',
  'publication_index',
]

function fail(message) {
  throw new Error(message)
}

function requireEnvironment() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const publishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

  if (!url || !publishableKey) {
    fail(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY in .env.local.'
    )
  }

  if (!publishableKey.startsWith('sb_publishable_')) {
    fail(
      'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be a Supabase publishable key.'
    )
  }

  return { url, publishableKey }
}

function assertPaperShape(paper) {
  for (const field of PUBLIC_PAPER_FIELDS) {
    if (!(field in paper)) {
      fail(`Public paper payload is missing field: ${field}`)
    }
  }

  if (!Array.isArray(paper.authors)) {
    fail('Public paper authors must be an array.')
  }
}

function assertAnalyticsShape(payload, year) {
  if (!payload || typeof payload !== 'object') {
    fail('Public work analytics returned no payload.')
  }

  if (payload.year !== year) {
    fail(
      `Public work analytics returned year ${payload.year}; expected ${year}.`
    )
  }

  if (!Array.isArray(payload.days)) {
    fail('Public work analytics days must be an array.')
  }

  for (const day of payload.days) {
    if (
      !day ||
      typeof day.date !== 'string' ||
      typeof day.net_minutes !== 'number'
    ) {
      fail('Public work analytics contains an invalid day entry.')
    }
  }

  if (
    typeof payload.average_net_minutes_per_working_day !== 'number' ||
    typeof payload.average_coffees_per_working_day !== 'number'
  ) {
    fail('Public work analytics summary fields must be numeric.')
  }
}

async function main() {
  const { url, publishableKey } = requireEnvironment()
  const supabase = createClient(url, publishableKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })

  const listResult = await supabase.rpc('list_public_papers')

  if (listResult.error) {
    fail(
      `list_public_papers() failed: ${listResult.error.message}`
    )
  }

  const papers = listResult.data ?? []

  if (!Array.isArray(papers)) {
    fail('list_public_papers() did not return an array.')
  }

  for (const paper of papers) {
    assertPaperShape(paper)
  }

  console.log(
    `✓ list_public_papers(): ${papers.length} public paper(s)`
  )

  if (papers.length > 0) {
    const firstSlug = papers[0]?.slug

    if (typeof firstSlug !== 'string' || !firstSlug) {
      fail('First public paper has no usable slug.')
    }

    const detailResult = await supabase.rpc('get_public_paper', {
      p_slug: firstSlug,
    })

    if (detailResult.error) {
      fail(
        `get_public_paper(text) failed: ${detailResult.error.message}`
      )
    }

    const detail = detailResult.data?.[0]

    if (!detail) {
      fail(
        'get_public_paper(text) returned no row for a listed public slug.'
      )
    }

    assertPaperShape(detail)
    console.log('✓ get_public_paper(text): listed slug resolved')
  } else {
    console.log(
      '✓ get_public_paper(text): skipped because zero public papers is a valid curated state'
    )
  }

  const configuredYear = Number.parseInt(
    process.env.PUBLIC_ANALYTICS_YEAR ?? '',
    10
  )
  const year = Number.isFinite(configuredYear)
    ? configuredYear
    : new Date().getUTCFullYear()

  const analyticsResult = await supabase.rpc(
    'get_public_work_analytics',
    { p_year: year }
  )

  if (analyticsResult.error) {
    fail(
      `get_public_work_analytics(year) failed: ${analyticsResult.error.message}`
    )
  }

  assertAnalyticsShape(analyticsResult.data, year)

  console.log(
    `✓ get_public_work_analytics(${year}): ${analyticsResult.data.days.length} calendar day(s)`
  )
  console.log('✓ Public Supabase contract validation passed.')
}

main().catch((error) => {
  console.error(
    error instanceof Error
      ? `✗ ${error.message}`
      : '✗ Public contract validation failed.'
  )
  process.exitCode = 1
})
