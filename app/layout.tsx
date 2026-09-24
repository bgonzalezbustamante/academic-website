import type { Metadata } from 'next'
import type { ReactNode } from 'react'

import SiteFooter from '@/components/site-footer'
import SiteHeader from '@/components/site-header'
import './globals.css'

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

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
