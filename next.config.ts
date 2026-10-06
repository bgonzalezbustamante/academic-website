import type { NextConfig } from 'next'

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: "base-uri 'self'; frame-ancestors 'none'; object-src 'none'",
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), geolocation=(), microphone=(), payment=(), usb=()',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
]

const canonicalHostRedirects = [
  {
    source: '/:path*',
    has: [
      {
        type: 'host',
        value: 'bgonzalezbustamante.netlify.app',
      },
    ],
    destination: 'https://bgonzalezbustamante.com/:path*',
    permanent: true,
  },
]

const legacyRedirects = [
  {
    source: '/publication',
    destination: '/publications',
    permanent: true,
  },
  {
    source: '/project',
    destination: '/projects',
    permanent: true,
  },
  {
    source: '/authors',
    destination: '/',
    permanent: true,
  },
  {
    source: '/authors/bgonzalezbustamante',
    destination: '/',
    permanent: true,
  },
  {
    source: '/cps-ranking',
    destination: '/project/cps-ranking',
    permanent: true,
  },
  {
    source: '/project/chilean-political-science-impact-ranking',
    destination: '/project/cps-ranking',
    permanent: true,
  },
  {
    source: '/project/twitter-tracker-chilean-referendum',
    destination:
      '/project/twitter-online-tracker-of-the-chilean-referendum',
    permanent: true,
  },
  {
    source: '/project/local-government-indicators',
    destination:
      '/project/territorial-patterns-of-electronic-and-open-government',
    permanent: true,
  },
  {
    source: '/project/credit-contributor-roles-taxonomy',
    destination: '/credit',
    permanent: true,
  },
]

const nextConfig: NextConfig = {
  // Embed Netlify's build context so SSR and static metadata agree.
  env: {
    SITE_DEPLOY_CONTEXT: process.env.CONTEXT ?? '',
  },
  poweredByHeader: false,
  images: {
    qualities: [75, 90, 95],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'timeline.bgonzalezbustamante.com',
        pathname: '/penguins/**',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ]
  },
  async redirects() {
    return [...canonicalHostRedirects, ...legacyRedirects]
  },
}

export default nextConfig
