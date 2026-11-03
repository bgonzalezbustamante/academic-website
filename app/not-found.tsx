/* eslint-disable @next/next/no-img-element -- The illustration is WebP generated locally by scripts/build-images.mjs; Next.js image optimisation would re-encode it. */
import type { Metadata } from 'next'
import Link from 'next/link'

import { imageAssets } from '@/content/image-assets.generated'

// Next.js adds its own noindex tag to 404 responses. This replaces the root
// layout's tag (index, follow in production), so the two tags agree.
export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  const illustration = imageAssets.errors.notFound

  return (
    <section className="page-section not-found-section">
      <div className="site-shell not-found-layout">
        <div className="not-found-copy">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="page-lead">
            The requested public page does not exist.
          </p>
          <Link className="button primary" href="/">
            Return home
          </Link>
        </div>

        <div className="not-found-illustration">
          <img
            src={illustration.src}
            srcSet={illustration.srcSet}
            sizes="(max-width: 560px) 78vw, (max-width: 760px) 72vw, 480px"
            width={illustration.width}
            height={illustration.height}
            alt="Penguin reading beside a stack of books"
            fetchPriority="high"
            decoding="async"
          />
        </div>
      </div>
    </section>
  )
}
