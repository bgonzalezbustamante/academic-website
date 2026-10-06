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
      ariaLabel="Africa-centred map showing TERGAP news-corpus coverage by collection country"
      valueLabel="articles"
      singularValueLabel="article"
      palette="tergap"
      view="africa"
      compact={compact}
      updatedAt={tergapMapData.generated_at}
    />
  )
}
