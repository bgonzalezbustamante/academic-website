import {
  faArrowLeft,
  faShareNodes,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import Link from 'next/link'

import PublicationProfile from '@/components/publication-profile'
import { buildPublicationProfile } from '@/lib/publication-profile'
import { listPublicPapers } from '@/lib/publications'
import type { PublicPaper } from '@/types/public'

export const metadata: Metadata = {
  title: 'Publication profile',
  description:
    'Analytical profile of publications, citations, authorship, languages, and venues for Bastián González-Bustamante.',
  alternates: {
    canonical: '/publications/profile',
  },
}

export const revalidate = 300

export default async function PublicationProfilePage() {
  let papers: PublicPaper[] = []
  let available = true

  try {
    papers = await listPublicPapers()
  } catch {
    available = false
  }

  const profile = buildPublicationProfile(papers)

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="publication-profile-page-heading">
          <p className="eyebrow">Publications</p>
          <h1>Publication profile</h1>
          <p className="page-lead">
            An analytical view of publication output, citations,
            authorship, languages, and venues represented in my
            public research record.
          </p>
        </div>

        <div className="publication-profile-toolbar">
          <Link href="/publications">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Publications
          </Link>
          <Link href="/publications/coauthorship">
            <FontAwesomeIcon icon={faShareNodes} aria-hidden="true" />
            Co-authorship network
          </Link>
        </div>

        {!available ? (
          <div className="empty-state">
            <p>The publication record is temporarily unavailable.</p>
          </div>
        ) : papers.length === 0 ? (
          <div className="empty-state">
            <p>No public papers are currently available.</p>
          </div>
        ) : (
          <PublicationProfile profile={profile} />
        )}
      </div>
    </section>
  )
}
