import { faBookOpen } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'

import AcademicLinks from '@/components/academic-links'
import PositionList from '@/components/position-list'
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
        <div className="site-shell profile-grid">
          <aside className="profile-aside">
            <div className="portrait-frame">
              <Image
                className="profile-portrait"
                src={siteProfile.portrait}
                alt={siteProfile.name}
                width={240}
                height={240}
                priority
              />
            </div>

            <AcademicLinks />

            <div className="research-interests">
              <p className="kicker">Research interests</p>
              <ul className="interest-list">
                {siteProfile.researchAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            </div>
          </aside>

          <div className="profile-main">
            <p className="eyebrow">Academic profile</p>
            <h1 className="hero-name">{siteProfile.name}</h1>

            <PositionList />

            <div className="bio-copy">
              <p>
                Based in the Netherlands, I hold a DPhil (PhD) in Politics
                from the University of Oxford. My work bridges the fields of
                comparative politics, government and computational social
                science. I build large-scale text-as-data pipelines, deploy AI
                and machine learning models, and apply causal inference
                strategies. My recent peer-reviewed articles have appeared in{' '}
                <em>Nature</em>, <em>Social Science Computer Review</em>,{' '}
                <em>Public Opinion Quarterly</em>, <em>World Development</em>,{' '}
                <em>Artificial Intelligence and Law</em>, among others. I
                regularly present at IPSA,{' '}
                <a href="https://ecpr.eu/" target="_blank" rel="noreferrer">
                  ECPR
                </a>
                , EPSA, and COMPTEXT. At ECPR, I serve on the Steering
                Committee of the Standing Group on Political Methodology.
              </p>

              <p>
                I am currently working on the{' '}
                <a
                  href="https://www.graigklein.com/terrorist-group-adaptation--lessons-for-ct-tergap-project.html"
                  target="_blank"
                  rel="noreferrer"
                >
                  Terrorist Group Adaptation &amp; Lessons for
                  Counterterrorism (TERGAP)
                </a>{' '}
                project, funded by the European Union, to build a new dataset
                of counterterrorism events, which will help researchers
                identify patterns of adaptation, examine unintended effects of
                counterterrorism, and generate evidence to improve global
                security. In parallel, I contribute to{' '}
                <a
                  href="https://www.cost.eu/actions/CA22150/"
                  target="_blank"
                  rel="noreferrer"
                >
                  COST Action CA22150
                </a>{' '}
                on executive-bureaucratic careers and lead the Enlace-Inserción
                UDP 2025-2026 project{' '}
                <a
                  href="https://obpex.com/enlace-udp"
                  target="_blank"
                  rel="noreferrer"
                >
                  “Unpacking the Unpredictable: Using NLP and LLMs to Examine
                  Cabinet Politics and Responses to Stochastic Events in
                  Presidential Democracies.”
                </a>
              </p>
            </div>

            <div className="hero-actions">
              <Link className="button primary" href="/publications">
                <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
                <span>Publications</span>
              </Link>
            </div>
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
