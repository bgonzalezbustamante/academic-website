import assert from 'node:assert/strict'

import {
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@bgonzalezbustamante/catholic-calendar'

const EXPECTED_LONGEST =
  "St Michael's Lent · 13 days until Saints Michael, Gabriel and Raphael, Archangels"
const EXPECTED_CURRENT_SAMPLE =
  '2 days until Our Lady of the Rosary'

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

let longest = { date: '', text: '', length: 0 }

for (
  let year = MIN_SUPPORTED_YEAR;
  year <= MAX_SUPPORTED_YEAR;
  year += 1
) {
  const cursor = new Date(Date.UTC(year, 0, 1))
  const end = new Date(Date.UTC(year, 11, 31))

  while (cursor <= end) {
    const date = isoDate(cursor)
    const display = getCalendarDisplaySummary(
      getCatholicCalendarState(date)
    )

    assert.ok(
      display.items.length <= 2,
      `Composed display exceeded two items on ${date}.`
    )

    for (const item of display.items) {
      assert.ok(item.icon, `Missing composed-display icon on ${date}.`)
      assert.ok(item.label, `Missing composed-display label on ${date}.`)
    }

    if (display.text.length > longest.length) {
      longest = {
        date,
        text: display.text,
        length: display.text.length,
      }
    }

    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
}

assert.equal(
  longest.text,
  EXPECTED_LONGEST,
  'Unexpected longest composed calendar display.'
)

assert.equal(
  getCalendarDisplaySummary(
    getCatholicCalendarState('2026-10-05')
  ).text,
  EXPECTED_CURRENT_SAMPLE,
  'Unexpected 5 October 2026 composed calendar display.'
)

console.log(
  `✓ Catholic footer calendar: scanned ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}; longest display is ${longest.length} characters on ${longest.date}: ${longest.text}`
)
console.log(
  `✓ Catholic footer calendar: 2026-10-05 → ${EXPECTED_CURRENT_SAMPLE}`
)
