export const PROFILE_AUTHOR_NAME = 'Bastián González-Bustamante'

type AuthoredItem = {
  authors: string[]
}

export function isProfileFirstAuthor(authors: string[]) {
  return authors[0]?.trim() === PROFILE_AUTHOR_NAME
}

export function firstAuthorPercentage(items: AuthoredItem[]) {
  if (items.length === 0) return 0

  const firstAuthored = items.filter((item) =>
    isProfileFirstAuthor(item.authors)
  ).length

  return (firstAuthored / items.length) * 100
}
