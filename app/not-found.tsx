import Image from 'next/image'
import Link from 'next/link'

export default function NotFound() {
  return (
    <section className="page-section not-found-section">
      <div className="site-shell not-found-layout">
        <div className="not-found-copy">
          <p className="eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="page-lead">
            The requested public page does not exist.
          </p>
          <Link className="button primary" href="/">
            Return home
          </Link>
        </div>

        <div className="not-found-illustration">
          <Image
            src="/errors/404_penguin.svg"
            alt="Penguin reading beside a stack of books"
            width={1600}
            height={1600}
            sizes="(max-width: 760px) 72vw, 44vw"
            priority
            unoptimized
          />
        </div>
      </div>
    </section>
  )
}
