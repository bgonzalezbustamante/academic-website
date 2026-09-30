import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import Link from 'next/link'

import AcademicTrajectory from '@/components/academic-trajectory'

export const metadata: Metadata = {
  title: 'Academic trajectory',
  description:
    'Selected academic education, research, teaching, consultancy, and faculty appointments of Bastián González-Bustamante.',
  alternates: {
    canonical: '/trajectory',
  },
}

export default function TrajectoryPage() {
  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="trajectory-page-heading">
          <p className="eyebrow">Academic profile</p>
          <h1>Academic trajectory</h1>
          <p className="page-lead">
            A chronological view of the most relevant stages of my
            academic education, research, teaching, consultancy, and
            faculty appointments.
          </p>
        </div>

        <div className="trajectory-toolbar">
          <Link href="/">
            <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
            Home
          </Link>
        </div>

        <AcademicTrajectory />
      </div>
    </section>
  )
}
