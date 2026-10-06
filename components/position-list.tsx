import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Image from 'next/image'

import { siteProfile } from '@/content/site'

export default function PositionList() {
  return (
    <div className="position-list" aria-label="Academic positions">
      {siteProfile.positions.map((position) => (
        <div className="position-line" key={position.id}>
          <a
            className="position-logo-link"
            href={position.href}
            target="_blank"
            rel="noreferrer"
            aria-label={position.institution}
            title={position.institution}
          >
            <Image
              className="position-logo-image"
              src={position.logo}
              alt=""
              width={26}
              height={26}
              unoptimized
            />
          </a>
          <p>
            <strong>{position.role}</strong>
            <span aria-hidden="true"> · </span>
            <a href={position.href} target="_blank" rel="noreferrer">
              {position.institution}
              <FontAwesomeIcon
                className="inline-external-icon"
                icon={faArrowUpRightFromSquare}
                aria-hidden="true"
              />
            </a>
          </p>
        </div>
      ))}
    </div>
  )
}
