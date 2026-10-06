'use client'

import { useEffect, useRef, useState } from 'react'

import PenguinSprite from '@/components/weekly-timeline/penguin-sprite'
import { formatDisplayDate, formatMinutes } from '@/lib/weekly-timeline/timeline'
import type { TimelineWeek } from '@/types/weekly-timeline'

function compactDate(value: string) {
  return formatDisplayDate(value).replace(/\s+\d{4}$/, '')
}

function relativeDayLabel(
  startIndex: number,
  currentDayStartIndex: number
) {
  const offset = startIndex - currentDayStartIndex

  if (offset === 0) return 'Today'
  if (offset < 0) {
    const days = Math.abs(offset)
    return `${days}d ago`
  }

  return `in ${offset}d`
}

export default function WeeklyPenguinTimeline({
  weeks,
}: {
  weeks: TimelineWeek[]
}) {
  const currentWeekIndex = Math.max(
    0,
    weeks.findIndex((week) => week.isCurrentWeek)
  )
  const allDays = weeks.flatMap((week) => week.days)
  const maxStartIndex = Math.max(0, allDays.length - 7)
  const currentWeekStartIndex = Math.min(
    currentWeekIndex * 7,
    maxStartIndex
  )
  const todayIndex = allDays.findIndex((day) => day.isToday)
  const currentDayIndex =
    todayIndex >= 0
      ? Math.min(todayIndex, maxStartIndex)
      : currentWeekStartIndex
  const availableStartCount = maxStartIndex + 1
  const visiblePageCount = Math.min(9, availableStartCount)
  const maxWindowStart = Math.max(
    0,
    availableStartCount - visiblePageCount
  )
  const centredWindowStartFor = (index: number) =>
    Math.min(
      maxWindowStart,
      Math.max(
        0,
        index - Math.floor(visiblePageCount / 2)
      )
    )
  const initialWindowStart =
    centredWindowStartFor(currentDayIndex)

  const [selectedDayIndex, setSelectedDayIndex] =
    useState(currentDayIndex)
  const [viewStartIndex, setViewStartIndex] =
    useState(currentWeekStartIndex)
  const [windowStart, setWindowStart] =
    useState(initialWindowStart)
  const mobileDateRailRef = useRef<HTMLDivElement | null>(null)
  const selectedDateButtonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    if (!window.matchMedia('(max-width: 760px)').matches) return

    const rail = mobileDateRailRef.current
    const selectedButton = selectedDateButtonRef.current

    if (!rail || !selectedButton) return

    const railRect = rail.getBoundingClientRect()
    const buttonRect = selectedButton.getBoundingClientRect()
    const targetLeft =
      rail.scrollLeft +
      buttonRect.left -
      railRect.left -
      (rail.clientWidth - buttonRect.width) / 2

    rail.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    })
  }, [selectedDayIndex, windowStart])

  const selectedDays = allDays.slice(
    viewStartIndex,
    viewStartIndex + 7
  )
  const visibleStartIndices = Array.from(
    { length: visiblePageCount },
    (_, index) => windowStart + index
  )

  function clampIndex(index: number) {
    return Math.min(maxStartIndex, Math.max(0, index))
  }

  function keepSelectedVisible(index: number) {
    setWindowStart((currentWindowStart) => {
      const currentWindowEnd =
        currentWindowStart + visiblePageCount - 1

      if (index < currentWindowStart) return index

      if (index > currentWindowEnd) {
        return Math.min(
          maxWindowStart,
          index - visiblePageCount + 1
        )
      }

      return currentWindowStart
    })
  }

  function selectRollingStart(nextIndex: number) {
    const clampedIndex = clampIndex(nextIndex)

    setSelectedDayIndex(clampedIndex)
    setViewStartIndex(clampedIndex)
    keepSelectedVisible(clampedIndex)
  }

  function moveDay(offset: number) {
    const nextSelectedIndex =
      clampIndex(selectedDayIndex + offset)
    const nextViewStartIndex =
      clampIndex(viewStartIndex + offset)

    setSelectedDayIndex(nextSelectedIndex)
    setViewStartIndex(nextViewStartIndex)
    keepSelectedVisible(nextSelectedIndex)
  }

  function restoreCurrentDay() {
    setSelectedDayIndex(currentDayIndex)
    setViewStartIndex(currentWeekStartIndex)
    setWindowStart(initialWindowStart)
  }

  function moveWeek(offset: number) {
    const targetSelectedIndex =
      clampIndex(selectedDayIndex + offset * 7)
    const targetWeekStartIndex =
      clampIndex(
        Math.floor(targetSelectedIndex / 7) * 7
      )

    setSelectedDayIndex(targetSelectedIndex)
    setViewStartIndex(targetWeekStartIndex)
    setWindowStart(
      centredWindowStartFor(targetSelectedIndex)
    )
  }

  const selectedStartDate = selectedDays[0]?.date
  const selectedEndDate = selectedDays[selectedDays.length - 1]?.date
  const isCurrentWeek =
    viewStartIndex === currentWeekStartIndex

  if (!selectedStartDate || !selectedEndDate) return null

  return (
    <section className="timeline-section" aria-labelledby="weekly-timeline-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Seven-day view</p>
          <h1 id="weekly-timeline-title">Weekly timeline</h1>
          <p className="section-intro section-intro-wide">
            Daily net working time and coffee counts translated into one
            penguin state per day. Browse roughly three months before and
            three months after the current date.
          </p>
        </div>
      </div>

      <div className="week-pagination-scroll">
        <nav className="week-pagination" aria-label="Weekly timeline pagination">
          <div className="week-nav-stack week-nav-stack-previous">
            <button
              className="week-nav-button"
              type="button"
              onClick={() => moveDay(-1)}
              disabled={selectedDayIndex === 0}
              aria-label="Move seven-day window back one day"
            >
              <span aria-hidden="true">←</span>
              Previous day
            </button>
          </div>

          <div
            className="week-pages-scroll"
            ref={mobileDateRailRef}
          >
            <div className="week-pages">
              {visibleStartIndices.map((startIndex) => {
                const startDay = allDays[startIndex]
                const selected = startIndex === selectedDayIndex
                const isCurrentDay = startIndex === currentDayIndex

                if (!startDay) return null

                return (
                  <button
                    className={[
                      'week-page-button',
                      selected ? 'is-selected' : '',
                      isCurrentDay ? 'is-current-day' : '',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    type="button"
                    key={startDay.date}
                    ref={selected ? selectedDateButtonRef : undefined}
                    onClick={() => selectRollingStart(startIndex)}
                    aria-current={selected ? 'page' : undefined}
                    aria-label={`Show seven-day window starting ${formatDisplayDate(startDay.date)}`}
                  >
                    <span>{compactDate(startDay.date)}</span>
                    <small>
                      {relativeDayLabel(startIndex, currentDayIndex)}
                    </small>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="week-nav-stack week-nav-stack-next">
            <button
              className="week-jump-button week-current-day-button"
              type="button"
              onClick={restoreCurrentDay}
              disabled={
                selectedDayIndex === currentDayIndex &&
                viewStartIndex === currentWeekStartIndex &&
                windowStart === initialWindowStart
              }
            >
              Current day
            </button>
            <button
              className="week-nav-button week-next-day-button"
              type="button"
              onClick={() => moveDay(1)}
              disabled={selectedDayIndex === maxStartIndex}
              aria-label="Move seven-day window forward one day"
            >
              Next day
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </nav>
        <div
          className="week-pagination-secondary"
          aria-label="Weekly timeline shortcuts"
        >
          <div className="week-pagination-secondary-group">
            <button
              className="week-jump-button week-first-button"
              type="button"
              onClick={() => selectRollingStart(0)}
              disabled={selectedDayIndex === 0}
            >
              First
            </button>
            <button
              className="week-jump-button week-previous-week-button"
              type="button"
              onClick={() =>
                moveWeek(-1)
              }
              disabled={selectedDayIndex === 0}
              aria-label="Move seven-day window back one week"
            >
              <span aria-hidden="true">←</span>
              Previous week
            </button>
          </div>

          <div className="week-pagination-secondary-group">
            <button
              className="week-jump-button week-next-week-button"
              type="button"
              onClick={() =>
                moveWeek(1)
              }
              disabled={selectedDayIndex === maxStartIndex}
              aria-label="Move seven-day window forward one week"
            >
              Next week
              <span aria-hidden="true">→</span>
            </button>
            <button
              className="week-jump-button week-last-button"
              type="button"
              onClick={() => selectRollingStart(maxStartIndex)}
              disabled={selectedDayIndex === maxStartIndex}
            >
              Last
            </button>
          </div>
        </div>
      </div>

      <div className="selected-week-heading" aria-live="polite">
        <strong>
          {formatDisplayDate(selectedStartDate)} –{' '}
          {formatDisplayDate(selectedEndDate)}
        </strong>
        {isCurrentWeek ? <span>Current week</span> : null}
      </div>

      <div className="timeline-scroll" tabIndex={0}>
        <ol className="weekly-timeline">
          {selectedDays.map((day) => {
            const specialText = day.specialLabel

            return (
              <li
                className={[
                  'day-card',
                  day.isToday ? 'is-today' : '',
                  day.isFuture ? 'is-future' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={day.date}
              >
                <div className="day-header">
                  <div>
                    <span className="weekday">{day.weekday}</span>
                    <span className="date-label">{formatDisplayDate(day.date)}</span>
                  </div>
                  {day.isToday ? <span className="today-chip">Today</span> : null}
                </div>

                <div className="metric-row" aria-label="Daily indicators">
                  <span className="metric-chip work-chip">
                    <span aria-hidden="true">◷</span>
                    {day.isFuture ? '—' : day.workLabel}
                  </span>
                  <span className="metric-chip coffee-chip">
                    <span aria-hidden="true">☕</span>
                    {day.isFuture ? '—' : day.coffeeLabel}
                  </span>
                </div>

                <div className="sprite-stage">
                  <PenguinSprite
                    mode={day.mode}
                    workBucket={day.workBucket}
                    coffeeBucket={day.coffeeBucket}
                    label={`${day.weekday}: ${specialText ?? `${day.workLabel}, ${day.coffeeLabel} coffees`}`}
                    isFuture={day.isFuture}
                  />
                </div>

                <div className="day-footer">
                  {specialText ? (
                    <span className="footer-status">{specialText}</span>
                  ) : day.isFuture ? (
                    <span className="footer-status muted">Upcoming</span>
                  ) : (
                    <>
                      <strong>{formatMinutes(day.netMinutes)}</strong>
                      <span>
                        {day.coffeeCount}{' '}
                        {day.coffeeCount === 1 ? 'coffee' : 'coffees'}
                        {day.isToday ? ' · so far' : ''}
                      </span>
                    </>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <div className="timeline-legend" aria-label="Timeline legend">
        <span><i className="legend-dot work-dot" /> Work</span>
        <span><i className="legend-dot coffee-dot" /> Coffee</span>
        <span><i className="legend-dot special-dot" /> Special state</span>
      </div>
    </section>
  )
}
