import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { Metadata } from 'next'
import { Noto_Serif, Roboto } from 'next/font/google'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import {
  getSiteUrl,
  isProductionSiteUrl,
} from '@/lib/site-url'
import './globals.css'

config.autoAddCss = false

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
  display: 'swap',
})

const notoSerif = Noto_Serif({
  variable: '--font-noto-serif',
  subsets: ['latin'],
  display: 'swap',
})

const siteUrl = getSiteUrl()
const allowIndexing = isProductionSiteUrl(siteUrl)

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: 'Bastián González-Bustamante',
    template: '%s | Bastián González-Bustamante',
  },
  description:
    'Academic website of Bastián González-Bustamante, researcher in comparative politics, government and computational social science.',
  authors: [
    {
      name: 'Bastián González-Bustamante',
      url: siteUrl,
    },
  ],
  creator: 'Bastián González-Bustamante',
  publisher: 'Bastián González-Bustamante',
  robots: allowIndexing
    ? {
        index: true,
        follow: true,
      }
    : {
        index: false,
        follow: false,
        noarchive: true,
      },
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${notoSerif.variable}`}>
        <a className="skip-link" href="#main-content">
          Skip to main content
        </a>
        <SiteHeader />
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
