import { Fragment, type ReactNode } from 'react'

type Props = {
  text: string
  className?: string
}

function renderInline(value: string): ReactNode[] {
  return value
    .split(/(\*\*.+?\*\*)/g)
    .filter(Boolean)
    .map((segment, index) => {
      if (
        segment.startsWith('**') &&
        segment.endsWith('**')
      ) {
        return (
          <strong key={index}>
            {segment.slice(2, -2)}
          </strong>
        )
      }

      return segment
    })
}

export default function FormattedText({
  text,
  className,
}: Props) {
  const paragraphs = text
    .replace(/\r\n/g, '\n')
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

  return (
    <div className={className}>
      {paragraphs.map((paragraph, paragraphIndex) => {
        const lines = paragraph.split('\n')

        return (
          <p key={paragraphIndex}>
            {lines.map((line, lineIndex) => (
              <Fragment key={lineIndex}>
                {renderInline(line)}
                {lineIndex < lines.length - 1 && <br />}
              </Fragment>
            ))}
          </p>
        )
      })}
    </div>
  )
}
