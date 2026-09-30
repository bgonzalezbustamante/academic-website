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
  // Current report values could not be retrieved programmatically while
  // preparing rc.1. Replace these nulls manually with the displayed values.
  gramsCo2ePerView: null,
  rating: null,
  cleanerThanPercent: null,
  testedOn: null,
}
