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
 *
 * After re-testing the deployed site, copy the latest values from the
 * Website Carbon report below. Set `showInFooter` to false to suppress
 * the public footer note without deleting the stored measurement.
 */
export const siteCarbonMeasurement: SiteCarbonMeasurement = {
  showInFooter: true,
  measuredUrl: 'https://bgonzalezbustamante.com/',
  reportUrl:
    'https://www.websitecarbon.com/website/bgonzalezbustamante-com/',
  gramsCo2ePerView: 0.11,
  rating: 'B',
  cleanerThanPercent: 79,
  testedOn: '2026-09-30',
}
