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

const CATHOLIC_CALENDAR_URL =
  'https://catholic.bgonzalezbustamante.com/'
const CALENDAR_TIME_ZONE = 'Europe/Amsterdam'

function currentDisplayItems() {
  const date = todayInTimeZone(CALENDAR_TIME_ZONE)
  return getCalendarDisplaySummary(
    getCatholicCalendarState(date)
  ).items
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
    const refresh = () => setItems(currentDisplayItems())

    refresh()
    const interval = window.setInterval(refresh, 60 * 60 * 1000)

    return () => window.clearInterval(interval)
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
