import {
  faCalendarDays,
  faChartColumn,
  faQuoteRight,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import PublicationLanguageFlag from '@/components/publication-language-flag'
import type {
  ProfileCitationPaper,
  ProfileCount,
  PublicationProfile as PublicationProfileData,
} from '@/lib/publication-profile'
import type { PublicPaperLanguage } from '@/types/public'

type Props = {
  profile: PublicationProfileData
}

const GOOGLE_SCHOLAR_PROFILE =
  'https://scholar.google.co.uk/citations?&user=UknWOrEAAAAJ'

function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T00:00:00Z`))
}

function HorizontalBars({
  items,
  languageFlags = false,
}: {
  items: ProfileCount[]
  languageFlags?: boolean
}) {
  const max = Math.max(...items.map((item) => item.count), 1)

  return (
    <div className="publication-profile-horizontal-bars">
      {items.map((item) => (
        <div className="publication-profile-horizontal-row" key={item.label}>
          <div className="publication-profile-horizontal-label">
            {languageFlags && item.label !== 'Unspecified' && (
              <PublicationLanguageFlag
                language={item.label as PublicPaperLanguage}
              />
            )}
            <span>{item.label}</span>
          </div>
          <div className="publication-profile-horizontal-track">
            <span
              style={{
                width: `${Math.max(
                  5,
                  (item.count / max) * 100
                )}%`,
              }}
            />
          </div>
          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  )
}

function CitationBars({
  papers,
}: {
  papers: ProfileCitationPaper[]
}) {
  const max = Math.max(
    ...papers.map((paper) => paper.citations),
    1
  )

  return (
    <div className="publication-profile-citation-list">
      {papers.map((paper) => (
        <div className="publication-profile-citation-row" key={paper.slug}>
          <div>
            <Link href={`/publication/${paper.slug}`}>
              {paper.title}
            </Link>
            <small>
              Snapshot {formatDate(paper.capturedOn)}
            </small>
          </div>
          <div className="publication-profile-citation-value">
            <div className="publication-profile-horizontal-track">
              <span
                style={{
                  width: `${Math.max(
                    3,
                    (paper.citations / max) * 100
                  )}%`,
                }}
              />
            </div>
            <strong>{paper.citations}</strong>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PublicationProfile({
  profile,
}: Props) {
  const maxOutput = Math.max(
    ...profile.outputOverTime.map((item) => item.count),
    1
  )

  return (
    <>
      <section
        className="publication-profile-kpis"
        aria-label="Publication profile summary"
      >
        <article>
          <FontAwesomeIcon icon={faQuoteRight} aria-hidden="true" />
          <div>
            <p>Google Scholar citations</p>
            <strong>
              {profile.totalGoogleScholarCitations.toLocaleString(
                'en-GB'
              )}
            </strong>
            <small>
              {profile.citationCoverage} of{' '}
              {profile.citationPaperCount} public papers
            </small>
          </div>
        </article>
        <article>
          <FontAwesomeIcon icon={faUserGroup} aria-hidden="true" />
          <div>
            <p>Distinct co-authors</p>
            <strong>{profile.distinctCoauthors}</strong>
          </div>
        </article>
        <article>
          <FontAwesomeIcon icon={faChartColumn} aria-hidden="true" />
          <div>
            <p>Authors per paper</p>
            <strong>
              {profile.averageAuthorsPerPaper.toFixed(1)}
            </strong>
          </div>
        </article>
        <article>
          <FontAwesomeIcon icon={faCalendarDays} aria-hidden="true" />
          <div>
            <p>Publication years</p>
            <strong>{profile.publicationYears}</strong>
          </div>
        </article>
      </section>

      <section className="publication-profile-panel">
        <div className="publication-profile-section-heading">
          <div>
            <p className="kicker">Trajectory</p>
            <h2>Publications over time</h2>
          </div>
          <p>
            Forthcoming papers are shown separately from dated
            published output.
          </p>
        </div>

        <div
          className="publication-profile-year-chart"
          aria-label="Publications by year"
        >
          {profile.outputOverTime.map((item) => (
            <div
              className={[
                'publication-profile-year-column',
                item.label === 'Forthcoming'
                  ? 'publication-profile-year-column-forthcoming'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              key={item.label}
            >
              <strong>{item.count}</strong>
              <div className="publication-profile-year-track">
                <span
                  style={{
                    height: `${Math.max(
                      8,
                      (item.count / maxOutput) * 100
                    )}%`,
                  }}
                />
              </div>
              <small>{item.label}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="publication-profile-panel">
        <div className="publication-profile-section-heading">
          <div>
            <p className="kicker">Impact snapshot</p>
            <h2>Citation profile</h2>
          </div>
          <p>
            Ten most-cited public papers by latest stored Google
            Scholar snapshot.
          </p>
        </div>

        {profile.topCitedPapers.length > 0 ? (
          <CitationBars papers={profile.topCitedPapers} />
        ) : (
          <p className="publication-profile-empty">
            No public Google Scholar snapshots are available yet.
          </p>
        )}

        <p className="publication-profile-note">
          Stored citation counts are dated snapshots and may have
          different capture dates across papers. For the latest
          Google Scholar indicators, see{' '}
          <a
            href={GOOGLE_SCHOLAR_PROFILE}
            target="_blank"
            rel="noreferrer"
          >
            my Google Scholar profile
          </a>
          .
        </p>
      </section>

      <div className="publication-profile-two-column">
        <section className="publication-profile-panel">
          <div className="publication-profile-section-heading">
            <div>
              <p className="kicker">Composition</p>
              <h2>Publication index</h2>
            </div>
          </div>
          <HorizontalBars items={profile.publicationIndexes} />
        </section>

        <section className="publication-profile-panel">
          <div className="publication-profile-section-heading">
            <div>
              <p className="kicker">Composition</p>
              <h2>Languages</h2>
            </div>
          </div>
          <HorizontalBars
            items={profile.languages}
            languageFlags
          />
        </section>
      </div>

      <div className="publication-profile-two-column">
        <section className="publication-profile-panel">
          <div className="publication-profile-section-heading">
            <div>
              <p className="kicker">Collaboration</p>
              <h2>Authorship structure</h2>
            </div>
            <p>
              {profile.firstAuthorShare.toFixed(1)}% first-authored.
            </p>
          </div>
          <HorizontalBars items={profile.authorshipStructure} />
        </section>

        <section className="publication-profile-panel">
          <div className="publication-profile-section-heading">
            <div>
              <p className="kicker">Publishing</p>
              <h2>Recurrent venues</h2>
            </div>
            <p>Venues represented by at least two public papers.</p>
          </div>
          {profile.recurrentVenues.length > 0 ? (
            <HorizontalBars items={profile.recurrentVenues} />
          ) : (
            <p className="publication-profile-empty">
              No recurrent venues are represented yet.
            </p>
          )}
        </section>
      </div>
    </>
  )
}
