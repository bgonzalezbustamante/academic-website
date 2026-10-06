import { imageAssets } from '@/content/image-assets.generated'

import type { SelectedPainting } from '@/content/paintings'

type Props = {
  painting: SelectedPainting
}

export default function PaintingCard({ painting }: Props) {
  const credit =
    painting.imageCredit ?? painting.imageSourceName
  const image = imageAssets.paintings[painting.slug]
  if (!image) throw new Error(`Missing generated image for ${painting.slug}`)

  return (
    <article
      className={`painting-tile painting-tile-${painting.layout}`}
    >
      <div className="painting-media">
        <img
          className="painting-image"
          src={image.src}
          srcSet={image.srcSet}
          sizes="(max-width: 760px) calc(100vw - 2rem), (max-width: 1100px) 60vw, 800px"
          width={painting.imageWidth}
          height={painting.imageHeight}
          alt={painting.imageAlt}
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="painting-copy">
        <h2>
          {painting.museumUrl ? (
            <a
              href={painting.museumUrl}
              target="_blank"
              rel="noreferrer"
            >
              {painting.title}
            </a>
          ) : (
            painting.title
          )}
        </h2>
        <p className="painting-byline">
          {painting.artist} · {painting.year}
        </p>
        <p className="painting-museum">
          {painting.museum}, {painting.city}
        </p>
        <p className="painting-medium">{painting.medium}</p>

        <p className="painting-rights">
          Image:{' '}
          <a
            href={painting.imageSourceUrl}
            target="_blank"
            rel="noreferrer"
          >
            {credit}
          </a>
          {' · '}
          <a
            href={painting.imageRightsUrl}
            target="_blank"
            rel="noreferrer"
          >
            {painting.imageRightsLabel}
          </a>
        </p>
      </div>
    </article>
  )
}
