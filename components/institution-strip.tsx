import Image from 'next/image'

const institutions = [
  {
    href: 'https://www.universiteitleiden.nl/en',
    label: 'Leiden University',
    mark: (
      <span className="institution-wordmark leiden-wordmark" aria-hidden="true">
        <span>Leiden</span>
        <small>University</small>
      </span>
    ),
  },
  {
    href: 'https://www.udp.cl/',
    label: 'Universidad Diego Portales',
    mark: (
      <span className="institution-wordmark udp-wordmark" aria-hidden="true">
        udp
      </span>
    ),
  },
  {
    href: 'https://www.politics.ox.ac.uk/oxford-computational-political-science-group',
    label: 'Oxford Computational Political Science Group',
    mark: (
      <Image
        className="institution-logo-image"
        src="/branding/ocpsg.svg"
        alt=""
        width={34}
        height={34}
      />
    ),
  },
] as const

export default function InstitutionStrip() {
  return (
    <div className="institution-strip" aria-label="Academic affiliations">
      {institutions.map((institution) => (
        <a
          key={institution.label}
          className="institution-mark"
          href={institution.href}
          target="_blank"
          rel="noreferrer"
          aria-label={institution.label}
          title={institution.label}
        >
          {institution.mark}
        </a>
      ))}
    </div>
  )
}
