import { normalizeAuthors, PROFILE_AUTHOR_NAME } from '@/lib/authorship'
import type { PublicPaper } from '@/types/public'

export const COAUTHORSHIP_MAX_AUTHORS = 5

export type CoauthorshipNode = {
  id: string
  name: string
  isProfile: boolean
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

export function buildCoauthorshipGraph(
  papers: PublicPaper[]
): CoauthorshipGraph {
  const includedPapers = papers
    .map((paper) => ({
      paper,
      authors: normalizeAuthors(paper.authors),
    }))
    .filter(
      ({ authors }) =>
        authors.length > 0 &&
        authors.length <= COAUTHORSHIP_MAX_AUTHORS
    )

  const publicationCounts = new Map<string, number>()
  const edges = new Map<string, CoauthorshipEdge>()

  for (const { authors } of includedPapers) {
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

  const nodes = Array.from(publicationCounts.entries())
    .map(([author, publicationCount]) => ({
      id: author,
      name: author,
      isProfile: author === PROFILE_AUTHOR_NAME,
      publicationCount,
    }))
    .sort((a, b) => {
      if (a.isProfile) return -1
      if (b.isProfile) return 1

      return (
        b.publicationCount - a.publicationCount ||
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
    includedPaperCount: includedPapers.length,
  }
}
