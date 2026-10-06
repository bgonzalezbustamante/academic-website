import { imageAssets } from '@/content/image-assets.generated'

export type CurrentAcademicPosition = {
  id: string
  role: string
  institution: string
  href: string
  logo: string
  logoAlt: string
}

// Order these entries to set the visible order on Home and in the navbar.
// This is the single local source until current appointments are published by the Academic API.
export const currentAcademicPositions = [
  {
    id: 'leiden',
    role: 'Post-doctoral Researcher in Computational Social Science',
    institution: 'Leiden University',
    href: 'https://www.universiteitleiden.nl/en',
    logo: imageAssets.branding.leiden,
    logoAlt: 'Leiden University',
  },
  {
    id: 'udp',
    role: 'Associate Professor of Public Administration',
    institution: 'Universidad Diego Portales',
    href: 'https://www.udp.cl/',
    logo: imageAssets.branding.udp,
    logoAlt: 'Universidad Diego Portales',
  },
  {
    id: 'ocpsg',
    role: 'Research Leader',
    institution: 'Oxford Computational Political Science Group',
    href: 'https://www.politics.ox.ac.uk/oxford-computational-political-science-group',
    logo: imageAssets.branding.ocpsg,
    logoAlt: 'Oxford Computational Political Science Group',
  },
] as const satisfies readonly CurrentAcademicPosition[]
