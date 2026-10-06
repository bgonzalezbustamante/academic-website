import Image from 'next/image'
import Link from 'next/link'

import { siteProfile } from '@/content/site'

export default function InstitutionStrip() {
  return (
    <Link
      className="institution-strip"
      href="/"
      aria-label="Bastián González-Bustamante home"
      title="Home"
    >
      {siteProfile.positions.map((position) => (
        <span className="institution-mark" key={position.id}>
          <Image
            className="institution-logo-image"
            src={position.logo}
            alt=""
            width={42}
            height={42}
            unoptimized
          />
        </span>
      ))}
    </Link>
  )
}
