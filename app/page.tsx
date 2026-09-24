import Image from 'next/image'
import Link from 'next/link'

import AcademicLinks from '@/components/academic-links'
import ExternalInlineLink from '@/components/external-inline-link'
import PositionList from '@/components/position-list'
import PublicationCard from '@/components/publication-card'
import ResearchPracticeCards from '@/components/research-practice-cards'
import PublicWorkAnalyticsSection from '@/components/public-work-analytics'
import { siteProfile } from '@/content/site'
import { listPublicPapers } from '@/lib/publications'
import { getPublicWorkAnalytics } from '@/lib/work-analytics'
import type {
  PublicPaper,
  PublicWorkAnalytics,
} from '@/types/public'

export const revalidate = 300

function getCurrentAmsterdamYear() {
  return Number(
    new Intl.DateTimeFormat(
      'en-GB',
      {
        timeZone: 'Europe/Amsterdam',
        year: 'numeric',
      }
    ).format(new Date())
  )
}

export default async function HomePage() {
  let featured: PublicPaper[] = []
  let publicationsAvailable = true
  let workAnalytics: PublicWorkAnalytics | null = null

  const currentYear = getCurrentAmsterdamYear()

  try {
    const papers = await listPublicPapers()
    featured = papers
      .filter((paper) => paper.featured)
      .slice(0, 3)
  } catch {
    publicationsAvailable = false
  }

  try {
    workAnalytics =
      await getPublicWorkAnalytics(
        currentYear
      )
  } catch {
    workAnalytics = null
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
              <p className="kicker">Main Interests</p>
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
                regularly present at IPSA, ECPR, EPSA, and COMPTEXT. At ECPR,
                I serve on the{' '}
                <ExternalInlineLink href="https://ecpr.eu/">
                  Steering Committee of the Standing Group on Political
                  Methodology
                </ExternalInlineLink>
                .
              </p>

              <p>
                I am currently working on the{' '}
                <ExternalInlineLink href="https://www.graigklein.com/terrorist-group-adaptation--lessons-for-ct-tergap-project.html">
                  Terrorist Group Adaptation &amp; Lessons for
                  Counterterrorism (TERGAP)
                </ExternalInlineLink>{' '}
                project, funded by the European Union, to build a new dataset
                of counterterrorism events, which will help researchers
                identify patterns of adaptation, examine unintended effects of
                counterterrorism, and generate evidence to improve global
                security. In parallel, I contribute to{' '}
                <ExternalInlineLink href="https://www.cost.eu/actions/CA22150/">
                  COST Action CA22150
                </ExternalInlineLink>{' '}
                on executive-bureaucratic careers and lead the Enlace-Inserción
                UDP 2025-2026 project{' '}
                <ExternalInlineLink href="https://obpex.com/enlace-udp">
                  “Unpacking the Unpredictable: Using NLP and LLMs to Examine
                  Cabinet Politics and Responses to Stochastic Events in
                  Presidential Democracies.”
                </ExternalInlineLink>
              </p>
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

      <ResearchPracticeCards />

      {workAnalytics ? (
        <PublicWorkAnalyticsSection
          analytics={workAnalytics}
        />
      ) : (
        <section
          className="section activity-section"
          id="activity"
        >
          <div className="site-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Current year</p>
                <h2>Activity over time</h2>
              </div>
            </div>
            <div className="empty-state">
              <p>
                Public work analytics are temporarily unavailable.
              </p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
