import Link from 'next/link'

import PublicationCard from '@/components/publication-card'
import { siteProfile } from '@/content/site'
import { listPublicPapers } from '@/lib/publications'
import type { PublicPaper } from '@/types/public'

export const revalidate = 300

export default async function HomePage() {
  let featured: PublicPaper[] = []
  let publicationsAvailable = true

  try {
    const papers = await listPublicPapers()
    featured = papers
      .filter((paper) => paper.featured)
      .slice(0, 3)
  } catch {
    publicationsAvailable = false
  }

  return (
    <>
      <section className="hero">
        <div className="site-shell hero-grid">
          <div>
            <p className="eyebrow">Academic profile</p>
            <h1>{siteProfile.name}</h1>

            <div className="appointment-list">
              <p>
                <strong>{siteProfile.primaryRole}</strong>
                <span>{siteProfile.primaryAffiliation}</span>
              </p>
              <p>
                <strong>{siteProfile.secondaryRole}</strong>
                <span>{siteProfile.secondaryAffiliation}</span>
              </p>
            </div>

            <p className="hero-copy">{siteProfile.intro}</p>

            <div className="hero-actions">
              <Link className="button primary" href="/publications">
                Publications
              </Link>
              <a
                className="button secondary"
                href={siteProfile.links.orcid}
                target="_blank"
                rel="noreferrer"
              >
                ORCID
              </a>
              <a
                className="button secondary"
                href={siteProfile.links.scholar}
                target="_blank"
                rel="noreferrer"
              >
                Google Scholar
              </a>
            </div>
          </div>

          <aside className="profile-card">
            <p className="kicker">Research interests</p>
            <ul className="interest-list">
              {siteProfile.researchAreas.map((area) => (
                <li key={area}>{area}</li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      <section className="section" id="publications">
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
              {featured.map((paper) => (
                <PublicationCard key={paper.slug} paper={paper} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>
                {publicationsAvailable
                  ? 'No featured publications are currently available.'
                  : 'Publications are temporarily unavailable.'}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
