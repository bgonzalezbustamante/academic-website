/* eslint-disable @next/next/no-img-element -- Teaching logos are WebP generated locally by scripts/build-images.mjs; Next.js image optimisation would re-encode them. */
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { logoImage } from '@/lib/local-images'

export default function TeachingCardVisual({
  filename,
}: {
  filename: string | null
}) {
  const image = logoImage(filename)

  if (!image) {
    return (
      <FontAwesomeIcon
        className="teaching-fallback-icon"
        icon={faGraduationCap}
        aria-hidden="true"
      />
    )
  }

  return (
    <img
      className="teaching-card-image"
      src={image.src}
      width={image.width}
      height={image.height}
      alt=""
      loading="lazy"
      decoding="async"
    />
  )
}
