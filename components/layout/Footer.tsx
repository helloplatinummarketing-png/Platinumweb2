import Link from 'next/link'
import { site, whatsappHref } from '@/config/site'
import { footer, nav } from '@/content/navigation'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-border bg-bg pb-24 text-sm lg:pb-0">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-silver">{site.tagline}</p>
        </div>
        {footer.groups.map((group) => (
          <div key={group.title}>
            <h2 className="font-display font-semibold">{group.title}</h2>
            <ul className="mt-3 space-y-2">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-silver hover:text-platinum hover:underline">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <h2 className="font-display font-semibold">{footer.contactTitle}</h2>
          <ul className="mt-3 space-y-2 text-silver">
            <li>
              <a href={`mailto:${site.email}`} className="wrap-anywhere hover:text-platinum hover:underline">
                {site.email}
              </a>
            </li>
            <li>
              {site.phoneE164 ? (
                <a href={`tel:${site.phoneE164}`} className="hover:text-platinum hover:underline">
                  {site.phoneDisplay}
                </a>
              ) : (
                site.phoneDisplay
              )}
            </li>
            <li>
              <a href={whatsappHref()} target="_blank" rel="noopener" className="hover:text-platinum hover:underline">
                {nav.whatsapp}
              </a>
            </li>
            <li>{site.location}</li>
          </ul>
        </div>
      </div>
      <div className="wrap border-t border-border py-5 text-silver">{footer.copyright}</div>
    </footer>
  )
}
