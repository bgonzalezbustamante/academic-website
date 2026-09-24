import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { siteProfile } from '@/content/site'

const links = [
  {
    href: siteProfile.links.orcid,
    label: 'ORCID',
    kind: 'academicon',
    icon: 'ai ai-orcid',
  },
  {
    href: siteProfile.links.scholar,
    label: 'Google Scholar',
    kind: 'academicon',
    icon: 'ai ai-google-scholar',
  },
  {
    href: siteProfile.links.github,
    label: 'GitHub',
    kind: 'fontawesome',
    icon: faGithub,
  },
  {
    href: siteProfile.links.linkedin,
    label: 'LinkedIn',
    kind: 'fontawesome',
    icon: faLinkedin,
  },
] as const

export default function AcademicLinks() {
  return (
    <nav className="academic-links" aria-label="Academic profiles">
      {links.map((link) => (
        <a
          key={link.label}
          className="academic-link"
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={link.label}
          title={link.label}
        >
          {link.kind === 'academicon' ? (
            <i className={link.icon} aria-hidden="true" />
          ) : (
            <FontAwesomeIcon icon={link.icon} aria-hidden="true" />
          )}
          <span className="sr-only">{link.label}</span>
        </a>
      ))}
    </nav>
  )
}
