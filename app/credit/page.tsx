import type { Metadata } from 'next'
import Image from 'next/image'

import ExternalInlineLink from '@/components/external-inline-link'
import PageHomeLink from '@/components/page-home-link'

export const metadata: Metadata = {
  title: 'CRediT',
  description:
    'Contributor Roles Taxonomy and the fourteen CRediT contributor roles.',
  alternates: {
    canonical: '/credit',
  },
}

const roles = [
  {
    badge: 'conceptualization.png',
    role: 'Conceptualization',
    definition:
      'Ideas, formulation or evolution of overarching research goals and aims.',
  },
  {
    badge: 'data_curation.png',
    role: 'Data curation',
    definition:
      'Produce metadata, scrub data and maintain research data for initial use and later re-use.',
  },
  {
    badge: 'formal_analysis.png',
    role: 'Formal analysis',
    definition:
      'Application of statistical, mathematical, computational, or other formal techniques to analyze data.',
  },
  {
    badge: 'funding_acquisition.png',
    role: 'Funding acquisition',
    definition:
      'Acquisition of the financial support for the project leading to this publication.',
  },
  {
    badge: 'investigation.png',
    role: 'Investigation',
    definition:
      'Conducting a research and investigation process, specifically performing the data collection.',
  },
  {
    badge: 'methodology.png',
    role: 'Methodology',
    definition:
      'Development or design of methodology; creation of models.',
  },
  {
    badge: 'project_administration.png',
    role: 'Project administration',
    definition:
      'Management and coordination responsibility for the research activity planning and execution.',
  },
  {
    badge: 'resources.png',
    role: 'Resources',
    definition:
      'Provision of study materials, instrumentation, computing resources, or other analysis tools.',
  },
  {
    badge: 'computation.png',
    role: 'Software',
    definition:
      'Programming, software development; designing computer programs; implementation of the computer code and supporting algorithms.',
  },
  {
    badge: 'supervision.png',
    role: 'Supervision',
    definition:
      'Oversight for the research activity planning and execution, including mentorship external to the core team.',
  },
  {
    badge: 'testing.png',
    role: 'Validation',
    definition:
      'Replication of results and other research outputs.',
  },
  {
    badge: 'data_visualization.png',
    role: 'Visualization',
    definition:
      'Preparation, creation and/or presentation of the published work, specifically data presentation.',
  },
  {
    badge: 'writing_initial_draft.png',
    role: 'Writing – original draft',
    definition:
      'Preparation, creation and/or presentation of the published work, specifically writing the initial draft.',
  },
  {
    badge: 'writing_review.png',
    role: 'Writing – review and editing',
    definition:
      'Critical review, commentary or revision – including pre- or post-publication stages.',
  },
] as const

export default function CreditPage() {
  return (
    <section className="page-section">
      <div className="site-shell narrow-shell practice-page">
        <p className="eyebrow">Contributor transparency</p>
        <h1>CRediT</h1>
        <p className="page-lead">Contributor Roles Taxonomy</p>
        <PageHomeLink />

        <div className="practice-prose">
          <p>
            CRediT (Contributor Roles Taxonomy) is a high-level taxonomy
            including fourteen roles that can be used to represent the roles
            typically played by contributors to scientific scholarly output.
            The roles describe each contributor&apos;s specific contribution
            to the scholarly output.
          </p>
        </div>

        <div className="credit-table-wrap">
          <table className="credit-table">
            <caption className="sr-only">
              CRediT contributor roles and definitions
            </caption>
            <thead>
              <tr>
                <th scope="col">Badge</th>
                <th scope="col">Role</th>
                <th scope="col">Definition</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((item) => (
                <tr key={item.role}>
                  <td>
                    <Image
                      src={`/credit/${item.badge}`}
                      alt={`${item.role} CRediT badge`}
                      width={60}
                      height={60}
                    />
                  </td>
                  <td>
                    <strong>{item.role}</strong>
                  </td>
                  <td>{item.definition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="practice-source">
          Source: compiled using badges from{' '}
          <ExternalInlineLink href="https://github.com/CenterForOpenScience/open_research_badges">
            Center for Open Science
          </ExternalInlineLink>{' '}
          and core definitions from CASRAI.
        </p>
      </div>
    </section>
  )
}
