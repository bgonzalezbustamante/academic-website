import { faCreativeCommons } from '@fortawesome/free-brands-svg-icons'
import {
  faEnvelope,
  faLeaf,
  faLocationDot,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { siteProfile } from '@/content/site'
import { siteCarbonMeasurement } from '@/content/site-carbon'
import { currentRelease } from '@/lib/releases'

function carbonNoteLabel() {
  const details = ['Website Carbon']

  if (siteCarbonMeasurement.gramsCo2ePerView !== null) {
    details.push(
      `~${siteCarbonMeasurement.gramsCo2ePerView.toFixed(2)} g CO₂e/view`
    )
  }

  if (siteCarbonMeasurement.rating !== null) {
    details.push(`Rating ${siteCarbonMeasurement.rating}`)
  }

  if (details.length === 1) {
    details.push('current-site estimate')
  }

  return details.join(' · ')
}

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <div className="footer-contact">
          <a href={`mailto:${siteProfile.contact.email}`}>
            <FontAwesomeIcon icon={faEnvelope} aria-hidden="true" />
            <span>{siteProfile.contact.email}</span>
          </a>
          <span className="footer-address">
            <FontAwesomeIcon icon={faLocationDot} aria-hidden="true" />
            <span>{siteProfile.contact.address}</span>
          </span>
        </div>

        <div className="footer-meta">
          {siteCarbonMeasurement.showInFooter && (
            <a
              className="footer-carbon-note"
              href={siteCarbonMeasurement.reportUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={carbonNoteLabel()}
            >
              <FontAwesomeIcon icon={faLeaf} aria-hidden="true" />
              <span>{carbonNoteLabel()}</span>
            </a>
          )}

          <p className="footer-license">
            <FontAwesomeIcon
              icon={faCreativeCommons}
              aria-hidden="true"
            />
            <span>{new Date().getFullYear()} {siteProfile.name}</span>
          </p>

          <p>
            <Link href="/release-notes">
              {currentRelease.version} &quot;{currentRelease.codename}&quot;
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
