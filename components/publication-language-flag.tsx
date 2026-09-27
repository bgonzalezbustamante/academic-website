import type { PublicPaperLanguage } from '@/types/public'

const LANGUAGE_FLAG_CODES: Record<PublicPaperLanguage, string> = {
  English: 'gb',
  Spanish: 'es',
  Portuguese: 'pt',
  Dutch: 'nl',
  German: 'de',
  French: 'fr',
  Italian: 'it',
}

export default function PublicationLanguageFlag({
  language,
}: {
  language: PublicPaperLanguage
}) {
  const countryCode = LANGUAGE_FLAG_CODES[language]

  return (
    <span
      className="publication-language"
      role="img"
      aria-label={`${language} publication`}
      title={language}
    >
      <span
        className="publication-language-flag"
        style={{
          backgroundImage: `url(/flags/${countryCode}.svg)`,
        }}
        aria-hidden="true"
      />
    </span>
  )
}
