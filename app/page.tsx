import Image from 'next/image'
import Link from 'next/link'

import AcademicLinks from '@/components/academic-links'
import ExternalInlineLink from '@/components/external-inline-link'
import PositionList from '@/components/position-list'
import PresentationRoadmap from '@/components/presentation-roadmap'
import PublicWorkAnalyticsSection from '@/components/public-work-analytics'
import ProjectCard from '@/components/project-card'
import PublicationCard from '@/components/publication-card'
import ResearchPracticeCards from '@/components/research-practice-cards'
import SitePopulationProgress from '@/components/site-population-progress'
import { siteProfile } from '@/content/site'
import { listPublicConferencePresentations } from '@/lib/conferences'
import { listPublicPapers } from '@/lib/publications'
import {
  listPublicProjects,
  orderPublicProjects,
} from '@/lib/projects'
import { listPublicTeaching } from '@/lib/teaching'
import { getPublicWorkAnalytics } from '@/lib/work-analytics'
import type {
  PublicConferencePresentation,
  PublicPaper,
  PublicProject,
  PublicTeachingItem,
  PublicWorkAnalytics,
} from '@/types/public'

export const revalidate = 300

function getCurrentAmsterdamDateParts() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Amsterdam',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date())

  const value = Object.fromEntries(
    parts
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value])
  )

  return {
    year: Number(value.year),
    date: `${value.year}-${value.month}-${value.day}`,
  }
}

export default async function HomePage() {
  let papers: PublicPaper[] = []
  let projects: PublicProject[] = []
  let featuredPapers: PublicPaper[] = []
  let featuredProjects: PublicProject[] = []
  let presentations: PublicConferencePresentation[] = []
  let teaching: PublicTeachingItem[] = []
  let workAnalytics: PublicWorkAnalytics | null = null

  let publicationsAvailable = true
  let projectsAvailable = true
  let conferencesAvailable = true
  let teachingAvailable = true

  const currentAmsterdam = getCurrentAmsterdamDateParts()
  const currentYear = currentAmsterdam.year

  try {
    papers = await listPublicPapers()
    featuredPapers = papers
      .filter((paper) => paper.featured)
      .slice(0, 4)
  } catch {
    publicationsAvailable = false
  }

  try {
    projects = await listPublicProjects()
    featuredProjects = orderPublicProjects(
      projects.filter((project) => project.featured)
    )
  } catch {
    projectsAvailable = false
  }

  try {
    presentations = await listPublicConferencePresentations()
  } catch {
    conferencesAvailable = false
  }

  try {
    teaching = await listPublicTeaching()
  } catch {
    teachingAvailable = false
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
                Based in the Netherlands, I hold a{' '}
                <ExternalInlineLink href="https://www.ox.ac.uk/">
                  DPhil (PhD) in Politics from the University of Oxford
                </ExternalInlineLink>
                . My work bridges the fields of
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

      <ResearchPracticeCards />

      <SitePopulationProgress
        papers={publicationsAvailable ? papers : null}
        projects={projectsAvailable ? projects : null}
        presentations={conferencesAvailable ? presentations : null}
        teaching={teachingAvailable ? teaching : null}
      />

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

          {featuredPapers.length > 0 ? (
            <div className="publication-list featured-publication-grid">
              {featuredPapers.map((paper) => (
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

      <section className="section featured-projects-section" id="featured-projects">
        <div className="site-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Research portfolio</p>
              <h2>Featured projects</h2>
            </div>
            <Link className="section-link" href="/projects">
              View all
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {featuredProjects.length > 0 ? (
            <div className="project-grid home-featured-project-grid">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  featured
                />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>
                {projectsAvailable
                  ? 'No featured projects are currently available.'
                  : 'Projects are temporarily unavailable.'}
              </p>
            </div>
          )}
        </div>
      </section>

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

      {conferencesAvailable ? (
        <PresentationRoadmap
          presentations={presentations}
          year={currentYear}
          currentDate={currentAmsterdam.date}
        />
      ) : (
        <section className="section roadmap-section" id="roadmap">
          <div className="site-shell">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Roadmap</p>
                <h2>Conferences</h2>
                <p className="section-intro">
                  Public presentations at conferences, workshops, and seminars
                  during {currentYear}.
                </p>
              </div>
              <Link className="section-link" href="/conferences">
                View all
                <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="empty-state">
              <p>Presentation roadmap is temporarily unavailable.</p>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
