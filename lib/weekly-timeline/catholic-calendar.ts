import {
  buildYearObservances,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@bgonzalezbustamante/catholic-calendar'

import { assertValidSpecialDateRules } from '@/lib/weekly-timeline/special-date-rules'
import type { SpecialDate } from '@/types/weekly-timeline'

export const TIMELINE_CATHOLIC_OBSERVANCES = [
  { id: 'palm-sunday', label: 'Palm Sunday' },
  { id: 'holy-thursday', label: 'Holy Thursday' },
  { id: 'good-friday', label: 'Good Friday' },
  { id: 'holy-saturday', label: 'Holy Saturday' },
  { id: 'easter-sunday', label: 'Easter Sunday' },
  { id: 'divine-mercy-sunday', label: 'Divine Mercy' },
  { id: 'ascension', label: 'Ascension' },
  { id: 'pentecost', label: 'Pentecost' },
  { id: 'corpus-christi', label: 'Corpus Christi' },
  { id: 'assumption', label: 'Assumption' },
  { id: 'all-saints', label: 'All Saints' },
  { id: 'all-souls', label: 'All Souls' },
  { id: 'immaculate-conception', label: 'Immaculate' },
  { id: 'christmas', label: 'Christmas' },
] as const

const timelineLabelsByObservanceId = new Map<string, string>(
  TIMELINE_CATHOLIC_OBSERVANCES.map(({ id, label }) => [id, label])
)

export function catholicCalendarToSpecialDates(
  years: number[]
): SpecialDate[] {
  const uniqueYears = Array.from(new Set(years)).sort(
    (left, right) => left - right
  )

  for (const year of uniqueYears) {
    if (
      !Number.isInteger(year) ||
      year < MIN_SUPPORTED_YEAR ||
      year > MAX_SUPPORTED_YEAR
    ) {
      throw new RangeError(
        `Catholic Calendar supports years ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}.`
      )
    }
  }

  const catholicDates: SpecialDate[] = uniqueYears.flatMap((year) =>
    buildYearObservances(year)
      .filter(
        (observance) =>
          timelineLabelsByObservanceId.has(observance.id) &&
          observance.observedDate !== null
      )
      .map((observance) => ({
        date: observance.observedDate!,
        type: 'sunday' as const,
        label: timelineLabelsByObservanceId.get(observance.id)!,
      }))
  )

  assertValidSpecialDateRules(catholicDates, {
    allowOverlaps: false,
  })

  return catholicDates
}
