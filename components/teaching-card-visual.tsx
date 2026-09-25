'use client'

import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useState } from 'react'

export default function TeachingCardVisual({
  filename,
}: {
  filename: string | null
}) {
  const [failed, setFailed] = useState(false)
  const src = filename ? `/teaching/${filename}` : null
  const isLossless =
    src?.toLowerCase().endsWith('.png') ?? false

  if (!src || failed) {
    return (
      <FontAwesomeIcon
        className="teaching-fallback-icon"
        icon={faGraduationCap}
        aria-hidden="true"
      />
    )
  }

  return (
    <Image
      className="teaching-card-image"
      src={src}
      alt=""
      width={720}
      height={440}
      sizes="(max-width: 760px) calc(100vw - 2rem), 320px"
      quality={isLossless ? undefined : 90}
      unoptimized={isLossless}
      onError={() => setFailed(true)}
    />
  )
}
