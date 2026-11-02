'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { routes, whatsappHref } from '@/config/site'
import { nav } from '@/content/navigation'

function WhatsAppIcon({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
    </svg>
  )
}

/**
 * WhatsApp click-to-chat on every page, plus a "Book Free Check" pill once the
 * visitor has scrolled past the hero. Phones get both in one bottom bar so they can't overlap.
 */
export function FloatingActions() {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const update = () => setPastHero(window.scrollY > window.innerHeight * 0.8)
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  const hideWhenAtTop = pastHero ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'

  return (
    <>
      {/* Desktop */}
      <div className="fixed right-6 bottom-6 z-40 hidden items-center gap-3 lg:flex">
        <Link href={routes.contact} tabIndex={pastHero ? undefined : -1} aria-hidden={!pastHero} className={`btn btn-primary shadow-lg transition-all duration-300 ${hideWhenAtTop}`}>
          {nav.floatingCta}
        </Link>
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener"
          aria-label={nav.whatsapp}
          className="flex size-14 items-center justify-center rounded-full bg-accent text-bg shadow-lg transition-transform hover:scale-105"
        >
          <WhatsAppIcon className="size-7" />
        </a>
      </div>

      {/* Phones and tablets */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-border bg-bg/95 p-2 lg:hidden">
        <a
          href={whatsappHref()}
          target="_blank"
          rel="noopener"
          aria-label={nav.whatsapp}
          className={`flex h-12 items-center justify-center gap-2 rounded-full border border-border-strong font-semibold text-platinum ${pastHero ? 'w-12 shrink-0' : 'flex-1'}`}
        >
          <WhatsAppIcon className="size-5 text-accent" />
          {!pastHero && <span>{nav.whatsapp}</span>}
        </a>
        {pastHero && (
          <Link href={routes.contact} className="btn btn-primary flex-1">
            {nav.floatingCta}
          </Link>
        )}
      </div>
    </>
  )
}
