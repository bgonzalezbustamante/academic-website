const FOOTER_DATE_FORMATTER = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function formatFooterCalendarDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`)

  if (Number.isNaN(parsed.getTime())) {
    return date
  }

  return FOOTER_DATE_FORMATTER.format(parsed)
}
