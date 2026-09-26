import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBookOpen,
  faDatabase,
  faDiagramProject,
  faFileLines,
  faPaperclip,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import type { PublicPaper } from '@/types/public'

type Props = {
  paper: PublicPaper
}

export default function PublicationLinks({ paper }: Props) {
  const links = [
    {
      label: 'DOI',
      href: paper.doi_url,
      icon: <i className="ai ai-doi" aria-hidden="true" />,
    },
    {
      label: 'Publication',
      href: paper.publication_url,
      icon: <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />,
    },
    {
      label: 'Preprint',
      href: paper.preprint_url,
      icon: <FontAwesomeIcon icon={faFileLines} aria-hidden="true" />,
    },
    {
      label: 'Code',
      href: paper.github_url,
      icon: <FontAwesomeIcon icon={faGithub} aria-hidden="true" />,
    },
    {
      label: 'Dataset',
      href: paper.dataset_url,
      icon: <FontAwesomeIcon icon={faDatabase} aria-hidden="true" />,
    },
    {
      label: 'Project',
      href: paper.project_url,
      icon: <FontAwesomeIcon icon={faDiagramProject} aria-hidden="true" />,
    },
    {
      label: 'SI File',
      href: paper.si_file_url,
      icon: <FontAwesomeIcon icon={faPaperclip} aria-hidden="true" />,
    },
  ]

  if (!links.some((link) => Boolean(link.href))) return null

  return (
    <div className="link-row" aria-label="Publication resources">
      {links.map((link) =>
        link.href ? (
          <a
            key={`${link.label}-${link.href}`}
            href={link.href}
            target="_blank"
            rel="noreferrer"
          >
            {link.icon}
            <span>{link.label}</span>
          </a>
        ) : null
      )}
    </div>
  )
}
