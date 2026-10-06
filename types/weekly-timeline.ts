export type WorkBucket =
  | 'zero'
  | 'light'
  | 'normal'
  | 'heavy'
  | 'very-heavy'
  | 'extreme'

export type CoffeeBucket =
  | 'zero'
  | 'light'
  | 'normal'
  | 'heavy'
  | 'very-heavy'
  | 'extreme'

export type SpecialDayType =
  | 'sunday'
  | 'winter-holiday'
  | 'summer-holiday'
  | 'trip'
  | 'conference'
  | 'sick'
  | 'unavailable'

export type SpecialDate =
  | {
      date: string
      type: SpecialDayType
      label?: string
    }
  | {
      from: string
      to: string
      type: SpecialDayType
      label?: string
    }

export type PublicAvailabilityType =
  | 'winter_holiday'
  | 'summer_holiday'
  | 'trip'
  | 'unavailable'

export type PublicAvailabilityItem = {
  type: PublicAvailabilityType
  start_date: string
  end_date: string
  label: string
}

export type ConferencePresentationType =
  | 'Conference paper'
  | 'Keynote'
  | 'Workshop'

export type PublicConferencePresentation = {
  event_name: string
  event_short_name: string
  location: string | null
  presentation_date: string
  start_date: string
  end_date: string
  personal_attendance: boolean
  involves_trip: boolean
  presentation_title: string | null
  authors: string[]
  presentation_type: ConferencePresentationType
  url: string | null
}

export type PublicTeachingSettings = {
  teaching_season_active: boolean
}

export type PublicWorkDay = {
  date: string
  net_minutes: number
  coffee_count: number
}

export type PublicWorkAnalytics = {
  year: number
  average_net_minutes_per_working_day: number
  average_coffees_per_working_day: number
  days: PublicWorkDay[]
}

export type PenguinMode =
  | 'activity'
  | 'working-day'
  | 'saturday'
  | 'teaching'
  | 'sunday'
  | 'winter-holiday'
  | 'summer-holiday'
  | 'trip'
  | 'conference'
  | 'sick'
  | 'unavailable'
  | 'upcoming'

export type TimelineDay = {
  date: string
  weekday: string
  dayNumber: number
  isToday: boolean
  isFuture: boolean
  netMinutes: number
  coffeeCount: number
  workBucket: WorkBucket
  coffeeBucket: CoffeeBucket
  workLabel: string
  coffeeLabel: string
  mode: PenguinMode
  specialLabel: string | null
}


export type TimelineWeek = {
  offset: number
  startDate: string
  endDate: string
  isCurrentWeek: boolean
  days: TimelineDay[]
}
