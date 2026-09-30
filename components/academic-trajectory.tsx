import {
  faBuildingColumns,
  faChalkboardUser,
  faGraduationCap,
  faHandshake,
  faMagnifyingGlassChart,
} from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  trajectoryItems,
  type TrajectoryCategory,
  type TrajectoryItem,
} from '@/content/trajectory'

type Group = {
  category: TrajectoryCategory
  title: string
  legend: string
  icon: IconDefinition
}

const GROUPS: Group[] = [
  {
    category: 'faculty',
    title: 'Faculty appointments',
    legend: 'Tenure-track',
    icon: faBuildingColumns,
  },
  {
    category: 'research',
    title: 'Research',
    legend: 'Research',
    icon: faMagnifyingGlassChart,
  },
  {
    category: 'teaching',
    title: 'Teaching',
    legend: 'Teaching',
    icon: faChalkboardUser,
  },
  {
    category: 'consultancy',
    title: 'Consultancy',
    legend: 'Consultancy',
    icon: faHandshake,
  },
  {
    category: 'education',
    title: 'Education',
    legend: 'Education',
    icon: faGraduationCap,
  },
]

function periodLabel(item: TrajectoryItem) {
  return item.endYear === null
    ? `${item.startYear}–ongoing`
    : `${item.startYear}–${item.endYear}`
}

function currentAmsterdamYear() {
  return Number(
    new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/Amsterdam',
      year: 'numeric',
    }).format(new Date())
  )
}

export default function AcademicTrajectory() {
  const currentYear = Math.max(
    currentAmsterdamYear(),
    ...trajectoryItems.map((item) => item.endYear ?? item.startYear)
  )
  const startYear = Math.min(
    ...trajectoryItems.map((item) => item.startYear)
  )
  const years = Array.from(
    { length: currentYear - startYear + 1 },
    (_, index) => startYear + index
  )
  const yearGrid = {
    gridTemplateColumns: `repeat(${years.length}, minmax(0, 1fr))`,
  }
  const axisYears = years.filter(
    (year) =>
      year === startYear ||
      year === currentYear ||
      (year - startYear) % 4 === 0
  )

  return (
    <div className="trajectory">
      <div className="trajectory-axis" aria-hidden="true">
        <span />
        <div className="trajectory-year-grid" style={yearGrid}>
          {axisYears.map((year) => (
            <span
              key={year}
              style={{
                gridColumn: years.indexOf(year) + 1,
              }}
            >
              {year === currentYear ? 'Present' : year}
            </span>
          ))}
        </div>
      </div>

      <div className="trajectory-groups">
        {GROUPS.map((group) => {
          const items = trajectoryItems
            .filter((item) => item.category === group.category)
            .sort(
              (a, b) =>
                b.startYear - a.startYear ||
                (b.endYear ?? currentYear) -
                  (a.endYear ?? currentYear) ||
                a.role.localeCompare(b.role)
            )

          return (
            <section
              className="trajectory-group"
              key={group.category}
              aria-labelledby={`trajectory-${group.category}`}
            >
              <div className="trajectory-group-heading">
                <FontAwesomeIcon
                  icon={group.icon}
                  aria-hidden="true"
                />
                <h2 id={`trajectory-${group.category}`}>
                  {group.title}
                </h2>
              </div>

              <div className="trajectory-rows">
                {items.map((item) => {
                  const effectiveEnd =
                    item.endYear ?? currentYear
                  const startColumn =
                    item.startYear - startYear + 1
                  const span =
                    effectiveEnd - item.startYear + 1
                  const ongoing = item.endYear === null

                  return (
                    <div
                      className="trajectory-row"
                      key={`${item.role}-${item.institution}-${item.startYear}`}
                    >
                      <div
                        className={[
                          'trajectory-role',
                          ongoing
                            ? 'trajectory-role-ongoing'
                            : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                      >
                        <span className="trajectory-role-icon">
                          <FontAwesomeIcon
                            icon={group.icon}
                            aria-hidden="true"
                          />
                        </span>
                        <div>
                          <h3>{item.role}</h3>
                          <p>{item.institution}</p>
                          <small>{periodLabel(item)}</small>
                        </div>
                      </div>

                      <div
                        className="trajectory-track"
                        style={yearGrid}
                        aria-label={`${item.role}, ${item.institution}, ${periodLabel(item)}`}
                      >
                        <span
                          className={[
                            'trajectory-band',
                            ongoing
                              ? 'trajectory-band-ongoing'
                              : '',
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          style={{
                            gridColumn: `${startColumn} / span ${span}`,
                          }}
                          title={periodLabel(item)}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}
      </div>

      <div
        className="trajectory-legend"
        aria-label="Academic trajectory legend"
      >
        <div className="trajectory-legend-types">
          {GROUPS.map((group) => (
            <span key={group.category}>
              <FontAwesomeIcon
                icon={group.icon}
                aria-hidden="true"
              />
              {group.legend}
            </span>
          ))}
        </div>
        <div className="trajectory-legend-status">
          <span>
            <i className="trajectory-status-swatch" />
            Completed
          </span>
          <span>
            <i className="trajectory-status-swatch trajectory-status-swatch-ongoing" />
            Ongoing
          </span>
        </div>
      </div>
    </div>
  )
}
