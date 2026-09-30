import { createPublicSupabaseClient } from '@/lib/supabase/public'
import type {
  PublicTeachingItem,
  PublicTeachingRole,
} from '@/types/public'

function nullableString(value: unknown) {
  return value == null ? null : String(value)
}

const PUBLIC_TEACHING_ROLES = new Set<PublicTeachingRole>([
  'Course Convenor',
  'Lecturer',
  'Tutor',
  'Thesis Supervisor',
  'Examiner',
])

function normalizeTeachingRole(
  value: unknown
): PublicTeachingRole | null {
  if (value == null) return null

  const role = String(value) as PublicTeachingRole
  return PUBLIC_TEACHING_ROLES.has(role) ? role : null
}

function nullableYear(value: unknown) {
  if (value == null) return null

  const year = Number(value)
  return Number.isInteger(year) ? year : null
}

function nonNegativeInteger(value: unknown) {
  const number = Number(value)
  return Number.isInteger(number) && number >= 0 ? number : 0
}

function normalizeTeachingItem(
  row: Record<string, unknown>
): PublicTeachingItem {
  return {
    name: String(row.name ?? ''),
    institution: String(row.institution ?? ''),
    summary: String(row.summary ?? ''),
    role: normalizeTeachingRole(row.role),
    start_year: nullableYear(row.start_year),
    end_year: nullableYear(row.end_year),
    is_current: row.is_current === true,
    levels: Array.isArray(row.levels)
      ? row.levels.map((level) => String(level))
      : [],
    times_taught: nonNegativeInteger(row.times_taught),
    student_count: nonNegativeInteger(row.student_count),
    course_image_filename:
      nullableString(row.course_image_filename),
  }
}

export async function listPublicTeaching(): Promise<
  PublicTeachingItem[]
> {
  const supabase = createPublicSupabaseClient()
  const { data, error } = await supabase.rpc(
    'list_public_teaching'
  )

  if (error) {
    throw new Error('Could not load public teaching portfolio.')
  }

  return ((data ?? []) as Record<string, unknown>[]).map(
    normalizeTeachingItem
  )
}
