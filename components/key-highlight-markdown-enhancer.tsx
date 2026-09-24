'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const richTextSelector =
  '.key-highlight-markdown-source'

const latexReplacements: Array<[
  RegExp,
  string,
]> = [
  [/\\alpha\b/g, 'α'],
  [/\\beta\b/g, 'β'],
  [/\\gamma\b/g, 'γ'],
  [/\\delta\b/g, 'δ'],
  [/\\Delta\b/g, 'Δ'],
  [/\\epsilon\b/g, 'ε'],
  [/\\theta\b/g, 'θ'],
  [/\\lambda\b/g, 'λ'],
  [/\\mu\b/g, 'μ'],
  [/\\pi\b/g, 'π'],
  [/\\rho\b/g, 'ρ'],
  [/\\sigma\b/g, 'σ'],
  [/\\Sigma\b/g, 'Σ'],
  [/\\tau\b/g, 'τ'],
  [/\\phi\b/g, 'φ'],
  [/\\omega\b/g, 'ω'],
  [/\\Omega\b/g, 'Ω'],
  [/\\times\b/g, '×'],
  [/\\cdot\b/g, '·'],
  [/\\pm\b/g, '±'],
  [/\\leq\b/g, '≤'],
  [/\\geq\b/g, '≥'],
  [/\\neq\b/g, '≠'],
  [/\\approx\b/g, '≈'],
  [/\\rightarrow\b/g, '→'],
  [/\\leftarrow\b/g, '←'],
  [/\\infty\b/g, '∞'],
  [/\\sum\b/g, '∑'],
  [/\\prod\b/g, '∏'],
]

function formatMathSource(
  value: string
) {
  let result = value.trim()

  for (const [pattern, replacement] of
    latexReplacements) {
    result = result.replace(
      pattern,
      replacement
    )
  }

  return result
    .replace(/\^2\b/g, '²')
    .replace(/\^3\b/g, '³')
    .replace(/_0\b/g, '₀')
    .replace(/_1\b/g, '₁')
    .replace(/_2\b/g, '₂')
    .replace(/_3\b/g, '₃')
}

function appendText(
  parent: HTMLElement,
  value: string
) {
  parent.appendChild(
    document.createTextNode(value)
  )
}

function appendInline(
  parent: HTMLElement,
  value: string
) {
  const tokenPattern =
    /(\*\*[^*]+\*\*|__[^_]+__|`[^`]+`|\$[^$\n]+\$|\\\([^\n]+?\\\)|\\textbf\{[^{}]+\}|\\emph\{[^{}]+\}|\\texttt\{[^{}]+\}|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|\*[^*\n]+\*|_[^_\n]+_)/g

  let cursor = 0

  for (const match of
    value.matchAll(tokenPattern)) {
    const index = match.index ?? 0

    if (index > cursor) {
      appendText(
        parent,
        value.slice(
          cursor,
          index
        )
      )
    }

    const token = match[0]

    if (
      token.startsWith('**') ||
      token.startsWith('__')
    ) {
      const strong =
        document.createElement(
          'strong'
        )
      strong.className =
        'key-highlight-markdown-strong'
      appendInline(
        strong,
        token.slice(2, -2)
      )
      parent.appendChild(strong)
    } else if (
      token.startsWith('`')
    ) {
      const code =
        document.createElement('code')
      code.className =
        'key-highlight-markdown-inline-code'
      code.textContent =
        token.slice(1, -1)
      parent.appendChild(code)
    } else if (
      token.startsWith('$') ||
      token.startsWith('\\(')
    ) {
      const math =
        document.createElement('span')
      math.className =
        'font-serif italic text-oxford-blue'
      math.textContent =
        formatMathSource(
          token.startsWith('$')
            ? token.slice(1, -1)
            : token.slice(2, -2)
        )
      parent.appendChild(math)
    } else if (
      token.startsWith('\\textbf{')
    ) {
      const strong =
        document.createElement(
          'strong'
        )
      strong.className =
        'key-highlight-markdown-strong'
      appendInline(
        strong,
        token.slice(8, -1)
      )
      parent.appendChild(strong)
    } else if (
      token.startsWith('\\emph{')
    ) {
      const emphasis =
        document.createElement('em')
      appendInline(
        emphasis,
        token.slice(6, -1)
      )
      parent.appendChild(emphasis)
    } else if (
      token.startsWith('\\texttt{')
    ) {
      const code =
        document.createElement('code')
      code.className =
        'key-highlight-markdown-inline-code'
      code.textContent =
        token.slice(8, -1)
      parent.appendChild(code)
    } else if (
      token.startsWith('[')
    ) {
      const linkMatch =
        token.match(
          /^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/
        )

      if (linkMatch) {
        const link =
          document.createElement('a')
        link.href = linkMatch[2]
        link.target = '_blank'
        link.rel =
          'noopener noreferrer'
        link.className =
          'key-highlight-markdown-link'
        link.textContent =
          linkMatch[1]
        parent.appendChild(link)
      } else {
        appendText(parent, token)
      }
    } else if (
      token.startsWith('*') ||
      token.startsWith('_')
    ) {
      const emphasis =
        document.createElement('em')
      appendInline(
        emphasis,
        token.slice(1, -1)
      )
      parent.appendChild(emphasis)
    } else {
      appendText(parent, token)
    }

    cursor = index + token.length
  }

  if (cursor < value.length) {
    appendText(
      parent,
      value.slice(cursor)
    )
  }
}

function createParagraph(
  lines: string[]
) {
  const paragraph =
    document.createElement('p')
  paragraph.className =
    'key-highlight-markdown-paragraph'

  lines.forEach((line, index) => {
    if (index > 0) {
      paragraph.appendChild(
        document.createElement('br')
      )
    }

    appendInline(
      paragraph,
      line
    )
  })

  return paragraph
}

function buildRichText(
  value: string
) {
  const container =
    document.createElement('div')
  container.className =
    'key-highlight-markdown-rendered'

  const lines = value
    .replace(/\r\n/g, '\n')
    .split('\n')

  let index = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      index += 1
      continue
    }

    if (trimmed.startsWith('```')) {
      const language =
        trimmed.slice(3).trim()
      const codeLines: string[] = []
      index += 1

      while (
        index < lines.length &&
        !lines[index]
          .trim()
          .startsWith('```')
      ) {
        codeLines.push(lines[index])
        index += 1
      }

      if (index < lines.length) {
        index += 1
      }

      const pre =
        document.createElement('pre')
      pre.className =
        'key-highlight-markdown-code-block'

      const code =
        document.createElement('code')
      code.className = 'key-highlight-markdown-code'
      code.textContent =
        codeLines.join('\n')

      if (language) {
        code.dataset.language =
          language
      }

      pre.appendChild(code)
      container.appendChild(pre)
      continue
    }

    if (
      trimmed === '$$' ||
      trimmed.startsWith('$$') ||
      trimmed === '\\['
    ) {
      const mathLines: string[] = []

      if (
        trimmed.startsWith('$$') &&
        trimmed !== '$$' &&
        trimmed.endsWith('$$')
      ) {
        mathLines.push(
          trimmed.slice(2, -2)
        )
        index += 1
      } else {
        const endToken =
          trimmed === '\\['
            ? '\\]'
            : '$$'

        if (
          trimmed.startsWith('$$') &&
          trimmed !== '$$'
        ) {
          mathLines.push(
            trimmed.slice(2)
          )
        }

        index += 1

        while (
          index < lines.length &&
          lines[index].trim() !==
            endToken
        ) {
          mathLines.push(
            lines[index]
          )
          index += 1
        }

        if (index < lines.length) {
          index += 1
        }
      }

      const math =
        document.createElement('div')
      math.className =
        'overflow-x-auto rounded-md border border-oxford-stone bg-oxford-off-white px-4 py-3 font-serif italic text-oxford-blue'
      math.textContent =
        formatMathSource(
          mathLines.join(' ')
        )
      container.appendChild(math)
      continue
    }

    const markdownHeading =
      line.match(/^(#{1,4})\s+(.+)$/)
    const latexHeading =
      trimmed.match(
        /^\\(section|subsection|subsubsection)\{(.+)\}$/
      )

    if (
      markdownHeading ||
      latexHeading
    ) {
      const level = markdownHeading
        ? Math.min(
            4,
            markdownHeading[1].length +
              1
          )
        : latexHeading?.[1] ===
            'section'
          ? 2
          : latexHeading?.[1] ===
              'subsection'
            ? 3
            : 4

      const heading =
        document.createElement(
          `h${level}`
        )
      heading.className =
        'key-highlight-markdown-heading'
      appendInline(
        heading,
        markdownHeading
          ? markdownHeading[2]
          : latexHeading?.[2] ?? ''
      )
      container.appendChild(heading)
      index += 1
      continue
    }

    if (
      /^[-*]\s+/.test(trimmed) ||
      /^\\item\s+/.test(trimmed)
    ) {
      const list =
        document.createElement('ul')
      list.className =
        'key-highlight-markdown-list'

      while (index < lines.length) {
        const itemLine =
          lines[index].trim()
        const itemMatch =
          itemLine.match(
            /^(?:[-*]\s+|\\item\s+)(.+)$/
          )

        if (!itemMatch) {
          break
        }

        const item =
          document.createElement('li')
        appendInline(
          item,
          itemMatch[1]
        )
        list.appendChild(item)
        index += 1
      }

      container.appendChild(list)
      continue
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      const list =
        document.createElement('ol')
      list.className =
        'key-highlight-markdown-list key-highlight-markdown-list-ordered'

      while (index < lines.length) {
        const itemMatch =
          lines[index]
            .trim()
            .match(/^\d+\.\s+(.+)$/)

        if (!itemMatch) {
          break
        }

        const item =
          document.createElement('li')
        appendInline(
          item,
          itemMatch[1]
        )
        list.appendChild(item)
        index += 1
      }

      container.appendChild(list)
      continue
    }

    if (trimmed.startsWith('> ')) {
      const quote =
        document.createElement(
          'blockquote'
        )
      quote.className =
        'key-highlight-markdown-quote'
      appendInline(
        quote,
        trimmed.slice(2)
      )
      container.appendChild(quote)
      index += 1
      continue
    }

    const paragraphLines = [line]
    index += 1

    while (
      index < lines.length &&
      lines[index].trim() &&
      !/^(#{1,4})\s+/.test(
        lines[index]
      ) &&
      !/^[-*]\s+/.test(
        lines[index].trim()
      ) &&
      !/^\d+\.\s+/.test(
        lines[index].trim()
      ) &&
      !/^>\s+/.test(
        lines[index].trim()
      ) &&
      !lines[index]
        .trim()
        .startsWith('```') &&
      !lines[index]
        .trim()
        .startsWith('$$') &&
      lines[index].trim() !==
        '\\[' &&
      !/^\\(?:section|subsection|subsubsection)\{/.test(
        lines[index].trim()
      ) &&
      !/^\\item\s+/.test(
        lines[index].trim()
      )
    ) {
      paragraphLines.push(
        lines[index]
      )
      index += 1
    }

    container.appendChild(
      createParagraph(
        paragraphLines
      )
    )
  }

  return container
}

function enhanceResearchText() {
  document
    .querySelectorAll<HTMLElement>(
      richTextSelector
    )
    .forEach((source) => {
      if (
        source.dataset.richTextSource ===
        'true'
      ) {
        return
      }

      const value =
        source.textContent ?? ''

      if (!value.trim()) {
        return
      }

      source.dataset.richTextSource =
        'true'
      source.hidden = true

      const rendered =
        buildRichText(value)
      rendered.dataset.richTextRendered =
        'true'
      rendered.className = 'key-highlight-markdown-rendered'

      source.insertAdjacentElement(
        'afterend',
        rendered
      )
    })
}

function clearResearchText() {
  document
    .querySelectorAll<HTMLElement>(
      '[data-rich-text-rendered="true"]'
    )
    .forEach((rendered) => {
      rendered.remove()
    })

  document
    .querySelectorAll<HTMLElement>(
      '[data-rich-text-source="true"]'
    )
    .forEach((source) => {
      delete source.dataset.richTextSource
      source.hidden = false
    })
}

export default function KeyHighlightMarkdownEnhancer() {
  const pathname = usePathname()

  useEffect(() => {
    enhanceResearchText()

    const main =
      document.querySelector('main')

    if (!main) {
      return
    }

    const observer =
      new MutationObserver(() => {
        enhanceResearchText()
      })

    observer.observe(main, {
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
      clearResearchText()
    }
  }, [pathname])

  return null
}
