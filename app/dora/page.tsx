import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'DORA',
  description:
    'A short statement on the San Francisco Declaration on Research Assessment (DORA) and responsible research assessment.',
}

export default function DoraPage() {
  return (
    <section className="page-section">
      <div className="site-shell narrow-shell practice-page">
        <p className="eyebrow">Research assessment</p>
        <h1>DORA</h1>
        <p className="page-lead">
          San Francisco Declaration on Research Assessment
        </p>

        <div className="practice-page-badge dora-page-badge">
          <Image
            src="/dora/dora-badge-horizontal.png"
            alt="DORA signatory badge"
            width={420}
            height={147}
            priority
          />
        </div>

        <div className="practice-prose">
          <p>
            I am an individual signatory to the San Francisco Declaration on
            Research Assessment (DORA). The declaration was developed in 2012
            to encourage better ways of assessing research outputs and the
            contributions of researchers.
          </p>

          <p>
            Its central principle is that research should be assessed on the
            quality and substance of the work itself, rather than by using the
            reputation or citation metrics of the journal in which it appears
            as a proxy for quality. In particular, DORA argues against using
            journal-based measures such as the Journal Impact Factor in
            decisions about funding, appointment or promotion.
          </p>

          <h2>What this means in practice</h2>

          <ul className="practice-principles">
            <li>
              Assess individual research outputs on their own merits rather
              than on the prestige or metrics of the publication venue.
            </li>
            <li>
              Recognise a broad range of scholarly outputs, including data,
              software and other research products alongside articles.
            </li>
            <li>
              Use explicit and transparent assessment criteria in funding,
              recruitment, appointment and promotion.
            </li>
            <li>
              Use quantitative indicators carefully and in context, alongside
              qualitative evidence about the value and influence of research.
            </li>
            <li>
              Encourage responsible authorship, clear contributor attribution
              and appropriate recognition of primary research.
            </li>
          </ul>

          <p>
            I regard these principles as compatible with rigorous quantitative
            evaluation: metrics can be informative, but they should support
            judgement rather than replace it.
          </p>

          <p className="practice-source">
            <a
              href="https://sfdora.org/read/"
              target="_blank"
              rel="noreferrer"
            >
              Read the full declaration
              <FontAwesomeIcon
                className="bio-external-icon"
                icon={faArrowUpRightFromSquare}
                aria-hidden="true"
              />
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
