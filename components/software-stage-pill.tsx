import type { PublicSoftwareDevelopmentStage } from '@/types/public'

export const SOFTWARE_DEVELOPMENT_STAGES: PublicSoftwareDevelopmentStage[] = [
  'Alpha',
  'Beta',
  'Release candidate',
  'Stable',
  'Maintenance',
]

const STAGE_CLASS: Record<PublicSoftwareDevelopmentStage, string> = {
  Alpha: 'software-stage-pill-alpha',
  Beta: 'software-stage-pill-beta',
  'Release candidate': 'software-stage-pill-release-candidate',
  Stable: 'software-stage-pill-stable',
  Maintenance: 'software-stage-pill-maintenance',
}

type Props = {
  stage: PublicSoftwareDevelopmentStage
}

export default function SoftwareStagePill({ stage }: Props) {
  return (
    <span className={`metadata-tag ${STAGE_CLASS[stage]}`}>
      {stage}
    </span>
  )
}
