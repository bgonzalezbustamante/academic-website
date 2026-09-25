import {
  faChalkboardUser,
  faUsers,
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import TeachingCardVisual from '@/components/teaching-card-visual'
import type { PublicTeachingItem } from '@/types/public'

function formatTeachingPeriod(item: PublicTeachingItem) {
  const { start_year: start, end_year: end, is_current: current } =
    item

  if (start && current) return `${start}–present`
  if (start && end) return start === end ? String(start) : `${start}–${end}`
  if (start) return String(start)
  if (end) return `Until ${end}`
  return null
}

function formatLevel(level: string) {
  const normalized = level.trim().toLowerCase()

  if (normalized === 'phd') return 'PhD'
  if (normalized === 'master' || normalized === 'masters') return 'Master'
  if (
    normalized === 'bachelor' ||
    normalized === 'undergraduate'
  ) {
    return 'Bachelor'
  }

  return level
    .trim()
    .replace(/(^|\s)\S/g, (match) => match.toUpperCase())
}

export default function TeachingCard({
  item,
  imageSide = 'left',
}: {
  item: PublicTeachingItem
  imageSide?: 'left' | 'right'
}) {
  const period = formatTeachingPeriod(item)

  return (
    <article
      className={
        imageSide === 'right'
          ? 'teaching-card teaching-card-image-right'
          : 'teaching-card'
      }
    >
      <div className="teaching-card-visual" aria-hidden="true">
        <TeachingCardVisual
          filename={item.course_image_filename}
        />
      </div>

      <div className="teaching-card-content">
        <div className="metadata-tags teaching-card-meta">
          {item.is_current && (
            <span className="metadata-tag metadata-tag-accent">
              Current
            </span>
          )}
          {period && (
            <span className="metadata-tag">{period}</span>
          )}
          {item.levels.map((level) => (
            <span className="metadata-tag" key={level}>
              {formatLevel(level)}
            </span>
          ))}
        </div>

        <h2>{item.name}</h2>

        {item.institution && (
          <p className="teaching-institution">
            {item.institution}
          </p>
        )}

        {item.summary && (
          <p className="teaching-summary">{item.summary}</p>
        )}

        <div
          className="teaching-card-stats"
          aria-label="Teaching summary"
        >
          <div className="teaching-stat">
            <span className="teaching-stat-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faChalkboardUser} />
            </span>
            <span>
              <strong>{item.times_taught.toLocaleString('en-GB')}</strong>
              <small>
                {item.times_taught === 1
                  ? 'Time taught'
                  : 'Times taught'}
              </small>
            </span>
          </div>

          <div className="teaching-stat">
            <span className="teaching-stat-icon" aria-hidden="true">
              <FontAwesomeIcon icon={faUsers} />
            </span>
            <span>
              <strong>{item.student_count.toLocaleString('en-GB')}</strong>
              <small>
                {item.student_count === 1 ? 'Student' : 'Students'}
              </small>
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}
