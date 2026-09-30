import Image from 'next/image'
import Link from 'next/link'

const logos = [
  {
    src: '/branding/leiden.webp',
    alt: 'Leiden University',
  },
  {
    src: '/branding/udp.webp',
    alt: 'Universidad Diego Portales',
  },
  {
    src: '/branding/ocpsg.webp',
    alt: 'Oxford Computational Political Science Group',
  },
] as const

export default function InstitutionStrip() {
  return (
    <Link
      className="institution-strip"
      href="/"
      aria-label="Bastián González-Bustamante home"
      title="Home"
    >
      {logos.map((logo) => (
        <span className="institution-mark" key={logo.alt}>
          <Image
            className="institution-logo-image"
            src={logo.src}
            alt=""
            width={42}
            height={42}
          />
        </span>
      ))}
    </Link>
  )
}
