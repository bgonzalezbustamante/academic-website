'use client'

import { faDiagramProject } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type Props = {
  funderImage: string | null
  projectImage: string | null
}

export default function ProjectCardVisual({
  funderImage,
  projectImage,
}: Props) {
  const candidates = useMemo(
    () =>
      [
        funderImage
          ? { src: funderImage, kind: 'funder' as const }
          : null,
        projectImage
          ? { src: projectImage, kind: 'project' as const }
          : null,
      ].filter(
        (
          candidate
        ): candidate is {
          src: string
          kind: 'funder' | 'project'
        } => Boolean(candidate)
      ),
    [funderImage, projectImage]
  )

  const [index, setIndex] = useState(0)
  const current = candidates[index]

  if (!current) {
    return (
      <FontAwesomeIcon
        className="project-fallback-icon"
        icon={faDiagramProject}
        aria-hidden="true"
      />
    )
  }

  return (
    <Image
      className={
        current.kind === 'funder'
          ? 'project-card-funder-image'
          : 'project-card-project-image'
      }
      src={current.src}
      alt=""
      width={720}
      height={440}
      sizes="(max-width: 760px) 100vw, 360px"
      onError={() => setIndex((value) => value + 1)}
    />
  )
}
