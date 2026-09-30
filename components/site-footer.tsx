import { faCreativeCommons } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faLocationDot } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

import { siteProfile } from '@/content/site'
import { currentRelease } from '@/lib/releases'

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
