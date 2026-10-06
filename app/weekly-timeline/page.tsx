import { faCircleInfo } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'

import PageHomeLink from '@/components/page-home-link'
import WeeklyPenguinTimeline from '@/components/weekly-timeline/weekly-penguin-timeline'
import { getConfiguredSpecialDates } from '@/lib/weekly-timeline/special-dates'
import { getPublicAvailability } from '@/lib/weekly-timeline/availability'
import { getPublicConferencePresentations } from '@/lib/weekly-timeline/conferences'
import {
  buildTimelineWeeks,
  weekWindowForMonthRange,
  yearsForTimelineWindow,
  yearsForWorkAnalyticsWindow,
} from '@/lib/weekly-timeline/timeline'
import { getPublicTeachingSettings } from '@/lib/weekly-timeline/teaching-settings'
import { getPublicWorkAnalytics } from '@/lib/weekly-timeline/work-analytics'

import './weekly-timeline.css'

export const metadata: Metadata = {
  title: 'Weekly timeline',
  description:
    'Seven days of public working-time and coffee data represented by an interactive illustrated penguin timeline.',
  alternates: { canonical: '/weekly-timeline' },
}

export const dynamic = 'force-dynamic'

const TIME_ZONE = 'Europe/Amsterdam'
const PAST_MONTHS = 3
const FUTURE_MONTHS = 3

async function loadTimelineWindow(now: Date) {
  const { pastWeeks, futureWeeks } = weekWindowForMonthRange(
    now,
    TIME_ZONE,
    PAST_MONTHS,
    FUTURE_MONTHS
  )
  const calendarYears = yearsForTimelineWindow(
    now,
    TIME_ZONE,
    pastWeeks,
    futureWeeks
  )
  const analyticsYears = yearsForWorkAnalyticsWindow(
    now,
    TIME_ZONE,
    pastWeeks,
    futureWeeks
  )
  const latestAvailabilityYear = now.getUTCFullYear() + 5
  const availabilityYears = calendarYears.filter(
    (year) => year >= 2000 && year <= latestAvailabilityYear
  )

  try {
    const [
      analyticsResults,
      availabilityResults,
      conferences,
      teachingSettings,
    ] = await Promise.all([
      Promise.all(
        analyticsYears.map((year) => getPublicWorkAnalytics(year))
      ),
      Promise.all(
        availabilityYears.map((year) => getPublicAvailability(year))
      ),
      getPublicConferencePresentations(),
      getPublicTeachingSettings(),
    ])

    return {
      days: analyticsResults.flatMap((result) => result.days),
      availability: availabilityResults.flat(),
      conferences,
      teachingSeasonActive: teachingSettings.teaching_season_active,
      error: null,
      calendarYears,
      pastWeeks,
      futureWeeks,
    }
  } catch (error) {
    return {
      days: [],
      availability: [],
      conferences: [],
      teachingSeasonActive: false,
      error:
        error instanceof Error
          ? error.message
          : 'The Academic API could not be loaded.',
      calendarYears,
      pastWeeks,
      futureWeeks,
    }
  }
}


export default async function WeeklyTimelinePage() {
  const now = new Date()
  const {
    days,
    availability,
    conferences,
    teachingSeasonActive,
    error,
    calendarYears,
    pastWeeks,
    futureWeeks,
  } = await loadTimelineWindow(now)

  const weeks = error
    ? []
    : buildTimelineWeeks({
        now,
        days,
        specialDates: getConfiguredSpecialDates(
          calendarYears,
          availability,
          conferences
        ),
        teachingSeasonActive,
        timeZone: TIME_ZONE,
        pastWeeks,
        futureWeeks,
      })

  return (
    <section className="page-section weekly-timeline-page">
      <div className="site-shell">
        <div className="weekly-timeline-embed">
          {error ? (
            <section
              className="timeline-section"
              aria-labelledby="weekly-timeline-title"
            >
              <div className="section-heading">
                <p className="eyebrow">Seven-day view</p>
                <h1 id="weekly-timeline-title">Weekly timeline</h1>
              </div>
              <PageHomeLink />
              <div className="data-error" role="status">
                <strong>Live timeline unavailable.</strong>
                <span>Public timeline data could not be loaded. Please try again later.</span>
              </div>
            </section>
          ) : (
            <WeeklyPenguinTimeline weeks={weeks} />
          )}
        </div>
        <p className="weekly-timeline-source-note">
          <FontAwesomeIcon
            className="weekly-timeline-source-icon"
            icon={faCircleInfo}
            aria-hidden="true"
          />{' '}
          A reusable Next.js component that transforms seven days of public
          working-time and coffee data into an illustrated timeline.{' '}
          Further details at{' '}
          <a
            href="https://timeline.bgonzalezbustamante.com/"
            target="_blank"
            rel="noreferrer"
          >
            timeline.bgonzalezbustamante.com
          </a>.
        </p>
      </div>
    </section>
  )
}
