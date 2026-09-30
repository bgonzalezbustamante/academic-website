'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

type Props = Omit<ImageProps, 'alt' | 'onError'> & {
  alt: string
}

export default function ResilientLocalImage({
  alt,
  ...props
}: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setFailed(true)}
    />
  )
}
