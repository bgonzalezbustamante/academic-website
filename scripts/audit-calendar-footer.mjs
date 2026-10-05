import assert from 'node:assert/strict'

import {
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  MAX_SUPPORTED_YEAR,
  MIN_SUPPORTED_YEAR,
} from '@bgonzalezbustamante/catholic-calendar'

const EXPECTED_MAX_CHARACTERS = 85
const EXPECTED_LONGEST =
  'Our Lord Jesus Christ, King of the Universe · Presentation of the Blessed Virgin Mary'

function isoDate(date) {
  return date.toISOString().slice(0, 10)
}

let longest = {
  date: '',
  text: '',
  length: 0,
}

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
  longest.length,
  EXPECTED_MAX_CHARACTERS,
  'The Catholic footer maximum character envelope changed.'
)

assert.equal(
  longest.text,
  EXPECTED_LONGEST,
  'The longest Catholic footer composition changed.'
)

console.log(
  `✓ Catholic footer full-range audit: ${MIN_SUPPORTED_YEAR}–${MAX_SUPPORTED_YEAR}`
)
console.log(
  `✓ Longest composition: ${longest.length} characters on ${longest.date}: ${longest.text}`
)
