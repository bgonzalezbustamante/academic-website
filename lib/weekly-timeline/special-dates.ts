import { catholicCalendarToSpecialDates } from '@/lib/weekly-timeline/catholic-calendar'
import { parseIsoDateUtc } from '@/lib/weekly-timeline/date-utils'
import { assertValidSpecialDateRules } from '@/lib/weekly-timeline/special-date-rules'
import type {
  PublicAvailabilityItem,
  PublicAvailabilityType,
  PublicConferencePresentation,
  SpecialDate,
  SpecialDayType,
} from '@/types/weekly-timeline'

/**
 * Local/manual presentation overrides only.
 *
 * Catholic observance dates are resolved by
 * @bgonzalezbustamante/catholic-calendar. Keep this module for timeline-only
 * exceptions that are not part of the package's selected observance model.
 */
export const recurringSpecialDates = [
  {
    monthDay: '12-24',
    type: 'sunday',
    label: 'Christmas Eve',
  },
] as const

export const specialDates: SpecialDate[] = []

const AVAILABILITY_TYPE_MAP: Record<
  Exclude<PublicAvailabilityType, 'trip'>,
  SpecialDayType
> = {
  winter_holiday: 'winter-holiday',
  summer_holiday: 'summer-holiday',
  unavailable: 'unavailable',
}

const AVAILABILITY_PRIORITY: Record<
  Exclude<PublicAvailabilityType, 'trip'>,
  number
> = {
  unavailable: 0,
  winter_holiday: 1,
  summer_holiday: 1,
}

function addIsoDays(value: string, days: number) {
  const date = parseIsoDateUtc(value)
  date.setUTCDate(date.getUTCDate() + days)
  return date.toISOString().slice(0, 10)
}

function datesInRange(startDate: string, endDate: string) {
  const dates: string[] = []

  for (
    let date = startDate;
    date <= endDate;
    date = addIsoDays(date, 1)
  ) {
    dates.push(date)
  }

  return dates
}

function pushLabel(
  labelsByDate: Map<string, Set<string>>,
  date: string,
  label: string
) {
  const labels = labelsByDate.get(date) ?? new Set<string>()
  labels.add(label)
  labelsByDate.set(date, labels)
}

function coalesceDailyStates(
  states: Array<{
    date: string
    type: 'conference' | 'trip'
    label: string
  }>
): SpecialDate[] {
  const segments: Array<{
    from: string
    to: string
    type: 'conference' | 'trip'
    label: string
  }> = []

  for (const state of states) {
    const previous = segments.at(-1)

    if (
      previous &&
      previous.type === state.type &&
      previous.label === state.label &&
      addIsoDays(previous.to, 1) === state.date
    ) {
      previous.to = state.date
      continue
    }

    segments.push({
      from: state.date,
      to: state.date,
      type: state.type,
      label: state.label,
    })
  }

  return segments
}

export function conferencePresentationsToSpecialDates(
  presentations: PublicConferencePresentation[]
): SpecialDate[] {
  const conferenceLabelsByDate = new Map<string, Set<string>>()
  const tripLabelsByDate = new Map<string, Set<string>>()

  const attended = presentations
    .filter((presentation) => presentation.personal_attendance)
    .sort(
      (left, right) =>
        left.start_date.localeCompare(right.start_date) ||
        left.end_date.localeCompare(right.end_date) ||
        left.event_short_name.localeCompare(right.event_short_name)
    )

  for (const presentation of attended) {
    const label = presentation.event_short_name.trim()

    for (const date of datesInRange(
      presentation.start_date,
      presentation.end_date
    )) {
      pushLabel(conferenceLabelsByDate, date, label)
    }

    if (presentation.involves_trip) {
      pushLabel(
        tripLabelsByDate,
        addIsoDays(presentation.start_date, -1),
        label
      )
      pushLabel(
        tripLabelsByDate,
        addIsoDays(presentation.end_date, 1),
        label
      )
    }
  }

  const allDates = new Set([
    ...conferenceLabelsByDate.keys(),
    ...tripLabelsByDate.keys(),
  ])

  const dailyStates = [...allDates]
    .sort((left, right) => left.localeCompare(right))
    .map((date) => {
      const conferenceLabels = conferenceLabelsByDate.get(date)

      if (conferenceLabels && conferenceLabels.size > 0) {
        return {
          date,
          type: 'conference' as const,
          label: [...conferenceLabels].sort().join(' · '),
        }
      }

      const tripLabels = tripLabelsByDate.get(date) ?? new Set<string>()

      return {
        date,
        type: 'trip' as const,
        label: [...tripLabels].sort().join(' · '),
      }
    })

  return coalesceDailyStates(dailyStates)
}

export function availabilityToSpecialDates(
  availability: PublicAvailabilityItem[]
): SpecialDate[] {
  return availability
    .filter(
      (
        item
      ): item is PublicAvailabilityItem & {
        type: Exclude<PublicAvailabilityType, 'trip'>
      } => item.type !== 'trip'
    )
    .sort((left, right) => {
      const priority =
        AVAILABILITY_PRIORITY[left.type] - AVAILABILITY_PRIORITY[right.type]

      if (priority !== 0) return priority

      return (
        left.start_date.localeCompare(right.start_date) ||
        left.end_date.localeCompare(right.end_date) ||
        left.type.localeCompare(right.type) ||
        left.label.localeCompare(right.label)
      )
    })
    .map((item) => ({
      from: item.start_date,
      to: item.end_date,
      type: AVAILABILITY_TYPE_MAP[item.type],
      label: item.label,
    }))
}

export function getConfiguredSpecialDates(
  years: number[],
  publicAvailability: PublicAvailabilityItem[] = [],
  publicConferences: PublicConferencePresentation[] = []
): SpecialDate[] {
  assertValidSpecialDateRules(specialDates, { allowOverlaps: false })

  const uniqueYears = Array.from(new Set(years))
  const localRecurringDates: SpecialDate[] = uniqueYears.flatMap((year) =>
    recurringSpecialDates.map(({ monthDay, type, label }) => ({
      date: `${year}-${monthDay}`,
      type,
      label,
    }))
  )
  const catholicDates = catholicCalendarToSpecialDates(uniqueYears)
  const availabilityDates = availabilityToSpecialDates(publicAvailability)
  const conferenceDates =
    conferencePresentationsToSpecialDates(publicConferences)
  const unavailableDates = availabilityDates.filter(
    (entry) => entry.type === 'unavailable'
  )
  const holidayDates = availabilityDates.filter(
    (entry) => entry.type !== 'unavailable'
  )

  assertValidSpecialDateRules(localRecurringDates, {
    allowOverlaps: false,
  })

  return [
    ...specialDates,
    ...localRecurringDates,
    ...catholicDates,
    ...unavailableDates,
    ...conferenceDates,
    ...holidayDates,
  ]
}
