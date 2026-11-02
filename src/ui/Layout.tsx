import type { ReactNode } from 'react'
import { consent, contact, cta, footer, home, nav } from '../content/copy.ts'
import { paths, site } from '../content/site.ts'
import { Icon } from './Icon.tsx'
import { Button } from './parts.tsx'

export function whatsappHref() {
  return site.whatsapp ? `https://wa.me/${site.whatsapp}` : null
}

function Logo() {
  return (
    <a href={paths.home} className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <img src="/favicon.svg" alt="" width="32" height="32" />
      <span className="leading-none">
        <span className="block text-base font-semibold tracking-wide">PLATINUM</span>
        <span className="block text-[0.625rem] tracking-[0.14em] text-muted">MARKETING AGENCY</span>
      </span>
    </a>
  )
}

function Header({ path }: { path: string }) {
  const links = nav.items.map((item) => (
    <a
      key={item.href}
      href={paths[item.href]}
      aria-current={paths[item.href] === path ? 'page' : undefined}
      className="nav-link"
    >
      {item.label}
    </a>
  ))
  return (
    <header className="fixed inset-x-0 top-0 z-30 bg-[#03050a]/90">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-5 lg:flex" aria-label="Main">
          {links}
          <Button href={paths.contact}>{cta.book}</Button>
        </nav>
        <details className="group lg:hidden" data-menu>
          <summary className="flex size-11 cursor-pointer list-none items-center justify-center" aria-label={nav.menu}>
            <Icon name="menu" />
          </summary>
          <nav className="absolute inset-x-0 top-16 border-b border-line bg-[#03050a]" aria-label="Mobile">
            <div className="wrap flex flex-col gap-1 py-3">
              {links}
              <div className="mt-2">
                <Button href={paths.contact}>{cta.book}</Button>
              </div>
            </div>
          </nav>
        </details>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="relative z-10 overflow-hidden border-t border-line bg-[#03050a] text-sm">
      <div className="wrap grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-muted">{site.tagline}</p>
        </div>
        <FooterColumn title={footer.servicesTitle}>
          {home.services.cards.map((card) => (
            <a key={card.href} href={paths[card.href]}>
              {card.label}
            </a>
          ))}
        </FooterColumn>
        <FooterColumn title={footer.companyTitle}>
          {footer.company.map((link) => (
            <a key={link.href} href={paths[link.href]}>
              {link.label}
            </a>
          ))}
        </FooterColumn>
        <FooterColumn title={footer.contactTitle}>
          <a href={`mailto:${site.email}`} className="break-all">
            {site.email}
          </a>
          {site.phone && site.phoneE164 && <a href={`tel:${site.phoneE164}`}>{site.phone}</a>}
          <span className="text-muted">{site.location}</span>
        </FooterColumn>
      </div>
      <div className="wrap border-t border-line py-5 pr-20 text-muted">{footer.copyright}</div>
      <p className="wordmark" aria-hidden="true">
        PLATINUM
      </p>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h2 className="font-semibold">{title}</h2>
      <div className="footer-links mt-3 flex flex-col gap-2">{children}</div>
    </div>
  )
}

function WhatsAppButton() {
  const href = whatsappHref()
  return (
    <a
      href={href ?? `${paths.contact}#details`}
      className="fixed right-4 bottom-4 z-40 flex size-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-lg transition-transform hover:scale-105 sm:right-6 sm:bottom-6"
      aria-label={href ? contact.whatsapp : contact.formTitle}
      {...(href ? { target: '_blank', rel: 'noopener' } : {})}
    >
      <Icon name="whatsapp" className="size-7" />
    </a>
  )
}

function ConsentBanner() {
  return (
    <div
      data-consent
      hidden
      className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-lg border border-line bg-[#0a0d14] p-4 text-sm shadow-lg sm:bottom-6"
    >
      <p>{consent.text}</p>
      <div className="flex gap-2">
        <button type="button" data-consent-choice="declined" className="btn btn-outline">
          {consent.decline}
        </button>
        <button type="button" data-consent-choice="accepted" className="btn btn-primary">
          {consent.accept}
        </button>
      </div>
    </div>
  )
}

function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <svg viewBox="0 0 100 100" className="loader-ring">
        <circle cx="50" cy="50" r="48" pathLength="100" />
      </svg>
      <img src="/favicon.svg" alt="" width="56" height="56" />
    </div>
  )
}

export function Layout({ path, children }: { path: string; children: ReactNode }) {
  return (
    <>
      <canvas data-stage className="stage-canvas" aria-hidden="true" />
      {path === paths.home && <Loader />}
      <a href="#main" className="skip-link">
        {nav.skip}
      </a>
      <Header path={path} />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer />
      <WhatsAppButton />
      {site.gaId && <ConsentBanner />}
    </>
  )
}
