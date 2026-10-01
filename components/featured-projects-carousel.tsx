'use client'

import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRef } from 'react'

import ProjectCard from '@/components/project-card'
import type { PublicProject } from '@/types/public'

type Props = {
  projects: PublicProject[]
}

export default function FeaturedProjectsCarousel({
  projects,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scroll(direction: -1 | 1) {
    const track = trackRef.current
    if (!track) return

    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    track.scrollBy({
      left: direction * track.clientWidth * 0.82,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="featured-projects-carousel">
      {projects.length > 1 && (
        <div className="carousel-controls" aria-label="Featured projects carousel controls">
          <button
            type="button"
            onClick={() => scroll(-1)}
            aria-label="Previous featured projects"
          >
            <FontAwesomeIcon icon={faChevronLeft} aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => scroll(1)}
            aria-label="Next featured projects"
          >
            <FontAwesomeIcon icon={faChevronRight} aria-hidden="true" />
          </button>
        </div>
      )}

      <div
        ref={trackRef}
        className="featured-projects-track"
        role="region"
        tabIndex={0}
        aria-label="Featured projects"
      >
        {projects.map((project) => (
          <div className="featured-project-slide" key={project.slug}>
            <ProjectCard project={project} featured />
          </div>
        ))}
      </div>
    </div>
  )
}
