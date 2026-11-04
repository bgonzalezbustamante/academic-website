// Turns Markdown/LaTeX-flavoured abstracts into plain text for meta
// descriptions and structured data, truncated at a word boundary.
export function plainSummary(text: string, maxLength = 160) {
  const plain = text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\$([^$]*)\$/g, '$1')
    .replace(/\\[a-zA-Z]+\{([^}]*)\}/g, '$1')
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[*_`#>~{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim()

  if (plain.length <= maxLength) return plain

  const cut = plain.slice(0, maxLength - 1)
  const lastSpace = cut.lastIndexOf(' ')

  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.]+$/, '')}…`
}

// Papers often keep their DOI in publication_url (a doi.org or /doi/ link).
export function doiFromUrl(url: string | null) {
  return url?.match(/10\.\d{4,9}\/\S+/)?.[0] ?? null
}
