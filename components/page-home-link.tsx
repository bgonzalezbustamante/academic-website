import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'

// Shared return navigation for standalone secondary pages.
export default function PageHomeLink() {
  return (
    <div className="trajectory-toolbar">
      <Link href="/">
        <FontAwesomeIcon icon={faArrowLeft} aria-hidden="true" />
        Home
      </Link>
    </div>
  )
}
