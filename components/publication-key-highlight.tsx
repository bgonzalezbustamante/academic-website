/* eslint-disable @next/next/no-img-element -- Highlight figures are WebP generated locally by scripts/build-images.mjs; Next.js image optimisation would re-encode them. */
import { figureImage } from '@/lib/local-images'
import type { PublicPaperDetail } from '@/types/public'

type Props = {
  paper: PublicPaperDetail
}

export default function PublicationKeyHighlight({ paper }: Props) {
  const text = paper.highlight_text?.trim() || null
  const image = figureImage(
    'publication-highlights',
    paper.slug,
    paper.highlight_image_filename
  )
  const caption =
    paper.highlight_image_caption?.trim() || null

  if (!text && !image && !caption) {
    return null
  }

  return (
    <section className="key-highlight-section">
      <p className="eyebrow">Research highlight</p>
      <h2>Key highlight</h2>

      {text && (
        <>
          <p className="key-highlight-text research-markdown-source">
            {text}
          </p>
        </>
      )}

      {image && (
        <figure className="key-highlight-figure">
          <div className="key-highlight-image">
            <img
              src={image.src}
              srcSet={image.srcSet}
              sizes="(max-width: 900px) 100vw, 820px"
              width={image.width}
              height={image.height}
              alt={paper.highlight_image_alt ?? ''}
              loading="lazy"
              decoding="async"
            />
          </div>
          {caption && (
            <figcaption>{caption}</figcaption>
          )}
        </figure>
      )}

      {!image && caption && (
        <p className="key-highlight-caption">{caption}</p>
      )}
    </section>
  )
}
