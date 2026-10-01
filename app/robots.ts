import type { MetadataRoute } from 'next'

const productionHosts = new Set([
  'bgonzalezbustamante.com',
  'www.bgonzalezbustamante.com',
])

export default function robots(): MetadataRoute.Robots {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

  let allowIndexing = false

  try {
    const siteUrl = new URL(configuredSiteUrl)
    allowIndexing =
      siteUrl.protocol === 'https:' &&
      productionHosts.has(siteUrl.hostname.toLowerCase())
  } catch {
    allowIndexing = false
  }

  return {
    rules: {
      userAgent: '*',
      ...(allowIndexing ? { allow: '/' } : { disallow: '/' }),
    },
  }
}
