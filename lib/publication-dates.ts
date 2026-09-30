const AMSTERDAM_TIME_ZONE = 'Europe/Amsterdam'

function normalisePublicationDate(date: string | null) {
  const value = date?.slice(0, 10) ?? null

  return value && /^\d{4}-\d{2}-\d{2}$/.test(value)
    ? value
    : null
}

function currentAmsterdamDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: AMSTERDAM_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now)

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return `${values.year}-${values.month}-${values.day}`
}

export function isForthcomingPublicationDate(
  date: string | null,
  now = new Date()
) {
  const publicationDate = normalisePublicationDate(date)

  return (
    publicationDate === null ||
    publicationDate > currentAmsterdamDate(now)
  )
}

export function publicationYearLabel(
  date: string | null,
  now = new Date()
) {
  if (isForthcomingPublicationDate(date, now)) {
    return 'Forthcoming'
  }

  return normalisePublicationDate(date)?.slice(0, 4) ?? 'Forthcoming'
}

export function formatPublicationMonthYear(date: string | null) {
  const publicationDate = normalisePublicationDate(date)

  if (!publicationDate) return null

  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'long',
    timeZone: 'UTC',
  }).format(new Date(`${publicationDate}T00:00:00Z`))
}
