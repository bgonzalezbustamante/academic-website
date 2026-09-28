import type { Metadata } from 'next'

import ProjectCard from '@/components/project-card'
import SectionPopulationProgress from '@/components/section-population-progress'
import {
  listPublicProjects,
  orderPublicProjects,
} from '@/lib/projects'
import { projectPopulationYears } from '@/lib/site-population'
import type { PublicProject } from '@/types/public'

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Current and completed research projects by Bastián González-Bustamante.',
  alternates: {
    canonical: '/projects',
  },
}

export const revalidate = 300

export default async function ProjectsPage() {
  let projects: PublicProject[] = []
  let available = true

  try {
    projects = await listPublicProjects()
  } catch {
    available = false
  }

  const orderedProjects = orderPublicProjects(projects)
  const featured = orderedProjects.filter(
    (project) => project.featured
  )
  const remaining = orderedProjects.filter(
    (project) => !project.featured
  )

  return (
    <section className="page-section">
      <div className="site-shell">
        <div className="projects-page-heading">
          <p className="eyebrow">Research portfolio</p>
          <h1>Projects</h1>
          <p className="page-lead">
            Public research projects, their funding context and associated
            public research outputs.
          </p>
        </div>

        <SectionPopulationProgress
          domain="projects"
          label="Projects"
          value={available ? projects.length : null}
          unit="projects"
          coveredYears={
            available
              ? projectPopulationYears(projects)
              : null
          }
        />

        {!available ? (
          <div className="empty-state">
            <p>Projects are temporarily unavailable.</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <p>No public projects are currently available.</p>
          </div>
        ) : (
          <>
            {featured.length > 0 && (
              <section className="project-group">
                <div className="section-heading compact-heading">
                  <div>
                    <p className="eyebrow">Selected work</p>
                    <h2>Featured projects</h2>
                  </div>
                </div>

                <div className="project-grid featured-project-grid">
                  {featured.map((project) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                      featured
                    />
                  ))}
                </div>
              </section>
            )}

            {remaining.length > 0 && (
              <section className="project-group">
                <div className="section-heading compact-heading">
                  <div>
                    <p className="eyebrow">
                      {featured.length > 0 ? 'Portfolio' : 'Research portfolio'}
                    </p>
                    <h2>
                      {featured.length > 0 ? 'Other projects' : 'Projects'}
                    </h2>
                  </div>
                </div>

                <div className="project-grid">
                  {remaining.map((project) => (
                    <ProjectCard
                      key={project.slug}
                      project={project}
                    />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </section>
  )
}
