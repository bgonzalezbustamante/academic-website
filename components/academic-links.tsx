import {
  faGithub,
  faGoogleScholar,
  faLinkedin,
  faOrcid,
} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { siteProfile } from '@/content/site'

const links = [
  {
    href: `mailto:${siteProfile.contact.email}`,
    label: 'Email',
    icon: faEnvelope,
    external: false,
  },
  {
    href: siteProfile.links.orcid,
    label: 'ORCID',
    icon: faOrcid,
    external: true,
  },
  {
    href: siteProfile.links.scholar,
    label: 'Google Scholar',
    icon: faGoogleScholar,
    external: true,
  },
  {
    href: siteProfile.links.github,
    label: 'GitHub',
    kind: 'fontawesome',
    icon: faGithub,
    external: true,
  },
  {
    href: siteProfile.links.linkedin,
    label: 'LinkedIn',
    kind: 'fontawesome',
    icon: faLinkedin,
    external: true,
  },
] as const

export default function AcademicLinks() {
  return (
    <nav className="academic-links" aria-label="Contact and academic profiles">
      {links.map((link) => (
        <a
          key={link.label}
          className="academic-link"
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noreferrer' : undefined}
          aria-label={link.label}
          title={link.label}
        >
          <FontAwesomeIcon icon={link.icon} aria-hidden="true" />
          <span className="sr-only">{link.label}</span>
        </a>
      ))}
    </nav>
  )
}
