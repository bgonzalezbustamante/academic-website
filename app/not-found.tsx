import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-section">
      <div className="site-shell narrow-shell">
        <p className="eyebrow">404</p>
        <h1>Page not found</h1>
        <p className="page-lead">The requested public page does not exist.</p>
        <Link className="button primary" href="/">Return home</Link>
      </div>
    </section>
  )
}
