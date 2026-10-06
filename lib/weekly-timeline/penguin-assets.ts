// Penguin WebP assets are served by the standalone timeline at its stable published URLs.
// Their artwork licence is CC BY-NC 4.0; see NOTICE.
import type {
  CoffeeBucket,
  PenguinMode,
  WorkBucket,
} from '@/types/weekly-timeline'

export const WORK_BUCKETS: WorkBucket[] = [
  'zero',
  'light',
  'normal',
  'heavy',
  'very-heavy',
  'extreme',
]

export const COFFEE_BUCKETS: CoffeeBucket[] = [
  'zero',
  'light',
  'normal',
  'heavy',
  'very-heavy',
  'extreme',
]

const SPECIAL_ASSETS: Partial<Record<PenguinMode, string>> = {
  sunday: 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/sunday.webp',
  'winter-holiday': 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/winter-holiday.webp',
  'summer-holiday': 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/summer-holiday.webp',
  trip: 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/trip.webp',
  conference: 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/conference.webp',
  sick: 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/sick.webp',
  unavailable: 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/sick.webp',
}

export function resolvePenguinAsset({
  mode,
  workBucket,
  coffeeBucket,
}: {
  mode: PenguinMode
  workBucket: WorkBucket
  coffeeBucket: CoffeeBucket
}) {
  if (mode === 'saturday') {
    return 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/canonical-couple.webp'
  }

  if (mode === 'teaching') {
    return 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/teaching.webp'
  }

  if (mode === 'working-day') {
    return 'https://timeline.bgonzalezbustamante.com/penguins/states/webp/working-day.webp'
  }

  if (mode === 'upcoming') {
    return 'https://timeline.bgonzalezbustamante.com/penguins/canonical-baseline.webp'
  }

  const specialAsset = SPECIAL_ASSETS[mode]
  if (specialAsset) {
    return specialAsset
  }

  if (workBucket === 'zero' && coffeeBucket === 'zero') {
    return 'https://timeline.bgonzalezbustamante.com/penguins/canonical-baseline.webp'
  }

  return `https://timeline.bgonzalezbustamante.com/penguins/states/webp/work-${workBucket}__coffee-${coffeeBucket}.webp`
}
