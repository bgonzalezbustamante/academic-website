import * as isoCountries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'

isoCountries.registerLocale(enLocale)

const COUNTRY_ALIASES: Record<string, string> = {
  'United States of America': 'United States',
  'Czech Republic': 'Czechia',
  'South Korea': 'Korea, Republic of',
  'North Korea': "Korea, Democratic People's Republic of",
  'Russia': 'Russian Federation',
  'Vietnam': 'Viet Nam',
  'Bolivia': 'Bolivia, Plurinational State of',
  'Venezuela': 'Venezuela, Bolivarian Republic of',
  'Tanzania': 'Tanzania, United Republic of',
  'Moldova': 'Moldova, Republic of',
}

export function extractCountryFromLocation(
  location: string | null
) {
  if (!location) return null

  const parts = location
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)

  return parts.at(-1) ?? null
}

export function countryNameToIso3(country: string) {
  const candidate = COUNTRY_ALIASES[country] ?? country

  return (
    isoCountries.getAlpha3Code(candidate, 'en') ??
    isoCountries.getAlpha3Code(country, 'en') ??
    null
  )
}
