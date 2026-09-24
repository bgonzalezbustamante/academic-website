import Link from 'next/link'

import InstitutionStrip from '@/components/institution-strip'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/publications', label: 'Publications' },
  { href: '/projects', label: 'Projects' },
  { href: '/conferences', label: 'Conferences' },
]

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <InstitutionStrip />

        <nav aria-label="Primary navigation">
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
