import type { Metadata } from 'next'

import PaintingCard from '@/components/painting-card'
import {
  selectedPaintings,
  unreproducedPaintings,
} from '@/content/paintings'

export const metadata: Metadata = {
  title: 'Selected paintings',
  description:
    'A personal selection of paintings encountered in museum collections.',
  alternates: {
    canonical: '/paintings',
  },
}

export default function PaintingsPage() {
  return (
    <section className="page-section paintings-page">
      <div className="site-shell">
        <div className="paintings-page-heading">
          <p className="eyebrow">Personal selection</p>
          <h1>Selected paintings</h1>
          <p className="page-lead">
            A personal selection of works encountered in museum
            collections.
          </p>
        </div>

        <div className="painting-mosaic">
          {selectedPaintings.map((painting) => (
            <PaintingCard
              key={painting.slug}
              painting={painting}
            />
          ))}
        </div>

        <aside className="painting-rights-note">
          <p className="eyebrow">Selected works not reproduced here</p>
          <div className="painting-unreproduced-list">
            {unreproducedPaintings.map((painting) => (
              <article
                className="painting-unreproduced-item"
                key={painting.title}
              >
                <h2>
                  <a
                    href={painting.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {painting.title}
                  </a>
                </h2>
                <p>
                  {painting.artist} · {painting.year} ·{' '}
                  {painting.venue}, {painting.city}
                </p>
                <p>
                  This work is part of my selection, but I do not
                  reproduce an image here. {painting.reason}{' '}
                  <a
                    href={painting.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {painting.linkLabel}
                  </a>
                  .
                </p>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  )
}
