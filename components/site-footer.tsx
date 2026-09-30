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

function formatCarbonTestDate(value: string) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${value}T00:00:00Z`))
}

function carbonNoteLabel() {
  const details = ['Website Carbon']

  if (siteCarbonMeasurement.gramsCo2ePerView !== null) {
    details.push(
      `~${siteCarbonMeasurement.gramsCo2ePerView.toFixed(2)} g CO₂e/view`
    )
  } else if (siteCarbonMeasurement.rating !== null) {
    details.push(`rating ${siteCarbonMeasurement.rating}`)
  } else {
    details.push('current-site estimate')
  }

  if (siteCarbonMeasurement.rating !== null) {
    const ratingText = `rating ${siteCarbonMeasurement.rating}`
    if (!details.includes(ratingText)) {
      details.push(ratingText)
    }
  }

  if (siteCarbonMeasurement.testedOn !== null) {
    details.push(
      `tested ${formatCarbonTestDate(siteCarbonMeasurement.testedOn)}`
    )
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
        </div>

        <div className="footer-meta">
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
