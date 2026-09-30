import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import type { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
}

export default function ExternalInlineLink({ href, children }: Props) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
      <FontAwesomeIcon
        className="bio-external-icon"
        icon={faArrowUpRightFromSquare}
        aria-hidden="true"
      />
    </a>
  )
}
