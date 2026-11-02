/* eslint-disable @next/next/no-img-element -- Card visuals are WebP generated locally by scripts/build-images.mjs; Next.js image optimisation would re-encode them. */
import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import type { FigureImage, LogoImage } from '@/lib/local-images'

type Props = {
  funderImage: LogoImage | null
  projectImage: FigureImage | null
}

// Prefer the funder logo, then the project figure, then the project icon.
export default function ProjectCardVisual({
  funderImage,
  projectImage,
}: Props) {
  if (funderImage) {
    return (
      <img
        className="project-card-funder-image"
        src={funderImage.src}
        width={funderImage.width}
        height={funderImage.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  }

  if (projectImage) {
    return (
      <img
        className="project-card-project-image"
        src={projectImage.src}
        srcSet={projectImage.srcSet}
        sizes="(max-width: 760px) 100vw, 360px"
        width={projectImage.width}
        height={projectImage.height}
        alt=""
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <FontAwesomeIcon
      className="project-fallback-icon"
      icon={faDiagramProject}
      aria-hidden="true"
    />
  )
}
