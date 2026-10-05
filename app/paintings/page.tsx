import type { Metadata } from 'next'

import PaintingCard from '@/components/painting-card'
import {
  selectedPaintings,
  unreproducedPainting,
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
          <p className="eyebrow">Not reproduced here</p>
          <h2>
            <a
              href={unreproducedPainting.museumUrl}
              target="_blank"
              rel="noreferrer"
            >
              {unreproducedPainting.title}
            </a>
          </h2>
          <p>
            {unreproducedPainting.artist} ·{' '}
            {unreproducedPainting.year} ·{' '}
            {unreproducedPainting.museum},{' '}
            {unreproducedPainting.city}
          </p>
          <p>
            This work is part of my selection, but I do not
            reproduce an image here because the artwork remains
            protected by copyright and I have not identified an
            image licence suitable for republication on this site.{' '}
            <a
              href={unreproducedPainting.museumUrl}
              target="_blank"
              rel="noreferrer"
            >
              View the work at MALBA
            </a>
            .
          </p>
        </aside>
      </div>
    </section>
  )
}
