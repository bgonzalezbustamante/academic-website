const ISO_DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/

export function isValidIsoDate(value: unknown): value is string {
  if (typeof value !== 'string') return false

  const match = ISO_DATE_PATTERN.exec(value)
  if (!match) return false

  const year = Number(match[1])
  const month = Number(match[2])
  const day = Number(match[3])
  const parsed = new Date(Date.UTC(year, month - 1, day, 12))

  return (
    parsed.getUTCFullYear() === year &&
    parsed.getUTCMonth() === month - 1 &&
    parsed.getUTCDate() === day
  )
}

export function assertValidIsoDate(
  value: unknown,
  label = 'Date'
): asserts value is string {
  if (!isValidIsoDate(value)) {
    throw new Error(`${label} must use a valid YYYY-MM-DD calendar date.`)
  }
}

export function parseIsoDateUtc(value: string) {
  assertValidIsoDate(value)
  const [year, month, day] = value.split('-').map(Number)
  return new Date(Date.UTC(year, month - 1, day, 12))
}

export function isoDateInTimeZone(date: Date, timeZone: string) {
  if (Number.isNaN(date.getTime())) {
    throw new Error('Current date must be valid.')
  }

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  const value = `${values.year}-${values.month}-${values.day}`
  assertValidIsoDate(value, 'Resolved date')
  return value
}
