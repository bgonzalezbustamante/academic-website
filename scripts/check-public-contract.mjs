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
  'project_url',
  'si_file_url',
  'featured',
  'publication_index',
  'language',
  'google_scholar_citations',
  'google_scholar_citations_captured_on',
]

const PUBLIC_PAPER_LANGUAGES = new Set([
  'English',
  'Spanish',
  'Portuguese',
  'Dutch',
  'German',
  'French',
  'Italian',
])

const PAPER_DETAIL_ONLY_FIELDS = [
  'citation',
  'highlight_text',
  'highlight_image_filename',
  'highlight_image_alt',
  'highlight_image_caption',
]

const PUBLIC_PROJECT_FIELDS = [
  'slug',
  'short_title',
  'title',
  'abstract',
  'funder',
  'funder_note',
  'url',
  'start_year',
  'end_year',
  'status',
  'featured',
  'project_image_filename',
  'funder_image_filename',
  'publication_slugs',
  'conference_presentations',
]

const PUBLIC_TEACHING_FIELDS = [
  'slug',
  'name',
  'institution',
  'summary',
  'start_year',
  'end_year',
  'is_current',
  'levels',
  'times_taught',
  'student_count',
  'course_image_filename',
]

const PUBLIC_CONFERENCE_FIELDS = [
  'event_name',
  'event_short_name',
  'location',
  'start_date',
  'end_date',
  'presentation_title',
  'authors',
  'presentation_type',
  'url',
]

const PUBLIC_CONFERENCE_TYPES = new Set([
  'Conference paper',
  'Keynote',
  'Workshop',
])

const PRIVATE_FIELDS = [
  'id',
  'owner_id',
  'paper_id',
  'paper_ids',
  'notes',
  'activity_label_id',
  'activity_label_ids',
  'work_session_id',
  'tracked_minutes',
  'tracked_hours',
  'session_count',
  'teaching_id',
  'citation_snapshot_id',
  'citation_snapshot_ids',
  'citation_source',
  'citation_history',
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

function assertFields(record, fields, contract) {
  for (const field of fields) {
    if (!(field in record)) {
      fail(`${contract} payload is missing field: ${field}`)
    }
  }
}

function assertPrivateFieldsAbsent(record, contract) {
  for (const field of PRIVATE_FIELDS) {
    if (field in record) {
      fail(`${contract} unexpectedly exposes private field: ${field}`)
    }
  }
}

function assertPaperShape(paper, { detail = false } = {}) {
  assertFields(paper, PUBLIC_PAPER_FIELDS, 'Public paper')
  assertPrivateFieldsAbsent(paper, 'Public paper')

  if (!Array.isArray(paper.authors)) {
    fail('Public paper authors must be an array.')
  }

  if (
    paper.language != null &&
    !PUBLIC_PAPER_LANGUAGES.has(paper.language)
  ) {
    fail(
      'Public paper language must be null or one of English, Spanish, Portuguese, Dutch, German, French, or Italian.'
    )
  }
  if (
    paper.google_scholar_citations != null &&
    (
      !Number.isInteger(paper.google_scholar_citations) ||
      paper.google_scholar_citations < 0
    )
  ) {
    fail(
      'Public paper google_scholar_citations must be a non-negative integer or null.'
    )
  }

  if (
    paper.google_scholar_citations_captured_on != null &&
    (
      typeof paper.google_scholar_citations_captured_on !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(
        paper.google_scholar_citations_captured_on
      )
    )
  ) {
    fail(
      'Public paper google_scholar_citations_captured_on must be a YYYY-MM-DD date string or null.'
    )
  }

  if (
    (paper.google_scholar_citations == null) !==
    (paper.google_scholar_citations_captured_on == null)
  ) {
    fail(
      'Public paper Google Scholar citation count and capture date must either both be present or both be null.'
    )
  }


  if (detail) {
    assertFields(
      paper,
      PAPER_DETAIL_ONLY_FIELDS,
      'Public paper detail'
    )
  } else {
    for (const field of PAPER_DETAIL_ONLY_FIELDS) {
      if (field in paper) {
        fail(
          `list_public_papers() unexpectedly exposes detail-only field: ${field}`
        )
      }
    }
  }
}

function assertProjectShape(project) {
  assertFields(project, PUBLIC_PROJECT_FIELDS, 'Public project')
  assertPrivateFieldsAbsent(project, 'Public project')

  if (!Array.isArray(project.publication_slugs)) {
    fail('Public project publication_slugs must be an array.')
  }

  if (!Array.isArray(project.conference_presentations)) {
    fail('Public project conference_presentations must be an array.')
  }

  for (const presentation of project.conference_presentations) {
    assertConferenceShape(presentation)
  }

  if (
    project.start_year != null &&
    !Number.isInteger(project.start_year)
  ) {
    fail('Public project start_year must be an integer or null.')
  }

  if (
    project.end_year != null &&
    !Number.isInteger(project.end_year)
  ) {
    fail('Public project end_year must be an integer or null.')
  }

  if (typeof project.featured !== 'boolean') {
    fail('Public project featured must be boolean.')
  }
}

function assertTeachingShape(item) {
  assertFields(item, PUBLIC_TEACHING_FIELDS, 'Public teaching item')
  assertPrivateFieldsAbsent(item, 'Public teaching item')

  if (!Array.isArray(item.levels)) {
    fail('Public teaching levels must be an array.')
  }

  if (
    item.start_year != null &&
    !Number.isInteger(item.start_year)
  ) {
    fail('Public teaching start_year must be an integer or null.')
  }

  if (
    item.end_year != null &&
    !Number.isInteger(item.end_year)
  ) {
    fail('Public teaching end_year must be an integer or null.')
  }

  if (typeof item.is_current !== 'boolean') {
    fail('Public teaching is_current must be boolean.')
  }

  if (
    !Number.isInteger(item.times_taught) ||
    item.times_taught < 0
  ) {
    fail('Public teaching times_taught must be a non-negative integer.')
  }

  if (
    !Number.isInteger(item.student_count) ||
    item.student_count < 0
  ) {
    fail('Public teaching student_count must be a non-negative integer.')
  }
}

function assertConferenceShape(presentation) {
  assertFields(
    presentation,
    PUBLIC_CONFERENCE_FIELDS,
    'Public conference presentation'
  )
  assertPrivateFieldsAbsent(
    presentation,
    'Public conference presentation'
  )

  if (
    typeof presentation.event_short_name !== 'string' ||
    !presentation.event_short_name.trim()
  ) {
    fail('Conference presentation event_short_name must be non-empty.')
  }

  if (
    typeof presentation.start_date !== 'string' ||
    !presentation.start_date
  ) {
    fail('Conference presentation start_date must be a non-empty string.')
  }

  if (
    typeof presentation.end_date !== 'string' ||
    !presentation.end_date
  ) {
    fail('Conference presentation end_date must be a non-empty string.')
  }

  if (presentation.end_date < presentation.start_date) {
    fail('Conference presentation end_date must not precede start_date.')
  }

  if (
    !PUBLIC_CONFERENCE_TYPES.has(
      presentation.presentation_type
    )
  ) {
    fail(
      'Conference presentation presentation_type must be Conference paper, Keynote, or Workshop.'
    )
  }

  if (!Array.isArray(presentation.authors)) {
    fail('Conference presentation authors must be an array.')
  }

  if (
    'presentation_date' in presentation &&
    presentation.presentation_date !== presentation.start_date
  ) {
    fail(
      'Deprecated conference presentation presentation_date must equal start_date when present.'
    )
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

function currentAmsterdamYear() {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Amsterdam',
      year: 'numeric',
    }).format(new Date())
  )
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

  const publicPaperSlugs = new Set(
    papers.map((paper) => paper.slug)
  )

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

    assertPaperShape(detail, { detail: true })
    console.log(
      '✓ get_public_paper(text): listed slug resolved with detail-only citation/highlight fields'
    )
  } else {
    console.log(
      '✓ get_public_paper(text): skipped because zero public papers is a valid curated state'
    )
  }

  const projectsResult = await supabase.rpc('list_public_projects')

  if (projectsResult.error) {
    fail(
      `list_public_projects() failed: ${projectsResult.error.message}`
    )
  }

  const projects = projectsResult.data ?? []

  if (!Array.isArray(projects)) {
    fail('list_public_projects() did not return an array.')
  }

  for (const project of projects) {
    assertProjectShape(project)

    for (const paperSlug of project.publication_slugs) {
      if (!publicPaperSlugs.has(paperSlug)) {
        fail(
          `Public project ${project.slug} references a paper slug not returned by list_public_papers(): ${paperSlug}`
        )
      }
    }
  }

  console.log(
    `✓ list_public_projects(): ${projects.length} public project(s)`
  )

  if (projects.length > 0) {
    const firstProjectSlug = projects[0]?.slug

    if (
      typeof firstProjectSlug !== 'string' ||
      !firstProjectSlug
    ) {
      fail('First public project has no usable slug.')
    }

    const projectDetailResult = await supabase.rpc(
      'get_public_project',
      { p_slug: firstProjectSlug }
    )

    if (projectDetailResult.error) {
      fail(
        `get_public_project(text) failed: ${projectDetailResult.error.message}`
      )
    }

    const projectDetail = projectDetailResult.data?.[0]

    if (!projectDetail) {
      fail(
        'get_public_project(text) returned no row for a listed public slug.'
      )
    }

    assertProjectShape(projectDetail)
    console.log(
      '✓ get_public_project(text): listed slug resolved'
    )
  } else {
    console.log(
      '✓ get_public_project(text): skipped because zero public projects is a valid curated state'
    )
  }

  const teachingResult = await supabase.rpc(
    'list_public_teaching'
  )

  if (teachingResult.error) {
    fail(
      `list_public_teaching() failed: ${teachingResult.error.message}`
    )
  }

  const teaching = teachingResult.data ?? []

  if (!Array.isArray(teaching)) {
    fail('list_public_teaching() did not return an array.')
  }

  for (const item of teaching) {
    assertTeachingShape(item)
  }

  console.log(
    `✓ list_public_teaching(): ${teaching.length} public teaching item(s); private activity/session metadata absent`
  )

  const conferenceResult = await supabase.rpc(
    'list_public_conference_presentations'
  )

  if (conferenceResult.error) {
    fail(
      `list_public_conference_presentations() failed: ${conferenceResult.error.message}`
    )
  }

  const presentations = conferenceResult.data ?? []

  if (!Array.isArray(presentations)) {
    fail(
      'list_public_conference_presentations() did not return an array.'
    )
  }

  for (const presentation of presentations) {
    assertConferenceShape(presentation)
  }

  console.log(
    `✓ list_public_conference_presentations(): ${presentations.length} public presentation(s); private notes/paper IDs absent`
  )

  const configuredYear = Number.parseInt(
    process.env.PUBLIC_ANALYTICS_YEAR ?? '',
    10
  )
  const year = Number.isFinite(configuredYear)
    ? configuredYear
    : currentAmsterdamYear()

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
