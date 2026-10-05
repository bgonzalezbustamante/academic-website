import assert from 'node:assert/strict'

import {
  getCalendarDisplaySummary,
  getCatholicCalendarState,
} from '@bgonzalezbustamante/catholic-calendar'

const MAX_COMPOSED_DISPLAY_CHARACTERS = 85

const FIXTURES = [
  {
    date: '2027-11-21',
    expected:
      'Our Lord Jesus Christ, King of the Universe · Presentation of the Blessed Virgin Mary',
    purpose: 'maximum-width composition from the full beta.1 range audit',
  },
  {
    date: '2026-09-16',
    expected:
      "St Michael's Lent · 13 days until Saints Michael, Gabriel and Raphael, Archangels",
    purpose: 'long period-plus-countdown composition',
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
    display.text.length <= MAX_COMPOSED_DISPLAY_CHARACTERS,
    `Footer display exceeds the reviewed ${MAX_COMPOSED_DISPLAY_CHARACTERS}-character width envelope on ${fixture.date}.`
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
