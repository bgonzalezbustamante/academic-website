import {
  faBuildingColumns,
  faChalkboardUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'

import SectionPopulationProgress from '@/components/section-population-progress'
import TeachingPortfolioList from '@/components/teaching-portfolio-list'
import { teachingPopulationYears } from '@/lib/site-population'
import { listPublicTeaching } from '@/lib/teaching'
import type { PublicTeachingItem } from '@/types/public'

export const metadata: Metadata = {
  title: 'Teaching',
  description:
    'Teaching portfolio of Bastián González-Bustamante.',
  alternates: {
    canonical: '/teaching',
  },
}

export const revalidate = 300

export default async function TeachingPage() {
  let teaching: PublicTeachingItem[] = []
  let available = true

  try {
    teaching = await listPublicTeaching()
  } catch {
    available = false
  }

  const teachingCount = teaching.reduce(
    (total, item) => total + item.times_taught,
    0
  )

  const institutionCount = new Set(
    teaching
      .map((item) => item.institution.trim())
      .filter(Boolean)
  ).size

  const studentCount = teaching.reduce(
    (total, item) => total + item.student_count,
    0
  )

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="teaching-page-heading">
          <p className="eyebrow">Teaching portfolio</p>
          <h1>Teaching</h1>
          <p className="page-lead">
            Courses taught and supervision across undergraduate, postgraduate, and doctoral programmes.
          </p>
        </div>

        <SectionPopulationProgress
          domain="teaching"
          label="Teaching/Supervision"
          value={available ? teachingCount : null}
          unit="times taught"
          coveredYears={
            available
              ? teachingPopulationYears(teaching)
              : null
          }
        />

        {!available ? (
          <div className="empty-state">
            <p>Teaching information is temporarily unavailable.</p>
          </div>
        ) : teaching.length === 0 ? (
          <div className="empty-state">
            <p>No public teaching portfolio items are currently available.</p>
          </div>
        ) : (
          <>
            <section
              className="conference-stats-grid teaching-stats-grid"
              aria-label="Teaching summary"
            >
              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faChalkboardUser}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>Teaching/Supervision</p>
                  <strong>
                    {teachingCount.toLocaleString('en-GB')}
                  </strong>
                </div>
              </article>

              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faBuildingColumns}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>Institutions</p>
                  <strong>
                    {institutionCount.toLocaleString('en-GB')}
                  </strong>
                </div>
              </article>

              <article className="conference-stat-card">
                <div className="conference-stat-icon">
                  <FontAwesomeIcon
                    icon={faUsers}
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p>Students</p>
                  <strong>
                    {studentCount.toLocaleString('en-GB')}
                  </strong>
                </div>
              </article>
            </section>

            <TeachingPortfolioList teaching={teaching} />
          </>
        )}
      </div>
    </section>
  )
}
