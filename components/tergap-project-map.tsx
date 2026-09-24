import AcademicWorldMap from '@/components/academic-world-map'
import tergapMapData from '@/public/data/tergap-map.json'

type Props = {
  compact?: boolean
}

export default function TergapProjectMap({
  compact = false,
}: Props) {
  const countries = tergapMapData.countries.map(
    (country) => ({
      iso3: country.iso3,
      label: country.country,
      value: country.complete_articles,
    })
  )

  return (
    <AcademicWorldMap
      countries={countries}
      ariaLabel="World map showing TERGAP news-corpus coverage by collection country"
      valueLabel="articles"
      compact={compact}
      updatedAt={tergapMapData.generated_at}
    />
  )
}
