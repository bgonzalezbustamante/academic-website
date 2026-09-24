import { siteProfile } from '@/content/site'

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-shell footer-inner">
        <p>© {new Date().getFullYear()} {siteProfile.name}</p>
        <p>Next.js · Netlify · Supabase public RPCs</p>
      </div>
    </footer>
  )
}
