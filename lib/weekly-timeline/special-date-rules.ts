import { assertValidIsoDate } from '@/lib/weekly-timeline/date-utils'
import type { SpecialDate, SpecialDayType } from '@/types/weekly-timeline'

const SPECIAL_DAY_TYPES = new Set<SpecialDayType>([
  'sunday',
  'winter-holiday',
  'summer-holiday',
  'trip',
  'conference',
  'sick',
  'unavailable',
])

function bounds(entry: SpecialDate) {
  return 'date' in entry
    ? { start: entry.date, end: entry.date }
    : { start: entry.from, end: entry.to }
}

export function assertValidSpecialDateRules(
  rules: SpecialDate[],
  {
    allowOverlaps = true,
  }: {
    allowOverlaps?: boolean
  } = {}
) {
  rules.forEach((entry, index) => {
    if (!SPECIAL_DAY_TYPES.has(entry.type)) {
      throw new Error(
        `Special date rule ${index + 1} has an unsupported type.`
      )
    }

    if (
      entry.label !== undefined &&
      (typeof entry.label !== 'string' || entry.label.trim().length === 0)
    ) {
      throw new Error(
        `Special date rule ${index + 1} label must be a non-empty string.`
      )
    }

    if ('date' in entry) {
      assertValidIsoDate(entry.date, `Special date rule ${index + 1} date`)
      return
    }

    assertValidIsoDate(entry.from, `Special date rule ${index + 1} from`)
    assertValidIsoDate(entry.to, `Special date rule ${index + 1} to`)

    if (entry.from > entry.to) {
      throw new Error(
        `Special date rule ${index + 1} range must start on or before it ends.`
      )
    }
  })

  if (allowOverlaps) return

  for (let left = 0; left < rules.length; left += 1) {
    const leftBounds = bounds(rules[left])

    for (let right = left + 1; right < rules.length; right += 1) {
      const rightBounds = bounds(rules[right])
      const overlaps =
        leftBounds.start <= rightBounds.end &&
        rightBounds.start <= leftBounds.end

      if (overlaps) {
        throw new Error(
          `Special date rules ${left + 1} and ${right + 1} overlap.`
        )
      }
    }
  }
}
