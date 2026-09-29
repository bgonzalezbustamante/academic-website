import {
  faArrowLeft,
  faChartColumn,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import Link from 'next/link'

import CoauthorshipNetwork from '@/components/coauthorship-network'
import {
  buildCoauthorshipGraph,
  COAUTHORSHIP_MAX_AUTHORS,
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

          <Link href="/publications/profile">
            <FontAwesomeIcon
              icon={faChartColumn}
              aria-hidden="true"
            />
            Publication profile
          </Link>
        </div>

        {!available ? (
          <div className="empty-state">
            <p>The publication record is temporarily unavailable.</p>
          </div>
        ) : (
          <>
            <CoauthorshipNetwork graph={graph} />

            <p className="coauthorship-method-note">
              <span>
                <FontAwesomeIcon
                  icon={faCircleInfo}
                  aria-hidden="true"
                />
                Publications with more than{' '}
                {COAUTHORSHIP_MAX_AUTHORS} authors are excluded. The
                network then includes every author and co-authorship
                relationship appearing in the remaining publications on
                this website. For layout only, weighted collaborator
                communities are detected after removing the central profile
                links and are spatially separated to make collaboration
                clusters easier to distinguish. Repeated co-authorship
                shortens the preferred distance between connected authors,
                while a final collision pass enforces additional node and
                label-aware spacing.
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
