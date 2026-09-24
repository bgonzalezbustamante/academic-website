import Link from 'next/link'

import PublicationCard from '@/components/publication-card'
import { siteProfile } from '@/content/site'
import { listPublicPapers } from '@/lib/publications'
import type { PublicPaper } from '@/types/public'

export const revalidate = 300

export default async function HomePage() {
  let featured: PublicPaper[] = []
  let publicationStatus = 'Connected to the curated Research Dashboard publication contract.'

  try {
    const papers = await listPublicPapers()
    featured = papers.filter((paper) => paper.featured).slice(0, 3)
  } catch {
    publicationStatus =
      'Public publication data will appear when the deployment environment is connected to Supabase.'
  }

  return (
    <>
      <section className="hero">
        <div className="site-shell hero-grid">
          <div>
            <p className="eyebrow">Academic website · Next.js foundation</p>
            <h1>{siteProfile.name}</h1>
            <p className="hero-role">{siteProfile.role} · {siteProfile.affiliation}</p>
            <p className="hero-copy">{siteProfile.intro}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/publications">Publications</Link>
              <a className="button secondary" href={siteProfile.links.orcid} target="_blank" rel="noreferrer">ORCID</a>
            </div>
          </div>
          <aside className="architecture-card">
            <span className="kicker">Phase 4</span>
            <h2>Public by contract</h2>
            <p>
              This replacement site reads publication data only from anonymous-safe
              Supabase RPCs maintained by Research Dashboard. Internal research and
              account data are outside this application boundary.
            </p>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Research</p>
              <h2>Featured publications</h2>
            </div>
            <Link href="/publications">View all</Link>
          </div>

          {featured.length > 0 ? (
            <div className="publication-list">
              {featured.map((paper) => <PublicationCard key={paper.slug} paper={paper} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>{publicationStatus}</p>
              <p>No legacy publication records are imported in Phase 4.</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
