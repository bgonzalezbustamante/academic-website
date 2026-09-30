type MonthStyle = 'short' | 'long'

type DateParts = {
  day: string
  month: string
  year: string
}

function getDateParts(value: string, month: MonthStyle): DateParts {
  const parts = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month,
    year: 'numeric',
    timeZone: 'UTC',
  }).formatToParts(new Date(`${value}T00:00:00Z`))

  const values = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return {
    day: values.day,
    month: values.month,
    year: values.year,
  }
}

export function formatConferenceDateRange(
  startDate: string,
  endDate: string,
  month: MonthStyle = 'short'
) {
  const start = getDateParts(startDate, month)

  if (startDate === endDate) {
    return `${start.day} ${start.month} ${start.year}`
  }

  const end = getDateParts(endDate, month)

  if (start.year === end.year && start.month === end.month) {
    return `${start.day}–${end.day} ${start.month} ${start.year}`
  }

  if (start.year === end.year) {
    return `${start.day} ${start.month}–${end.day} ${end.month} ${start.year}`
  }

  return `${start.day} ${start.month} ${start.year}–${end.day} ${end.month} ${end.year}`
}
