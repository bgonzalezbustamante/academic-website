'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const navItems = [
  { href: '/', label: 'Home', paths: ['/'] },
  {
    href: '/publications',
    label: 'Publications',
    paths: ['/publications', '/publication'],
  },
  {
    href: '/projects',
    label: 'Projects',
    paths: ['/projects', '/project'],
  },
  { href: '/conferences', label: 'Conferences', paths: ['/conferences'] },
  { href: '/teaching', label: 'Teaching', paths: ['/teaching'] },
]

function isCurrentSection(pathname: string, paths: string[]) {
  return paths.some((path) =>
    path === '/'
      ? pathname === '/'
      : pathname === path || pathname.startsWith(`${path}/`)
  )
}

export default function SiteNavigation() {
  const pathname = usePathname()

  return (
    <nav aria-label="Primary navigation">
      <ul className="nav-list">
        {navItems.map((item) => {
          const isCurrent = isCurrentSection(pathname, item.paths)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isCurrent ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
