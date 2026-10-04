export const PROFILE_AUTHOR_NAME = 'Bastián González-Bustamante'

type AuthoredItem = {
  authors: string[]
}

export function normalizeAuthors(authors: string[]) {
  return Array.from(
    new Set(
      authors
        .map((author) => author.trim())
        .filter(Boolean)
    )
  )
}

export function isProfileFirstAuthor(authors: string[]) {
  return normalizeAuthors(authors)[0] === PROFILE_AUTHOR_NAME
}

export function firstAuthorPercentage(items: AuthoredItem[]) {
  if (items.length === 0) return 0

  const firstAuthored = items.filter((item) =>
    isProfileFirstAuthor(item.authors)
  ).length

  return (firstAuthored / items.length) * 100
}
