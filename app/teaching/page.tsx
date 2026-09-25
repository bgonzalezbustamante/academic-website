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
          <div className="teaching-list">
            {teaching.map((item, index) => (
              <TeachingCard
                key={`${item.name}-${item.institution}-${item.start_year ?? 'undated'}-${index}`}
                item={item}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
