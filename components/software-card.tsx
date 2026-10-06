import { faGithub } from '@fortawesome/free-brands-svg-icons'
import {
  faBookOpen,
  faGlobe,
  faLock,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import SoftwareStagePill from '@/components/software-stage-pill'
import type { PublicSoftwareItem } from '@/types/public'

type Props = {
  item: PublicSoftwareItem
}

function periodLabel(item: PublicSoftwareItem) {
  if (item.start_year == null && item.end_year == null) return null
  if (item.start_year == null) return String(item.end_year)
  if (item.end_year == null) return `${item.start_year}–present`
  if (item.start_year === item.end_year) return String(item.start_year)
  return `${item.start_year}–${item.end_year}`
}

export default function SoftwareCard({ item }: Props) {
  const period = periodLabel(item)

  return (
    <article className="software-card">
      <div>
        <h2>{item.name}</h2>
        {item.current_version && (
          <p className="software-card-version">
            {item.current_version}
          </p>
        )}
        <div className="metadata-tags software-card-meta">
          <span className="metadata-tag">{item.category}</span>
          <SoftwareStagePill stage={item.development_stage} />
          <span className="metadata-tag">{item.status}</span>
          {item.featured && (
            <span className="metadata-tag metadata-tag-accent">
              Featured
            </span>
          )}
          {item.repository_visibility === 'private' && (
            <span className="metadata-tag software-private-tag">
              <FontAwesomeIcon icon={faLock} aria-hidden="true" />
              Private repository
            </span>
          )}
        </div>
        {period && <p className="software-card-period">{period}</p>}
        <p className="software-card-description">
          {item.short_description}
        </p>
      </div>

      {(item.production_url ||
        item.repository_url ||
        item.documentation_url) && (
        <div className="software-card-links">
          {item.production_url && (
            <a href={item.production_url} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGlobe} aria-hidden="true" />
              Live
            </a>
          )}
          {item.repository_url && (
            <a href={item.repository_url} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faGithub} aria-hidden="true" />
              Code
            </a>
          )}
          {item.documentation_url && (
            <a href={item.documentation_url} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faBookOpen} aria-hidden="true" />
              Documentation
            </a>
          )}
        </div>
      )}
    </article>
  )
}
