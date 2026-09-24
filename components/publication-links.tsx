import type { PublicPaper } from '@/types/public'

type Props = {
  paper: PublicPaper
}

export default function PublicationLinks({ paper }: Props) {
  const links = [
    ['DOI', paper.doi_url],
    ['Publication', paper.publication_url],
    ['Preprint', paper.preprint_url],
    ['Code', paper.github_url],
    ['Dataset', paper.dataset_url],
  ].filter((entry): entry is [string, string] => Boolean(entry[1]))

  if (links.length === 0) return null

  return (
    <div className="link-row" aria-label="Publication resources">
      {links.map(([label, href]) => (
        <a key={`${label}-${href}`} href={href} target="_blank" rel="noreferrer">
          {label}
        </a>
      ))}
    </div>
  )
}
