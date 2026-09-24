import type { PublicPaperDetail } from '@/types/public'

import ResilientLocalImage from '@/components/resilient-local-image'

type Props = {
  paper: PublicPaperDetail
}

export default function PublicationKeyHighlight({ paper }: Props) {
  const text = paper.highlight_text?.trim() || null
  const imageFilename =
    paper.highlight_image_filename?.trim() || null
  const caption =
    paper.highlight_image_caption?.trim() || null

  if (!text && !imageFilename && !caption) {
    return null
  }

  const imagePath = imageFilename
    ? `/publication-highlights/${paper.slug}/${imageFilename}`
    : null

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

      {imagePath && (
        <figure className="key-highlight-figure">
          <div className="key-highlight-image">
            <ResilientLocalImage
              src={imagePath}
              alt={paper.highlight_image_alt ?? ''}
              width={1200}
              height={800}
              sizes="(max-width: 900px) 100vw, 820px"
            />
          </div>
          {caption && (
            <figcaption>{caption}</figcaption>
          )}
        </figure>
      )}

      {!imagePath && caption && (
        <p className="key-highlight-caption">{caption}</p>
      )}
    </section>
  )
}
