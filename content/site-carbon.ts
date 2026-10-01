export type SiteCarbonMeasurement = {
  showInFooter: boolean
  measuredUrl: string
  reportUrl: string
  gramsCo2ePerView: number | null
  rating: string | null
  cleanerThanPercent: number | null
  testedOn: string | null
}

/**
 * Manually maintained Website Carbon snapshot.
 */
export const siteCarbonMeasurement: SiteCarbonMeasurement = {
  showInFooter: true,
  measuredUrl: 'https://bgonzalezbustamante.com/',
  reportUrl:
    'https://www.websitecarbon.com/website/bgonzalezbustamante-com/',
  gramsCo2ePerView: 0.08,
  rating: 'B',
  cleanerThanPercent: 85,
  testedOn: '2026-10-01',
}
