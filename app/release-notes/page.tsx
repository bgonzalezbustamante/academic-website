import type { Metadata } from 'next'
import Link from 'next/link'

import { releases } from '@/lib/releases'

export const metadata: Metadata = {
  title: 'Release notes',
  description:
    'Release history for the Next.js academic website and a concise link back to the pre-v6 academic-kickstart implementation.',
}

export default function ReleaseNotesPage() {
  return (
    <section className="page-section">
      <div className="site-shell narrow-shell">
        <p className="eyebrow">Release notes</p>
        <h1>What changed between versions</h1>
        <p className="page-lead">
          A concise release history for the Next.js academic website. Detailed
          pre-v6 changes remain in the{' '}
          <a
            href="https://github.com/bgonzalezbustamante/academic-kickstart/blob/master/CHANGELOG.md"
            target="_blank"
            rel="noreferrer"
          >
            academic-kickstart CHANGELOG
          </a>
          .
        </p>

        <div className="release-list">
          {releases.map((release) => (
            <article className="release-card" key={release.version}>
              <div className="release-heading">
                <div>
                  <div className="release-title-row">
                    <h2>
                      {release.version} &quot;{release.codename}&quot;
                    </h2>

                    {release.status && (
                      <span className="release-badge">
                        {release.status}
                      </span>
                    )}
                  </div>

                  <p className="release-comparison">
                    {release.comparison}
                  </p>
                </div>

                <span className="release-date">
                  {release.releasedOn}
                </span>
              </div>

              <p className="release-summary">
                {release.summary}
              </p>

              <div className="release-sections">
                {release.sections.map((section) => (
                  <section
                    className="release-section"
                    key={section.title}
                  >
                    <h3>{section.title}</h3>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </section>
                ))}
              </div>

              {release.version === 'v5.4.9 and earlier' && (
                <p className="release-history-link">
                  <Link
                    href="https://github.com/bgonzalezbustamante/academic-kickstart"
                    target="_blank"
                  >
                    Open the predecessor repository
                  </Link>
                </p>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
