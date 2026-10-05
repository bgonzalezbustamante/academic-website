import assert from 'node:assert/strict'

import {
  getCalendarDisplaySummary,
  getCatholicCalendarState,
} from '@bgonzalezbustamante/catholic-calendar'

const FIXTURES = [
  {
    date: '2026-09-16',
    expected:
      "St Michael's Lent · 13 days until Saints Michael, Gabriel and Raphael, Archangels",
    purpose: 'longest composed-display width stress case',
  },
  {
    date: '2026-10-05',
    expected: '2 days until Our Lady of the Rosary',
    purpose: 'current-day integration sample',
  },
]

for (const fixture of FIXTURES) {
  const display = getCalendarDisplaySummary(
    getCatholicCalendarState(fixture.date)
  )

  assert.equal(
    display.text,
    fixture.expected,
    `Unexpected ${fixture.purpose} on ${fixture.date}.`
  )

  assert.ok(
    display.items.length <= 2,
    `Composed display exceeded two items on ${fixture.date}.`
  )

  for (const item of display.items) {
    assert.ok(item.icon, `Missing composed-display icon on ${fixture.date}.`)
    assert.ok(item.label, `Missing composed-display label on ${fixture.date}.`)
  }

  console.log(
    `✓ Catholic footer calendar: ${fixture.date} → ${display.text}`
  )
}
