'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <section className="page-section">
      <div className="site-shell narrow-shell">
        <p className="eyebrow">Temporary problem</p>
        <h1>This page could not be loaded.</h1>
        <p className="page-lead">
          The public website could not retrieve the information needed for
          this page. No private Research Dashboard data is used as a fallback.
        </p>
        <button className="button primary" type="button" onClick={reset}>
          Try again
        </button>
      </div>
    </section>
  )
}
