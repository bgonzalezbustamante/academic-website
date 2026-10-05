import type { SelectedPainting } from '@/content/paintings'

type Props = {
  painting: SelectedPainting
}

export default function PaintingCard({ painting }: Props) {
  const credit =
    painting.imageCredit ?? painting.imageSourceName

  return (
    <article
      className={`painting-tile painting-tile-${painting.layout}`}
    >
      <div className="painting-media">
        <img
          className="painting-image"
          src={painting.imageUrl}
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
