import type { PublicPaperLanguage } from '@/types/public'

const LANGUAGE_FLAGS: Record<PublicPaperLanguage, string> = {
  English: '🇬🇧',
  Spanish: '🇪🇸',
  Portuguese: '🇵🇹',
  Dutch: '🇳🇱',
  German: '🇩🇪',
  French: '🇫🇷',
  Italian: '🇮🇹',
}

export default function PublicationLanguageFlag({
  language,
}: {
  language: PublicPaperLanguage
}) {
  return (
    <span
      className="publication-language-flag"
      role="img"
      aria-label={`${language} publication`}
      title={language}
    >
      {LANGUAGE_FLAGS[language]}
    </span>
  )
}
