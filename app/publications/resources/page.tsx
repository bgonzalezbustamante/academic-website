import {
  faArrowLeft,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import Link from 'next/link'

import PublicationResourcesBrowser from '@/components/publication-resources-browser'
import { listPublicPapers } from '@/lib/publications'
import type { PublicPaper } from '@/types/public'

export const metadata: Metadata = {
  title: 'Open research resources',
  description:
    'Code, datasets, supplementary information, preprints, and project links associated with the public publication record of Bastián González-Bustamante.',
  alternates: {
    canonical: '/publications/resources',
  },
}

export const revalidate = 300

export default async function PublicationResourcesPage() {
  let papers: PublicPaper[] = []
  let available = true

  try {
    papers = await listPublicPapers()
  } catch {
    available = false
  }

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="research-resources-page-heading">
          <p className="eyebrow">Publications</p>
          <h1>Open research resources</h1>
          <p className="page-lead">
            Code, datasets, supplementary information, preprints,
            and project links associated with my public publication
            record.
          </p>
        </div>

        <div className="research-resources-toolbar">
          <Link href="/publications">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Publications
          </Link>
        </div>

        {!available ? (
          <div className="empty-state">
            <p>The publication record is temporarily unavailable.</p>
          </div>
        ) : (
          <>
            <PublicationResourcesBrowser papers={papers} />

            <p className="research-resources-note">
              <FontAwesomeIcon
                icon={faCircleInfo}
                aria-hidden="true"
              />
              <span>
                This catalogue includes only resources explicitly
                linked to publications in the public Research
                Dashboard record.
              </span>
            </p>
          </>
        )}
      </div>
    </section>
  )
}
