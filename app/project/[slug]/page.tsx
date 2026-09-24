import {
  faArrowUpRightFromSquare,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import FormattedText from '@/components/formatted-text'
import {
  formatProjectStatus,
  formatProjectYears,
} from '@/components/project-card'
import ProjectCardVisual from '@/components/project-card-visual'
import PublicationCard from '@/components/publication-card'
import ResilientLocalImage from '@/components/resilient-local-image'
import TergapProjectMap from '@/components/tergap-project-map'
import { listPublicPapers } from '@/lib/publications'
import { getPublicProject } from '@/lib/projects'
import type { PublicPaper } from '@/types/public'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const project = await getPublicProject(slug)

  if (!project) return { title: 'Project not found' }

  const description =
    project.abstract || project.funder || 'Academic research project.'

  return {
    title: project.title,
    description,
    alternates: {
      canonical: `/project/${project.slug}`,
    },
    openGraph: {
      title: project.title,
      description,
      type: 'article',
    },
  }
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params
  const project = await getPublicProject(slug)

  if (!project) notFound()

  let associatedPublications: PublicPaper[] = []
  let publicationsAvailable = true

  if (project.publication_slugs.length > 0) {
    try {
      const publicPapers = await listPublicPapers()
      const papersBySlug = new Map(
        publicPapers.map((paper) => [paper.slug, paper])
      )

      associatedPublications = project.publication_slugs
        .map((paperSlug) => papersBySlug.get(paperSlug))
        .filter((paper): paper is PublicPaper => Boolean(paper))
    } catch {
      publicationsAvailable = false
    }
  }

  const years = formatProjectYears(project)
  const status = formatProjectStatus(project.status)
  const projectImage = project.project_image_filename
    ? `/projects/${project.slug}/${project.project_image_filename}`
    : null
  const isTergap =
    project.slug === 'terrorist-group-adaptation'
  const funderImage = project.funder_image_filename
    ? `/funders/${project.funder_image_filename}`
    : isTergap
      ? '/funders/erc-logo.png'
      : null

  return (
    <article className="page-section">
      <div className="site-shell narrow-shell project-detail">
        <p className="eyebrow">Project</p>
        {project.short_title && (
          <p className="project-detail-short-title">
            {project.short_title}
          </p>
        )}
        <h1>{project.title}</h1>

        <div className="metadata-tags project-detail-meta">
          {status && <span className="metadata-tag">{status}</span>}
          {years && <span className="metadata-tag">{years}</span>}
          {project.featured && (
            <span className="metadata-tag metadata-tag-accent">Featured</span>
          )}
        </div>

        {isTergap ? (
          <div className="project-detail-image project-detail-map">
            <TergapProjectMap />
          </div>
        ) : (
          <div
            className={
              projectImage
                ? 'project-detail-image'
                : 'project-detail-image project-detail-image-fallback'
            }
            aria-hidden="true"
          >
            {projectImage ? (
              <ProjectCardVisual
                funderImage={null}
                projectImage={projectImage}
              />
            ) : (
              <FontAwesomeIcon icon={faDiagramProject} />
            )}
          </div>
        )}

        <section className="project-detail-section">
          <h2>About the project</h2>
          <FormattedText
            className="project-abstract"
            text={project.abstract}
          />
        </section>

        {(project.funder || project.funder_note || project.url) && (
          <section className="project-detail-section project-funding-section">
            <div className="project-funding-content">
              <p className="eyebrow">Funding</p>

              {(project.funder || funderImage) && (
                <div className="project-detail-funder">
                  {funderImage && (
                    <ResilientLocalImage
                      src={funderImage}
                      alt={project.funder ? `${project.funder} logo` : 'Funder logo'}
                      width={150}
                      height={80}
                      sizes="150px"
                    />
                  )}

                  {project.funder && (
                    <strong>{project.funder}</strong>
                  )}
                </div>
              )}

              {project.funder_note && (
                <p className="project-funder-note">
                  {project.funder_note}
                </p>
              )}
            </div>

            {project.url && (
              <a
                className="project-external-link"
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
          </section>
        )}

        {project.publication_slugs.length > 0 && (
          <section className="project-detail-section">
            <div className="section-heading compact-heading">
              <div>
                <p className="eyebrow">Research outputs</p>
                <h2>Associated publications</h2>
              </div>
            </div>

            {!publicationsAvailable ? (
              <div className="empty-state">
                <p>Associated publications are temporarily unavailable.</p>
              </div>
            ) : associatedPublications.length > 0 ? (
              <div className="publication-list">
                {associatedPublications.map((paper) => (
                  <PublicationCard key={paper.slug} paper={paper} />
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No associated public publications are currently available.</p>
              </div>
            )}
          </section>
        )}
      </div>
    </article>
  )
}

