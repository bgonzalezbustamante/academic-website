import { PROFILE_AUTHOR_NAME } from '@/lib/authorship'
import type { PublicPaper } from '@/types/public'

export const COAUTHORSHIP_MIN_PUBLICATIONS = 2

export type CoauthorshipNode = {
  id: string
  name: string
  isProfile: boolean
  publicationsWithProfile: number
  publicationCount: number
}

export type CoauthorshipEdge = {
  source: string
  target: string
  weight: number
}

export type CoauthorshipGraph = {
  nodes: CoauthorshipNode[]
  edges: CoauthorshipEdge[]
  includedPaperCount: number
}

function uniqueAuthors(authors: string[]) {
  return Array.from(
    new Set(
      authors
        .map((author) => author.trim())
        .filter(Boolean)
    )
  )
}

export function buildCoauthorshipGraph(
  papers: PublicPaper[]
): CoauthorshipGraph {
  const publicationsWithProfile = new Map<string, number>()

  for (const paper of papers) {
    const authors = uniqueAuthors(paper.authors)

    if (!authors.includes(PROFILE_AUTHOR_NAME)) continue

    for (const author of authors) {
      if (author === PROFILE_AUTHOR_NAME) continue

      publicationsWithProfile.set(
        author,
        (publicationsWithProfile.get(author) ?? 0) + 1
      )
    }
  }

  const retainedAuthors = new Set<string>([
    PROFILE_AUTHOR_NAME,
    ...Array.from(publicationsWithProfile.entries())
      .filter(
        ([, count]) => count >= COAUTHORSHIP_MIN_PUBLICATIONS
      )
      .map(([author]) => author),
  ])

  const publicationCounts = new Map<string, number>()
  const edges = new Map<string, CoauthorshipEdge>()
  let includedPaperCount = 0

  for (const paper of papers) {
    const authors = uniqueAuthors(paper.authors).filter((author) =>
      retainedAuthors.has(author)
    )

    if (authors.length === 0) continue

    includedPaperCount += 1

    for (const author of authors) {
      publicationCounts.set(
        author,
        (publicationCounts.get(author) ?? 0) + 1
      )
    }

    for (let i = 0; i < authors.length; i += 1) {
      for (let j = i + 1; j < authors.length; j += 1) {
        const pair = [authors[i], authors[j]].sort()
        const key = pair.join('\u0000')
        const existing = edges.get(key)

        if (existing) {
          existing.weight += 1
        } else {
          edges.set(key, {
            source: pair[0],
            target: pair[1],
            weight: 1,
          })
        }
      }
    }
  }

  const nodes = Array.from(retainedAuthors)
    .filter(
      (author) =>
        author === PROFILE_AUTHOR_NAME ||
        (publicationsWithProfile.get(author) ?? 0) >=
          COAUTHORSHIP_MIN_PUBLICATIONS
    )
    .map((author) => ({
      id: author,
      name: author,
      isProfile: author === PROFILE_AUTHOR_NAME,
      publicationsWithProfile:
        author === PROFILE_AUTHOR_NAME
          ? papers.filter((paper) =>
              uniqueAuthors(paper.authors).includes(
                PROFILE_AUTHOR_NAME
              )
            ).length
          : publicationsWithProfile.get(author) ?? 0,
      publicationCount: publicationCounts.get(author) ?? 0,
    }))
    .sort((a, b) => {
      if (a.isProfile) return -1
      if (b.isProfile) return 1

      return (
        b.publicationsWithProfile - a.publicationsWithProfile ||
        a.name.localeCompare(b.name)
      )
    })

  return {
    nodes,
    edges: Array.from(edges.values()).sort(
      (a, b) =>
        b.weight - a.weight ||
        a.source.localeCompare(b.source) ||
        a.target.localeCompare(b.target)
    ),
    includedPaperCount,
  }
}
