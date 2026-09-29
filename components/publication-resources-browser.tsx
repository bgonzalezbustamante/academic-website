'use client'

import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faDatabase,
  faDiagramProject,
  faFileLines,
  faFolderOpen,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import { useMemo, useState } from 'react'

import { publicationYearLabel } from '@/lib/publication-dates'
import type { PublicPaper } from '@/types/public'

type Props = {
  papers: PublicPaper[]
}

type ResourceType =
  | 'all'
  | 'code'
  | 'dataset'
  | 'si'
  | 'preprint'
  | 'project'

type ResourceLink = {
  type: Exclude<ResourceType, 'all'>
  label: string
  href: string
  icon: IconDefinition
}

const RESOURCE_OPTIONS: Array<{
  value: ResourceType
  label: string
}> = [
  { value: 'all', label: 'All resources' },
  { value: 'code', label: 'Code' },
  { value: 'dataset', label: 'Datasets' },
  { value: 'si', label: 'SI files' },
  { value: 'preprint', label: 'Preprints' },
  { value: 'project', label: 'Projects' },
]

function resourcesForPaper(
  paper: PublicPaper
): ResourceLink[] {
  const candidates = [
    {
      type: 'code' as const,
      label: 'Code',
      href: paper.github_url,
      icon: faGithub,
    },
    {
      type: 'dataset' as const,
      label: 'Dataset',
      href: paper.dataset_url,
      icon: faDatabase,
    },
    {
      type: 'si' as const,
      label: 'SI File',
      href: paper.si_file_url,
      icon: faPaperclip,
    },
    {
      type: 'preprint' as const,
      label: 'Preprint',
      href: paper.preprint_url,
      icon: faFileLines,
    },
    {
      type: 'project' as const,
      label: 'Project',
      href: paper.project_url,
      icon: faDiagramProject,
    },
  ]

  return candidates.flatMap((resource) =>
    resource.href
      ? [{ ...resource, href: resource.href }]
      : []
  )
}

export default function PublicationResourcesBrowser({
  papers,
}: Props) {
  const [resourceType, setResourceType] =
    useState<ResourceType>('all')

  const resourcePapers = useMemo(
    () =>
      papers
        .map((paper) => ({
          paper,
          resources: resourcesForPaper(paper),
        }))
        .filter(({ resources }) => resources.length > 0),
    [papers]
  )

  const filtered = useMemo(
    () =>
      resourceType === 'all'
        ? resourcePapers
        : resourcePapers.filter(({ resources }) =>
            resources.some(
              (resource) => resource.type === resourceType
            )
          ),
    [resourcePapers, resourceType]
  )

  const totalLinks = useMemo(
    () =>
      resourcePapers.reduce(
        (total, item) => total + item.resources.length,
        0
      ),
    [resourcePapers]
  )

  return (
    <>
      <section
        className="research-resource-stats"
        aria-label="Open research resource summary"
      >
        <article>
          <FontAwesomeIcon icon={faFolderOpen} aria-hidden="true" />
          <div>
            <p>Papers with resources</p>
            <strong>{resourcePapers.length}</strong>
          </div>
        </article>
        <article>
          <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />
          <div>
            <p>Resource links</p>
            <strong>{totalLinks}</strong>
          </div>
        </article>
        <article>
          <FontAwesomeIcon icon={faDatabase} aria-hidden="true" />
          <div>
            <p>Resource types</p>
            <strong>
              {
                RESOURCE_OPTIONS.filter(
                  (option) =>
                    option.value !== 'all' &&
                    resourcePapers.some(({ resources }) =>
                      resources.some(
                        (resource) =>
                          resource.type === option.value
                      )
                    )
                ).length
              }
            </strong>
          </div>
        </article>
      </section>

      <div className="research-resource-filter">
        <label>
          <span>Resource type</span>
          <select
            value={resourceType}
            onChange={(event) =>
              setResourceType(
                event.target.value as ResourceType
              )
            }
          >
            {RESOURCE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <p>
          {filtered.length}{' '}
          {filtered.length === 1
            ? 'publication'
            : 'publications'}
        </p>
      </div>

      {filtered.length > 0 ? (
        <div className="research-resource-list">
          {filtered.map(({ paper, resources }) => {
            const visibleResources =
              resourceType === 'all'
                ? resources
                : resources.filter(
                    (resource) =>
                      resource.type === resourceType
                  )

            return (
              <article
                className="research-resource-card"
                key={paper.slug}
              >
                <div className="metadata-tags">
                  <span className="metadata-tag">
                    {publicationYearLabel(
                      paper.publication_date
                    )}
                  </span>
                  {paper.publication_index && (
                    <span className="metadata-tag">
                      {paper.publication_index}
                    </span>
                  )}
                </div>

                <h2>
                  <Link href={`/publication/${paper.slug}`}>
                    {paper.title}
                  </Link>
                </h2>

                {paper.venue && (
                  <p className="research-resource-venue">
                    {paper.venue}
                  </p>
                )}

                <div
                  className="research-resource-links"
                  aria-label={`Open research resources for ${paper.title}`}
                >
                  {visibleResources.map((resource) => (
                    <a
                      key={`${resource.type}-${resource.href}`}
                      href={resource.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FontAwesomeIcon
                        icon={resource.icon}
                        aria-hidden="true"
                      />
                      <span>{resource.label}</span>
                    </a>
                  ))}
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="empty-state">
          <p>No publications match the selected resource type.</p>
        </div>
      )}
    </>
  )
}
