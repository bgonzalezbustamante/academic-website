import {
  firstAuthorPercentage,
  PROFILE_AUTHOR_NAME,
} from '@/lib/authorship'
import { publicationYearLabel } from '@/lib/publication-dates'
import type {
  PublicPaper,
  PublicPaperLanguage,
} from '@/types/public'

const PUBLICATION_INDEX_ORDER = [
  'WoS-SSCI',
  'Scopus',
  'WoS-ESCI',
  'Book chapter',
  'SciELO/Latindex',
  'Working paper',
  'Preprint',
] as const

const LANGUAGE_ORDER: PublicPaperLanguage[] = [
  'English',
  'Spanish',
  'Portuguese',
  'Dutch',
  'German',
  'French',
  'Italian',
]

export type ProfileCount = {
  label: string
  count: number
}

export type ProfileCitationPaper = {
  slug: string
  title: string
  citations: number
  capturedOn: string
}

export type PublicationProfile = {
  totalGoogleScholarCitations: number
  citationCoverage: number
  citationPaperCount: number
  latestCitationCapture: string | null
  distinctCoauthors: number
  averageAuthorsPerPaper: number
  publicationYears: number
  firstAuthorShare: number
  outputOverTime: ProfileCount[]
  publicationIndexes: ProfileCount[]
  languages: ProfileCount[]
  authorshipStructure: ProfileCount[]
  recurrentVenues: ProfileCount[]
  topCitedPapers: ProfileCitationPaper[]
}

function countByLabel(labels: string[]) {
  const counts = new Map<string, number>()

  for (const label of labels) {
    counts.set(label, (counts.get(label) ?? 0) + 1)
  }

  return counts
}

export function buildPublicationProfile(
  papers: PublicPaper[]
): PublicationProfile {
  const citationPapers = papers
    .filter(
      (
        paper
      ): paper is PublicPaper & {
        google_scholar_citations: number
        google_scholar_citations_captured_on: string
      } =>
        paper.google_scholar_citations !== null &&
        paper.google_scholar_citations_captured_on !== null
    )
    .map((paper) => ({
      slug: paper.slug,
      title: paper.title,
      citations: paper.google_scholar_citations,
      capturedOn: paper.google_scholar_citations_captured_on,
    }))

  const totalGoogleScholarCitations = citationPapers.reduce(
    (total, paper) => total + paper.citations,
    0
  )

  const coauthors = new Set(
    papers.flatMap((paper) =>
      paper.authors
        .map((author) => author.trim())
        .filter(
          (author) =>
            author.length > 0 &&
            author !== PROFILE_AUTHOR_NAME
        )
    )
  )

  const averageAuthorsPerPaper =
    papers.length === 0
      ? 0
      : papers.reduce(
          (total, paper) => total + paper.authors.length,
          0
        ) / papers.length

  const outputCounts = countByLabel(
    papers.map((paper) =>
      publicationYearLabel(paper.publication_date)
    )
  )

  const outputOverTime = Array.from(outputCounts.entries())
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => {
      if (a.label === 'Forthcoming') return 1
      if (b.label === 'Forthcoming') return -1
      return Number(a.label) - Number(b.label)
    })

  const publicationYears = outputOverTime.filter(
    (item) => item.label !== 'Forthcoming'
  ).length

  const indexCounts = countByLabel(
    papers.map(
      (paper) => paper.publication_index?.trim() || 'Unspecified'
    )
  )

  const publicationIndexes = [
    ...PUBLICATION_INDEX_ORDER.map((label) => ({
      label,
      count: indexCounts.get(label) ?? 0,
    })).filter((item) => item.count > 0),
    ...Array.from(indexCounts.entries())
      .filter(
        ([label]) =>
          label !== 'Unspecified' &&
          !PUBLICATION_INDEX_ORDER.includes(
            label as (typeof PUBLICATION_INDEX_ORDER)[number]
          )
      )
      .map(([label, count]) => ({ label, count }))
      .sort((a, b) => b.count - a.count || a.label.localeCompare(b.label)),
    ...(indexCounts.get('Unspecified')
      ? [
          {
            label: 'Unspecified',
            count: indexCounts.get('Unspecified') ?? 0,
          },
        ]
      : []),
  ]

  const languageCounts = countByLabel(
    papers.map((paper) => paper.language ?? 'Unspecified')
  )

  const languages = [
    ...LANGUAGE_ORDER.map((label) => ({
      label,
      count: languageCounts.get(label) ?? 0,
    })).filter((item) => item.count > 0),
    ...(languageCounts.get('Unspecified')
      ? [
          {
            label: 'Unspecified',
            count: languageCounts.get('Unspecified') ?? 0,
          },
        ]
      : []),
  ]

  const authorshipCounts = countByLabel(
    papers.map((paper) => {
      if (paper.authors.length <= 1) return 'Single author'
      if (paper.authors.length === 2) return '2 authors'
      if (paper.authors.length === 3) return '3 authors'
      return '4+ authors'
    })
  )

  const authorshipStructure = [
    'Single author',
    '2 authors',
    '3 authors',
    '4+ authors',
  ]
    .map((label) => ({
      label,
      count: authorshipCounts.get(label) ?? 0,
    }))
    .filter((item) => item.count > 0)

  const venueCounts = countByLabel(
    papers
      .map((paper) => paper.venue?.trim())
      .filter((venue): venue is string => Boolean(venue))
  )

  const recurrentVenues = Array.from(venueCounts.entries())
    .filter(([, count]) => count > 1)
    .map(([label, count]) => ({ label, count }))
    .sort(
      (a, b) =>
        b.count - a.count || a.label.localeCompare(b.label)
    )

  return {
    totalGoogleScholarCitations,
    citationCoverage: citationPapers.length,
    citationPaperCount: papers.length,
    latestCitationCapture:
      citationPapers
        .map((paper) => paper.capturedOn)
        .sort()
        .at(-1) ?? null,
    distinctCoauthors: coauthors.size,
    averageAuthorsPerPaper,
    publicationYears,
    firstAuthorShare: firstAuthorPercentage(papers),
    outputOverTime,
    publicationIndexes,
    languages,
    authorshipStructure,
    recurrentVenues,
    topCitedPapers: citationPapers
      .sort(
        (a, b) =>
          b.citations - a.citations ||
          a.title.localeCompare(b.title)
      )
      .slice(0, 10),
  }
}
