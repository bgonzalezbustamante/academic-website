import {
  faCalendarWeek,
  faClock,
  faMugHot,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import type {
  PublicWorkAnalytics,
  PublicWorkDay,
} from '@/types/public'

type Props = {
  analytics: PublicWorkAnalytics
}

type HeatmapDay = {
  date: string
  netMinutes: number
  inSelectedYear: boolean
}

type MonthMarker = {
  label: string
  weekIndex: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function parseDate(value: string) {
  const [year, month, day] = value
    .split('-')
    .map(Number)

  return new Date(
    Date.UTC(year, month - 1, day)
  )
}

function formatDateValue(date: Date) {
  return date.toISOString().slice(0, 10)
}

function shiftDate(value: string, days: number) {
  const date = parseDate(value)
  date.setUTCDate(date.getUTCDate() + days)
  return formatDateValue(date)
}

function getWeekStart(value: string) {
  const date = parseDate(value)
  const weekday = date.getUTCDay()
  const difference = weekday === 0 ? -6 : 1 - weekday
  return shiftDate(value, difference)
}

function getWeekEnd(value: string) {
  return shiftDate(getWeekStart(value), 6)
}

function getDateRange(start: string, end: string) {
  const dates: string[] = []
  const endTime = parseDate(end).getTime()

  for (
    let time = parseDate(start).getTime();
    time <= endTime;
    time += DAY_MS
  ) {
    dates.push(formatDateValue(new Date(time)))
  }

  return dates
}

function getHeatmapLevel(minutes: number) {
  if (minutes <= 0) return 'level-0'
  if (minutes < 240) return 'level-1'
  if (minutes < 480) return 'level-2'
  if (minutes < 600) return 'level-3'
  if (minutes < 720) return 'level-4'
  return 'level-5'
}

function getHeatmapWeeks(
  year: number,
  days: PublicWorkDay[]
) {
  const dailyMinutes = new Map(
    days.map((day) => [
      day.date,
      day.net_minutes,
    ])
  )

  const yearStart = `${year}-01-01`
  const yearEnd = `${year}-12-31`
  const heatmapStart = getWeekStart(yearStart)
  const heatmapEnd = getWeekEnd(yearEnd)
  const allDates = getDateRange(
    heatmapStart,
    heatmapEnd
  )

  const weeks: HeatmapDay[][] = []

  for (
    let index = 0;
    index < allDates.length;
    index += 7
  ) {
    weeks.push(
      allDates
        .slice(index, index + 7)
        .map((date) => ({
          date,
          netMinutes: dailyMinutes.get(date) ?? 0,
          inSelectedYear:
            date >= yearStart &&
            date <= yearEnd,
        }))
    )
  }

  return {
    weeks,
    heatmapStart,
  }
}

function getMonthMarkers(
  year: number,
  heatmapStart: string
): MonthMarker[] {
  return Array.from(
    { length: 12 },
    (_, month) => {
      const monthDate = new Date(
        Date.UTC(year, month, 1)
      )

      const differenceDays = Math.floor(
        (
          monthDate.getTime() -
          parseDate(heatmapStart).getTime()
        ) / DAY_MS
      )

      return {
        label: new Intl.DateTimeFormat(
          'en-GB',
          { month: 'short' }
        ).format(monthDate),
        weekIndex: Math.floor(
          differenceDays / 7
        ),
      }
    }
  )
}

function formatDuration(minutes: number) {
  const rounded = Math.max(
    0,
    Math.round(minutes)
  )
  const hours = Math.floor(rounded / 60)
  const remainder = rounded % 60

  if (hours === 0) {
    return `${remainder}m`
  }

  if (remainder === 0) {
    return `${hours}h`
  }

  return `${hours}h ${remainder}m`
}

function formatFullDate(value: string) {
  return new Intl.DateTimeFormat(
    'en-GB',
    {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      timeZone: 'UTC',
    }
  ).format(parseDate(value))
}

export default function PublicWorkAnalytics({
  analytics,
}: Props) {
  const { weeks, heatmapStart } =
    getHeatmapWeeks(
      analytics.year,
      analytics.days
    )

  const monthMarkers = getMonthMarkers(
    analytics.year,
    heatmapStart
  )

  return (
    <section
      className="section activity-section"
      id="activity"
    >
      <div className="site-shell">
        <div className="section-heading">
          <div>
            <p className="eyebrow">
              Current year
            </p>
            <h2>Activity over time</h2>
            <p className="activity-intro">
              Daily net working-hour intensity during {analytics.year}.
            </p>
          </div>
        </div>

        <div className="analytics-summary-grid">
          <article className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <FontAwesomeIcon
                icon={faClock}
                aria-hidden="true"
              />
            </div>
            <div>
              <p>Working Hours per day</p>
              <strong>
                {formatDuration(
                  analytics.average_net_minutes_per_working_day
                )}
                <span> on average</span>
              </strong>
            </div>
          </article>

          <article className="analytics-stat-card">
            <div className="analytics-stat-icon">
              <FontAwesomeIcon
                icon={faMugHot}
                aria-hidden="true"
              />
            </div>
            <div>
              <p>Coffee per working day</p>
              <strong>
                {analytics.average_coffees_per_working_day.toFixed(1)}
                <span> on average</span>
              </strong>
            </div>
          </article>
        </div>

        <div className="activity-card">
          <div className="activity-card-heading">
            <p className="activity-card-label">
              {analytics.year}
            </p>

            <div
              className="activity-legend"
              aria-label="Heatmap intensity legend"
            >
              <span>Less</span>
              {[
                'level-0',
                'level-1',
                'level-2',
                'level-3',
                'level-4',
                'level-5',
              ].map((level) => (
                <span
                  key={level}
                  className={
                    'heatmap-legend-cell ' +
                    level
                  }
                  aria-hidden="true"
                />
              ))}
              <span>More</span>
            </div>
          </div>

          <div className="activity-scroll">
            <div className="activity-heatmap">
              <div className="activity-months">
                {monthMarkers.map(
                  (marker) => (
                    <span
                      key={marker.label}
                      style={{
                        gridColumnStart:
                          marker.weekIndex + 1,
                      }}
                    >
                      {marker.label}
                    </span>
                  )
                )}
              </div>

              <div className="activity-grid-row">
                <div className="activity-day-labels">
                  <span />
                  <span>Tue</span>
                  <span />
                  <span>Thu</span>
                  <span />
                  <span>Sat</span>
                  <span />
                </div>

                <div
                  className="activity-weeks"
                  style={{
                    gridTemplateColumns:
                      `repeat(${weeks.length}, minmax(0, 1fr))`,
                  }}
                >
                  {weeks.map(
                    (week, weekIndex) => (
                      <div
                        className="activity-week"
                        key={weekIndex}
                      >
                        {week.map((day) => (
                          <span
                            key={day.date}
                            className={[
                              'heatmap-cell',
                              day.inSelectedYear
                                ? getHeatmapLevel(
                                    day.netMinutes
                                  )
                                : 'outside-year',
                            ].join(' ')}
                            title={
                              day.inSelectedYear
                                ? `${formatFullDate(
                                    day.date
                                  )}: ${formatDuration(
                                    day.netMinutes
                                  )} net`
                                : undefined
                            }
                            aria-label={
                              day.inSelectedYear
                                ? `${formatFullDate(
                                    day.date
                                  )}, ${formatDuration(
                                    day.netMinutes
                                  )} net working time`
                                : undefined
                            }
                          />
                        ))}
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="activity-bins">
            <span>0h</span>
            <span>&lt;4h</span>
            <span>4–8h</span>
            <span>8–10h</span>
            <span>10–12h</span>
            <span>12h+</span>
          </div>
        </div>

        <div className="activity-timeline-link">
          <Link className="bio-profile-link" href="/weekly-timeline">
            <FontAwesomeIcon icon={faCalendarWeek} aria-hidden="true" />
            Weekly timeline
          </Link>
        </div>
      </div>
    </section>
  )
}
