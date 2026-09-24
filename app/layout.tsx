import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import type { Metadata } from 'next'
import { Noto_Serif, Roboto } from 'next/font/google'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Bastián González-Bustamante',
    template: '%s | Bastián González-Bustamante',
  },
  description:
    'Academic website of Bastián González-Bustamante, researcher in comparative politics, government and computational social science.',
}

export default function RootLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/jpswalsh/academicons@1/css/academicons.min.css"
        />
      </head>
      <body className={`${roboto.variable} ${notoSerif.variable}`}>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
