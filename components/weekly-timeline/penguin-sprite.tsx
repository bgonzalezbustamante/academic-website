import Image from 'next/image'

import { resolvePenguinAsset } from '@/lib/weekly-timeline/penguin-assets'
import type {
  CoffeeBucket,
  PenguinMode,
  WorkBucket,
} from '@/types/weekly-timeline'

type Props = {
  mode: PenguinMode
  workBucket: WorkBucket
  coffeeBucket: CoffeeBucket
  label: string
  isFuture?: boolean
  large?: boolean
}

export default function PenguinSprite({
  mode,
  workBucket,
  coffeeBucket,
  label,
  isFuture = false,
  large = false,
}: Props) {
  const src = resolvePenguinAsset({
    mode,
    workBucket,
    coffeeBucket,
  })

  return (
    <span
      className={[
        'penguin-sprite',
        large ? 'penguin-sprite-large' : '',
        isFuture || mode === 'upcoming' ? 'is-upcoming' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Image
        className="penguin-state-image"
        src={src}
        alt={label}
        fill
        unoptimized
        sizes={large ? '(max-width: 760px) 280px, 350px' : '188px'}
      />
    </span>
  )
}
