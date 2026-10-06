'use client'

import {
  getCalendarDisplaySummary,
  getCatholicCalendarState,
  todayInTimeZone,
  type CalendarDisplayIcon,
  type CalendarDisplayItem,
} from '@bgonzalezbustamante/catholic-calendar'
import type { CSSProperties } from 'react'
import { useEffect, useState } from 'react'

import { getPublicCalendarSettings } from '@/lib/calendar-settings'

const CATHOLIC_CALENDAR_URL =
  'https://catholic.bgonzalezbustamante.com/'
const CALENDAR_TIME_ZONE = 'Europe/Amsterdam'
const CALENDAR_REFRESH_MS = 5 * 60 * 1000
const STRESS_TEST_DATE = '2027-11-21'

function displayItemsForDate(date: string) {
  return getCalendarDisplaySummary(
    getCatholicCalendarState(date)
  ).items
}

function currentDisplayItems() {
  return displayItemsForDate(
    todayInTimeZone(CALENDAR_TIME_ZONE)
  )
}

function stressTestDisplayItems() {
  return displayItemsForDate(STRESS_TEST_DATE)
}

function calendarIconStyle(
  icon: CalendarDisplayIcon
): CSSProperties {
  return {
    '--footer-calendar-icon':
      `url("/calendar/christicons/${icon}.svg")`,
  } as CSSProperties
}

export default function CatholicCalendarFooter() {
  const [items, setItems] = useState<CalendarDisplayItem[] | null>(
    null
  )

  useEffect(() => {
    let cancelled = false

    const refresh = async () => {
      try {
        const settings = await getPublicCalendarSettings()

        if (cancelled) return

        if (!settings.catholic_calendar_active) {
          setItems(null)
          return
        }

        setItems(
          settings.stress_test_active
            ? stressTestDisplayItems()
            : currentDisplayItems()
        )
      } catch {
        if (!cancelled) setItems(null)
      }
    }

    void refresh()
    const interval = window.setInterval(
      () => void refresh(),
      CALENDAR_REFRESH_MS
    )

    return () => {
      cancelled = true
      window.clearInterval(interval)
    }
  }, [])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className="footer-calendar-row">
      <a
        className="footer-calendar-link"
        href={CATHOLIC_CALENDAR_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={items.map((item) => item.label).join(' · ')}
      >
        {items.map((item, index) => (
          <span className="footer-calendar-group" key={item.id}>
            {index > 0 && (
              <span
                className="footer-calendar-separator"
                aria-hidden="true"
              >
                ·
              </span>
            )}
            <span className="footer-calendar-item">
              <span
                className="footer-calendar-icon"
                data-icon={item.icon}
                style={calendarIconStyle(item.icon)}
                aria-hidden="true"
              />
              <span>{item.label}</span>
            </span>
          </span>
        ))}
      </a>
    </div>
  )
}
