'use client'

import { useRef, useState } from 'react'

import ProjectCard, {
  type ProjectCardData,
} from '@/components/project-card'

const PAGE_SIZE = 6

type Props = {
  projects: ProjectCardData[]
  hasFeatured: boolean
}

export default function ProjectPortfolioList({
  projects,
  hasFeatured,
}: Props) {
  const [page, setPage] = useState(1)
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const totalPages = Math.max(1, Math.ceil(projects.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const start = (currentPage - 1) * PAGE_SIZE
  const end = Math.min(start + PAGE_SIZE, projects.length)
  const visibleProjects = projects.slice(start, end)

  function goToPage(destination: number) {
    if (destination === currentPage) return

    setPage(Math.max(1, Math.min(destination, totalPages)))
    window.requestAnimationFrame(() => {
      const section = sectionRef.current
      if (section) {
        // Offset by the sticky header, which is taller when it wraps on mobile.
        const headerHeight =
          document
            .querySelector('.site-header')
            ?.getBoundingClientRect().height ?? 0
        const top =
          section.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          16

        window.scrollTo({ top: Math.max(0, top) })
      }

      headingRef.current?.focus({ preventScroll: true })
    })
  }

  function pagination(position: 'top' | 'bottom') {
    if (totalPages <= 1) return null

    return (
      <nav
        className={
          position === 'top'
            ? 'conference-pagination project-pagination-top'
            : 'conference-pagination'
        }
        aria-label={`Project portfolio pagination (${position})`}
      >
        <p aria-live={position === 'top' ? 'polite' : undefined}>
          Showing {start + 1}–{end} of {projects.length}{' '}
          {hasFeatured ? 'other projects' : 'projects'}
        </p>

        <div className="conference-pagination-controls project-pagination-controls">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(1)}
          >
            First
          </button>
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
          >
            Next
          </button>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => goToPage(totalPages)}
          >
            Last
          </button>
        </div>
      </nav>
    )
  }

  return (
    <section
      ref={sectionRef}
      className="project-group"
      aria-labelledby="project-portfolio-heading"
    >
      <div className="section-heading compact-heading">
        <div>
          <p className="eyebrow">
            {hasFeatured ? 'Portfolio' : 'Research portfolio'}
          </p>
          <h2 id="project-portfolio-heading" ref={headingRef} tabIndex={-1}>
            {hasFeatured ? 'Other projects' : 'Projects'}
          </h2>
        </div>
      </div>

      {pagination('top')}

      <div className="project-grid">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {pagination('bottom')}
    </section>
  )
}
