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
import { formatFooterCalendarDate } from '@/lib/calendar-footer-date'

const CATHOLIC_CALENDAR_URL =
  'https://catholic.bgonzalezbustamante.com/'
const CALENDAR_TIME_ZONE = 'Europe/Amsterdam'
const CALENDAR_REFRESH_MS = 5 * 60 * 1000
const STRESS_TEST_DATE = '2027-11-21'

type FooterCalendarDisplay = {
  date: string
  items: CalendarDisplayItem[]
}

function displayForDate(date: string): FooterCalendarDisplay {
  return {
    date,
    items: getCalendarDisplaySummary(
      getCatholicCalendarState(date)
    ).items,
  }
}

function currentDisplay() {
  return displayForDate(
    todayInTimeZone(CALENDAR_TIME_ZONE)
  )
}

function stressTestDisplay() {
  return displayForDate(STRESS_TEST_DATE)
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
  const [display, setDisplay] =
    useState<FooterCalendarDisplay | null>(null)

  useEffect(() => {
    let cancelled = false

    const refresh = async () => {
      try {
        const settings = await getPublicCalendarSettings()

        if (cancelled) return

        if (!settings.catholic_calendar_active) {
          setDisplay(null)
          return
        }

        setDisplay(
          settings.stress_test_active
            ? stressTestDisplay()
            : currentDisplay()
        )
      } catch {
        if (!cancelled) setDisplay(null)
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

  if (!display || display.items.length === 0) {
    return null
  }

  const formattedDate = formatFooterCalendarDate(display.date)

  return (
    <div className="footer-calendar-row">
      <a
        className="footer-calendar-link"
        href={CATHOLIC_CALENDAR_URL}
        target="_blank"
        rel="noreferrer"
        aria-label={`${formattedDate} · ${display.items
          .map((item) => item.label)
          .join(' · ')}`}
      >
        <time
          className="footer-calendar-date"
          dateTime={display.date}
        >
          {formattedDate}
        </time>
        <span
          className="footer-calendar-separator"
          aria-hidden="true"
        >
          ·
        </span>

        {display.items.map((item, index) => (
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
