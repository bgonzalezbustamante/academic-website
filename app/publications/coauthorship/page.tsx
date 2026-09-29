import {
  faArrowLeft,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import Link from 'next/link'

import CoauthorshipNetwork from '@/components/coauthorship-network'
import {
  buildCoauthorshipGraph,
  COAUTHORSHIP_MIN_PUBLICATIONS,
} from '@/lib/coauthorship'
import { listPublicPapers } from '@/lib/publications'
import type { PublicPaper } from '@/types/public'

export const metadata: Metadata = {
  title: 'Co-authorship network',
  description:
    'Co-authorship network derived from the public publication record of Bastián González-Bustamante.',
  alternates: {
    canonical: '/publications/coauthorship',
  },
}

export const revalidate = 300

export default async function CoauthorshipPage() {
  let papers: PublicPaper[] = []
  let available = true

  try {
    papers = await listPublicPapers()
  } catch {
    available = false
  }

  const graph = buildCoauthorshipGraph(papers)
  const collaborators = graph.nodes.filter(
    (node) => !node.isProfile
  ).length

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="coauthorship-page-heading">
          <p className="eyebrow">Publications</p>
          <h1>Co-authorship network</h1>
          <p className="page-lead">
            Collaboration network derived from my public publication record.
          </p>
        </div>

        <div className="coauthorship-network-toolbar">
          <Link href="/publications">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Publications
          </Link>

          {available && (
            <p>
              {collaborators}{' '}
              {collaborators === 1 ? 'co-author' : 'co-authors'} ·{' '}
              {graph.edges.length}{' '}
              {graph.edges.length === 1 ? 'link' : 'links'}
            </p>
          )}
        </div>

        {!available ? (
          <div className="empty-state">
            <p>The publication record is temporarily unavailable.</p>
          </div>
        ) : (
          <>
            <CoauthorshipNetwork graph={graph} />

            <p className="coauthorship-method-note">
              <FontAwesomeIcon icon={faCircleInfo} aria-hidden="true" />
              <span>
                Co-authors are included after appearing on at least{' '}
                {COAUTHORSHIP_MIN_PUBLICATIONS} publications with me.
                Links then represent all co-authorship relationships among
                the resulting set of authors, based only on publications
                included on this website.
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
