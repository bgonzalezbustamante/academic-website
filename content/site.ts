import { currentAcademicPositions } from '@/content/positions'

export const siteProfile = {
  name: 'Bastián González-Bustamante',
  positions: currentAcademicPositions,
  researchAreas: [
    'Comparative politics',
    'Ministerial turnover',
    'Elites and civil service',
    'Machine learning',
    'Artificial intelligence',
    'Quantitative methods',
  ],
  contact: {
    email: 'b.a.gonzalez.bustamante@fgga.leidenuniv.nl',
    address: 'Wijnhaven, Turfmarkt 99 · 2511 DP The Hague · Netherlands',
  },
  links: {
    orcid: 'https://orcid.org/0000-0003-1510-6820',
    github: 'https://github.com/bgonzalezbustamante',
    scholar: 'https://scholar.google.co.uk/citations?&user=UknWOrEAAAAJ',
    linkedin: 'https://www.linkedin.com/in/bgonzalezbustamante',
  },
} as const
