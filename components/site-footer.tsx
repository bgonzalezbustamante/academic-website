import Link from 'next/link'

import { siteProfile } from '@/content/site'
import { currentRelease } from '@/lib/releases'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <div>
          <p>© {new Date().getFullYear()} {siteProfile.name}</p>
          <p>Next.js · Netlify · Supabase public RPCs</p>
        </div>

        <p>
          <Link href="/release-notes">
            Academic Website — {currentRelease.version} &quot;{currentRelease.codename}&quot;
          </Link>
        </p>
      </div>
    </footer>
  )
}
