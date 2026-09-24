import Link from 'next/link'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/publications', label: 'Publications' },
]

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <Link className="site-mark" href="/" aria-label="Bastián González-Bustamante home">
          BGB
        </Link>
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
