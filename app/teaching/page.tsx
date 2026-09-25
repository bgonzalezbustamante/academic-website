import {
  faBuildingColumns,
  faChalkboardUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'

import TeachingCard from '@/components/teaching-card'
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
            Courses taught across undergraduate, postgraduate, and doctoral
            programmes.
          </p>
        </div>

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
                  <p>Teaching</p>
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

            <div className="teaching-list">
              {teaching.map((item, index) => (
                <TeachingCard
                  key={
                    item.name +
                    '-' +
                    item.institution +
                    '-' +
                    (item.start_year ?? 'undated') +
                    '-' +
                    index
                  }
                  item={item}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
