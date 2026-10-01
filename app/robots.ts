import type { MetadataRoute } from 'next'

import {
  getAbsoluteSiteUrl,
  getSiteUrl,
  isProductionSiteUrl,
} from '@/lib/site-url'

export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl()
  const allowIndexing = isProductionSiteUrl(siteUrl)

  return {
    rules: {
      userAgent: '*',
      ...(allowIndexing ? { allow: '/' } : { disallow: '/' }),
    },
    ...(allowIndexing
      ? { sitemap: getAbsoluteSiteUrl('/sitemap.xml', siteUrl) }
      : {}),
  }
}
