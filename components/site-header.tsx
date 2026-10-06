import InstitutionStrip from '@/components/institution-strip'
import SiteNavigation from '@/components/site-navigation'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-shell header-inner">
        <InstitutionStrip />
        <SiteNavigation />
      </div>
    </header>
  )
}
