/* eslint-disable @next/next/no-img-element -- Project figures and funder logos are WebP generated locally by scripts/build-images.mjs; Next.js image optimisation would re-encode them. */
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
import TergapProjectMap from '@/components/tergap-project-map'
import { figureImage, logoImage } from '@/lib/local-images'
import { plainSummary } from '@/lib/plain-text'
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

  const description = project.abstract
    ? plainSummary(project.abstract)
    : project.funder || 'Academic research project.'

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
      siteName: 'Bastián González-Bustamante',
      locale: 'en_GB',
      // A page-level openGraph replaces the inherited one, so restate the default card.
      images: ['/opengraph-image'],
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
  const projectImage = figureImage(
    'projects',
    project.slug,
    project.project_image_filename
  )
  const isTergap =
    project.slug === 'terrorist-group-adaptation'
  const funderImage = logoImage(
    project.funder_image_filename ??
      (isTergap ? 'erc-logo.png' : null)
  )

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
              <img
                src={projectImage.src}
                srcSet={projectImage.srcSet}
                sizes="(max-width: 932px) calc(100vw - 2rem), 900px"
                width={projectImage.width}
                height={projectImage.height}
                alt={`${project.short_title || project.title} project visual`}
                decoding="async"
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
                    <img
                      src={funderImage.src}
                      width={funderImage.width}
                      height={funderImage.height}
                      alt={project.funder ? `${project.funder} logo` : 'Funder logo'}
                      loading="lazy"
                      decoding="async"
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

