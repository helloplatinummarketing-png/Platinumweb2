import type { MouseEvent } from 'react'
import { footer, links } from '../../content/copy'
import { scrollToShot } from '../../timeline/useMasterTimeline'
import { Logo } from '../Nav'
import { ShotSection } from '../ShotSection'

const go = (shot: string) => (e: MouseEvent) => {
  e.preventDefault()
  scrollToShot(shot)
}

/** The footer sits on the scene's floor plane while the core idles above it. */
export function Footer() {
  return (
    <ShotSection id="footer" contentClassName="flex min-h-svh flex-col justify-end px-6 pb-24 pt-[50svh] md:px-16">
      <footer className="floor-plane border-t border-white/10 pt-10">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div data-fade>
            <Logo />
            <p className="micro mt-5 text-slate-500">{footer.location}</p>
          </div>
          {footer.columns.map((col) => (
            <nav key={col.title} data-fade aria-label={col.title}>
              <h2 className="micro text-gold">{col.title}</h2>
              <ul className="mt-4 space-y-2 text-sm text-slate-400">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={`#${l.shot}`} onClick={go(l.shot)} className="hover:text-ink">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <address data-fade className="not-italic">
            <h2 className="micro text-gold">{footer.contactTitle}</h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-400">
              <li>
                <a href={links.phone} className="hover:text-ink">
                  {links.phoneLabel}
                </a>
              </li>
              <li>
                <a href={links.email} className="break-all hover:text-ink">
                  {links.emailLabel}
                </a>
              </li>
              <li>
                <a href={links.site} className="hover:text-ink">
                  {links.siteLabel}
                </a>
              </li>
            </ul>
          </address>
        </div>
        <div data-fade className="micro mt-12 flex flex-wrap justify-between gap-4 border-t border-white/10 pt-6 text-[9px] text-slate-500">
          <p>{footer.copyright}</p>
          <p className="flex gap-6">
            <a href={links.privacy} className="hover:text-ink">
              Privacy Policy
            </a>
            <a href={links.terms} className="hover:text-ink">
              Terms
            </a>
          </p>
        </div>
      </footer>
    </ShotSection>
  )
}
