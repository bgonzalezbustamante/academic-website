import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/json-ld'
import ProjectCard from '@/components/project-card'
import PublicationKeyHighlight from '@/components/publication-key-highlight'
import PublicationLanguageFlag from '@/components/publication-language-flag'
import ResearchMarkdownEnhancer from '@/components/research-markdown-enhancer'
import PublicationLinks from '@/components/publication-links'
import {
  formatPublicationMonthYear,
  isForthcomingPublicationDate,
} from '@/lib/publication-dates'
import { doiFromUrl, plainSummary } from '@/lib/plain-text'
import { getPublicPaper } from '@/lib/publications'
import {
  listPublicProjects,
  orderPublicProjects,
} from '@/lib/projects'
import { getAbsoluteSiteUrl } from '@/lib/site-url'
import type { PublicPaperDetail, PublicProject } from '@/types/public'

type Props = {
  params: Promise<{ slug: string }>
}

export const revalidate = 300

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const paper = await getPublicPaper(slug)

  if (!paper) return { title: 'Publication not found' }

  const description = paper.abstract
    ? plainSummary(paper.abstract)
    : paper.venue ?? 'Academic publication.'

  return {
    title: paper.title,
    description,
    alternates: {
      canonical: `/publication/${paper.slug}`,
    },
    openGraph: {
      title: paper.title,
      description,
      type: 'article',
      siteName: 'Bastián González-Bustamante',
      locale: 'en_GB',
      // A page-level openGraph replaces the inherited one, so restate the default card.
      images: ['/opengraph-image'],
    },
    other: scholarCitationMeta(paper),
  }
}

// Google Scholar reads these Highwire-style tags from publication pages.
function scholarCitationMeta(paper: PublicPaperDetail) {
  const meta: Record<string, string | string[]> = {
    citation_title: paper.title,
    citation_abstract_html_url: getAbsoluteSiteUrl(
      `/publication/${paper.slug}`
    ),
  }
  const date = scholarPublicationDate(paper.publication_date)
  const doi = doiFromUrl(paper.doi_url ?? paper.publication_url)

  if (paper.authors.length > 0) meta.citation_author = paper.authors
  if (date) meta.citation_publication_date = date
  if (paper.venue) meta.citation_journal_title = paper.venue
  if (doi) meta.citation_doi = doi
  if (paper.language) meta.citation_language = paper.language

  return meta
}

// Scholar expects YYYY/MM/DD; forthcoming papers give only their year.
function scholarPublicationDate(date: string | null) {
  const value = date?.slice(0, 10)
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null

  return isForthcomingPublicationDate(value)
    ? value.slice(0, 4)
    : value.replaceAll('-', '/')
}

function scholarlyArticleJsonLd(paper: PublicPaperDetail) {
  const url = getAbsoluteSiteUrl(`/publication/${paper.slug}`)
  const doi = doiFromUrl(paper.doi_url ?? paper.publication_url)
  const date = paper.publication_date?.slice(0, 10)

  return {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    '@id': url,
    url,
    headline: paper.title,
    name: paper.title,
    author: paper.authors.map((name) => ({ '@type': 'Person', name })),
    ...(date && !isForthcomingPublicationDate(date)
      ? { datePublished: date }
      : {}),
    ...(paper.venue
      ? { isPartOf: { '@type': 'Periodical', name: paper.venue } }
      : {}),
    ...(paper.abstract
      ? { abstract: plainSummary(paper.abstract, 5000) }
      : {}),
    ...(paper.language ? { inLanguage: paper.language } : {}),
    ...(doi ? { sameAs: `https://doi.org/${doi}` } : {}),
  }
}

export default async function PublicationPage({ params }: Props) {
  const { slug } = await params
  const paper = await getPublicPaper(slug)

  if (!paper) notFound()

  let associatedProjects: PublicProject[] = []

  try {
    associatedProjects = orderPublicProjects(
      (await listPublicProjects()).filter((project) =>
        project.publication_slugs.includes(paper.slug)
      )
    )
  } catch {
    associatedProjects = []
  }

  const publicationMonthYear =
    formatPublicationMonthYear(paper.publication_date)
  const publicationYear =
    paper.publication_date?.slice(0, 4) ?? null
  const forthcoming = isForthcomingPublicationDate(
    paper.publication_date
  )

  return (
    <article className="page-section">
      <div className="site-shell narrow-shell publication-detail">
        <p className="eyebrow">Publication</p>
        <h1>{paper.title}</h1>

        {paper.authors.length > 0 && (
          <p className="authors detail-authors">
            {paper.authors.join(', ')}
          </p>
        )}

        {paper.venue && (
          <p className="venue detail-venue">{paper.venue}</p>
        )}

        <div className="publication-detail-meta">
          {(paper.publication_date || forthcoming) && (
            <span>
              {forthcoming
                ? publicationYear
                  ? `Forthcoming · ${publicationYear}`
                  : 'Forthcoming'
                : `Published ${publicationMonthYear}`}
            </span>
          )}
          {paper.publication_index && (
            <span>{paper.publication_index}</span>
          )}
          {paper.language && (
            <PublicationLanguageFlag language={paper.language} />
          )}
        </div>

        <PublicationLinks paper={paper} />

        {paper.abstract && (
          <section className="abstract-section">
            <h2>Abstract</h2>
            <p className="research-markdown-source abstract-markdown-source">
              {paper.abstract}
            </p>
          </section>
        )}

        <PublicationKeyHighlight paper={paper} />

        {associatedProjects.length > 0 && (
          <section className="publication-associated-projects">
            <h2>
              {associatedProjects.length === 1
                ? 'Associated project'
                : 'Associated projects'}
            </h2>

            <div className="publication-associated-project-grid">
              {associatedProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                />
              ))}
            </div>
          </section>
        )}

        <ResearchMarkdownEnhancer />
      </div>
      <JsonLd data={scholarlyArticleJsonLd(paper)} />
    </article>
  )
}
