'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { routes } from '@/config/site'
import { nav } from '@/content/navigation'
import { Logo } from './Logo'

export function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const button = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      button.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const linkClass = (href: string) =>
    `flex min-h-11 items-center text-sm font-medium transition-colors hover:text-accent ${pathname === href ? 'text-accent' : 'text-platinum'}`

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-border bg-bg/85">
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          {nav.items.map((item) => (
            <Link key={item.href} href={item.href} className={linkClass(item.href)} aria-current={pathname === item.href ? 'page' : undefined}>
              {item.label}
            </Link>
          ))}
          <Link href={routes.contact} className="btn btn-primary !min-h-10 !py-2 text-sm">
            {nav.cta}
          </Link>
        </nav>
        <button
          ref={button}
          type="button"
          className="flex size-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? nav.closeMenu : nav.openMenu}
          onClick={() => setOpen((v) => !v)}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
            <path d={open ? 'M6 6l12 12M18 6 6 18' : 'M4 7h16M4 12h16M4 17h16'} />
          </svg>
        </button>
      </div>
      {open && (
        <nav id="mobile-menu" className="border-t border-border bg-bg lg:hidden" aria-label="Mobile">
          <div className="wrap flex flex-col gap-1 py-3">
            {nav.items.map((item) => (
              <Link key={item.href} href={item.href} className={linkClass(item.href)} aria-current={pathname === item.href ? 'page' : undefined} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <Link href={routes.contact} className="btn btn-primary mt-2" onClick={() => setOpen(false)}>
              {nav.cta}
            </Link>
          </div>
        </nav>
      )}
    </header>
  )
}
