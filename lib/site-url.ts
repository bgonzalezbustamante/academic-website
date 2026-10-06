const DEFAULT_SITE_URL = 'http://localhost:3000'

const PRODUCTION_HOSTS = new Set([
  'bgonzalezbustamante.com',
  'www.bgonzalezbustamante.com',
])

export function getSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL

  try {
    return new URL(configured)
  } catch {
    return new URL(DEFAULT_SITE_URL)
  }
}

export function isProductionSiteUrl(url = getSiteUrl()) {
  const deployContext =
    process.env.SITE_DEPLOY_CONTEXT || process.env.CONTEXT

  return (
    (!deployContext || deployContext === 'production') &&
    process.env.NETLIFY_PREVIEW_SERVER !== 'true' &&
    url.protocol === 'https:' &&
    PRODUCTION_HOSTS.has(url.hostname.toLowerCase())
  )
}

export function getAbsoluteSiteUrl(
  path: string,
  url = getSiteUrl()
) {
  return new URL(path, url).toString()
}
