'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'

type Props = Omit<ImageProps, 'onError'>

export default function ResilientLocalImage(props: Props) {
  const [failed, setFailed] = useState(false)

  if (failed) return null

  return (
    <Image
      {...props}
      onError={() => setFailed(true)}
    />
  )
}
