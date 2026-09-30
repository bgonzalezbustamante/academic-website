import {
  faArrowUpRightFromSquare,
  faCircleInfo,
  faDiagramProject,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import ConferenceOverviewTable from '@/components/conference-overview-table'
import {
  formatProjectStatus,
  formatProjectYears,
} from '@/components/project-card'
import PublicationCard from '@/components/publication-card'
import ResearchMarkdownEnhancer from '@/components/research-markdown-enhancer'
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
  const projectImageIsLossless =
    projectImage?.toLowerCase().endsWith('.png') ?? false
  const isTergap =
    project.slug === 'terrorist-group-adaptation'
  const funderImage = project.funder_image_filename
    ? `/funders/${project.funder_image_filename}`
    : isTergap
      ? '/funders/erc-logo.png'
      : null
  const funderImageIsLossless =
    funderImage?.toLowerCase().endsWith('.png') ?? false

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

        <section className="project-detail-section">
          <h2>About the project</h2>
          <p className="project-abstract research-markdown-source">
            {project.abstract}
          </p>
        </section>

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
          >
            {projectImage ? (
              <ResilientLocalImage
                src={projectImage}
                alt={`${project.short_title || project.title} project visual`}
                width={1800}
                height={1100}
                sizes="(max-width: 932px) calc(100vw - 2rem), 900px"
                quality={projectImageIsLossless ? undefined : 90}
                unoptimized={projectImageIsLossless}
              />
            ) : (
              <FontAwesomeIcon
                icon={faDiagramProject}
                aria-hidden="true"
              />
            )}
          </div>
        )}

        {(project.publication_slugs.length > 0 ||
          project.conference_presentations.length > 0) && (
          <section className="project-detail-section project-outputs-section">
            <h2>Research outputs</h2>

            {project.publication_slugs.length > 0 && (
              <div className="project-output-group">
                <h3>Associated publications</h3>

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
              </div>
            )}

            {project.conference_presentations.length > 0 && (
              <div className="project-output-group">
                <h3>Conference presentations</h3>
                <ConferenceOverviewTable
                  presentations={project.conference_presentations}
                />
              </div>
            )}

            <p className="project-outputs-note">
              <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
              <span>
                These are the project&apos;s research outputs in which I am
                involved; the project may have additional outputs.
              </span>
            </p>
          </section>
        )}

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
                      quality={funderImageIsLossless ? undefined : 90}
                      unoptimized={funderImageIsLossless}
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

        <ResearchMarkdownEnhancer />
      </div>
    </article>
  )
}

