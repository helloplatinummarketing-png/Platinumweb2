import { useState, type MouseEvent } from 'react'
import { links, nav } from '../content/copy'
import { scrollToShot } from '../timeline/useMasterTimeline'
import { MagneticButton } from './MagneticButton'

export function Logo() {
  return (
    <span className="flex items-center gap-3">
      <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" fill="#d4af37" />
        {Array.from({ length: 12 }, (_, i) => (
          <line
            key={i}
            x1="11"
            y1="5.5"
            x2="11"
            y2="1"
            stroke={i % 3 === 0 ? '#d4af37' : '#c9ccd1'}
            strokeWidth="1"
            transform={`rotate(${i * 30} 11 11)`}
          />
        ))}
      </svg>
      <span className="leading-none">
        <span className="block font-mono text-[12px] tracking-[0.3em] text-ink">{nav.logo}</span>
        <span className="mt-1 block font-mono text-[8px] tracking-[0.3em] text-slate-400">{nav.logoSub}</span>
      </span>
    </span>
  )
}

export function Nav() {
  const [open, setOpen] = useState(false)

  const go = (shot: string) => (e: MouseEvent) => {
    e.preventDefault()
    setOpen(false)
    scrollToShot(shot)
  }

  return (
    <header className="fixed inset-x-0 top-0 z-30">
      <nav aria-label="Main" className="flex items-center justify-between px-5 py-5 md:px-10">
        <a href="#hero" onClick={go('hero')} aria-label="Platinum Marketing Agency, back to top">
          <Logo />
        </a>
        <ul className="micro hidden items-center gap-8 text-slate-300 md:flex">
          {nav.items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-8">
              {i > 0 && <span aria-hidden="true" className="text-slate-600">·</span>}
              <a href={`#${item.shot}`} onClick={go(item.shot)} className="transition-colors hover:text-gold">
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-3">
          <MagneticButton href={links.bookDemo} target="_blank" rel="noopener" size="sm" className="hidden sm:inline-flex">
            {nav.cta}
          </MagneticButton>
          <button
            type="button"
            className="micro border border-white/20 px-3 py-2 text-ink md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((o) => !o)}
          >
            {open ? 'CLOSE' : 'MENU'}
          </button>
        </div>
      </nav>
      {open && (
        <div id="mobile-menu" className="glass mx-5 p-6 md:hidden">
          <ul className="micro space-y-5 text-ink">
            {nav.items.map((item) => (
              <li key={item.label}>
                <a href={`#${item.shot}`} onClick={go(item.shot)}>
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a href={links.bookDemo} target="_blank" rel="noopener" className="text-gold">
                {nav.cta} →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
