import { faArrowUpRightFromSquare, faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import AcademicLinks from '@/components/academic-links'
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
      <section className="hero-section">
        <div className="site-shell">
          <div className="hero-card">
            <div className="hero-main">
              <p className="eyebrow">Academic profile</p>
              <h1 className="hero-name">{siteProfile.name}</h1>
              <p className="hero-copy">{siteProfile.intro}</p>

              <div className="hero-actions">
                <Link className="button primary" href="/publications">
                  <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
                  <span>Publications</span>
                </Link>
              </div>

              <AcademicLinks />
            </div>

            <aside className="research-panel">
              <p className="kicker">Research interests</p>
              <ul className="interest-list">
                {siteProfile.researchAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </aside>
          </div>

          <div className="positions-grid" aria-label="Academic positions">
            {siteProfile.positions.map((position) => (
              <a
                key={position.institution}
                className="position-card"
                href={position.href}
                target="_blank"
                rel="noreferrer"
              >
                <span className="position-accent" aria-hidden="true" />
                <span className="position-copy">
                  <strong>{position.role}</strong>
                  <span>{position.institution}</span>
                </span>
                <FontAwesomeIcon
                  className="position-link-icon"
                  icon={faArrowUpRightFromSquare}
                  aria-hidden="true"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section" id="publications">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Research</p>
              <h2>Featured publications</h2>
            </div>
            <Link className="section-link" href="/publications">
              View all
              <span aria-hidden="true">→</span>
            </Link>
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
