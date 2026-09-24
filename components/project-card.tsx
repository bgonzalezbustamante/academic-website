import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import ProjectCardVisual from '@/components/project-card-visual'
import type { PublicProject } from '@/types/public'

type Props = {
  project: PublicProject
  featured?: boolean
}

export function formatProjectYears(project: PublicProject) {
  const { start_year: start, end_year: end } = project

  if (start && end) {
    return start === end ? String(start) : `${start}–${end}`
  }

  if (start) return `From ${start}`
  if (end) return `Until ${end}`
  return null
}

export function formatProjectStatus(status: string) {
  if (!status) return null

  return status.charAt(0).toUpperCase() + status.slice(1)
}

export default function ProjectCard({
  project,
  featured = false,
}: Props) {
  const years = formatProjectYears(project)
  const status = formatProjectStatus(project.status)
  const projectImage = project.project_image_filename
    ? `/projects/${project.slug}/${project.project_image_filename}`
    : null
  const funderImage = project.funder_image_filename
    ? `/funders/${project.funder_image_filename}`
    : null

  return (
    <article
      className={
        featured
          ? 'project-card featured-project-card'
          : 'project-card'
      }
    >
      <div className="project-card-visual" aria-hidden="true">
        <ProjectCardVisual
          funderImage={funderImage}
          projectImage={projectImage}
        />
      </div>

      <div className="project-card-content">
        <div className="metadata-tags project-meta">
          {status && <span className="metadata-tag">{status}</span>}
          {years && <span className="metadata-tag">{years}</span>}
          {(featured || project.featured) && (
            <span className="metadata-tag metadata-tag-accent">Featured</span>
          )}
        </div>

        {project.short_title && (
          <p className="project-short-title">{project.short_title}</p>
        )}

        <h2>
          <Link href={`/project/${project.slug}`}>
            {project.title}
          </Link>
        </h2>

        {project.funder && (
          <p className="project-funder">{project.funder}</p>
        )}

        <div className="project-card-links">
          <Link href={`/project/${project.slug}`}>
            Project details
          </Link>

          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
            >
              Project website
              <FontAwesomeIcon
                icon={faArrowUpRightFromSquare}
                aria-hidden="true"
              />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
