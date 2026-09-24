import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'
import Link from 'next/link'

export default function ResearchPracticeCards() {
  return (
    <section className="practice-section">
      <div className="site-shell">
        <div className="practice-grid">
          <Link className="practice-card" href="/dora">
            <div className="practice-badge dora-card-badge">
              <Image
                src="/dora/dora-badge-horizontal.png"
                alt="DORA signatory badge"
                width={320}
                height={112}
              />
            </div>

            <div className="practice-copy">
              <p className="eyebrow">Research assessment</p>
              <h2>DORA signer</h2>
              <p>
                I support responsible research assessment that evaluates
                research on its own merits rather than relying on
                journal-level metrics as proxies for quality.
              </p>
              <span className="practice-link">
                Read more
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </span>
            </div>
          </Link>

          <Link className="practice-card" href="/credit">
            <div className="practice-badge credit-card-badges" aria-hidden="true">
              {[
                'conceptualization',
                'methodology',
                'writing_initial_draft',
                'writing_review',
              ].map((badge) => (
                <Image
                  key={badge}
                  src={`/credit/${badge}.png`}
                  alt=""
                  width={64}
                  height={64}
                />
              ))}
            </div>

            <div className="practice-copy">
              <p className="eyebrow">Contributor transparency</p>
              <h2>Pro CRediT</h2>
              <p>
                I support the CRediT taxonomy as a clear way to describe
                who contributed what to scholarly outputs across fourteen
                recognised contributor roles.
              </p>
              <span className="practice-link">
                View the taxonomy
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
