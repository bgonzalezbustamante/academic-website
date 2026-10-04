import type { Metadata } from 'next'

import SoftwareCard from '@/components/software-card'
import { listPublicSoftware } from '@/lib/software'
import type { PublicSoftwareItem } from '@/types/public'

export const metadata: Metadata = {
  title: 'Software Ecosystem',
  description:
    'Public software, applications, websites, packages and reusable tools developed or maintained by Bastián González-Bustamante.',
  alternates: {
    canonical: '/software',
  },
}

export const revalidate = 300

export default async function SoftwarePage() {
  let software: PublicSoftwareItem[] = []
  let available = true

  try {
    software = await listPublicSoftware()
  } catch {
    available = false
  }

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="software-page-heading">
          <p className="eyebrow">Development</p>
          <h1>Software Ecosystem</h1>
          <p className="page-lead">
            Applications, websites, packages, utilities and reusable tools
            represented in my public software portfolio.
          </p>
        </div>

        {!available ? (
          <div className="empty-state">
            <p>The software record is temporarily unavailable.</p>
          </div>
        ) : software.length === 0 ? (
          <div className="empty-state">
            <p>No public software profiles are currently available.</p>
          </div>
        ) : (
          <div className="software-grid">
            {software.map((item) => (
              <SoftwareCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
