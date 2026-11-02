'use client'

import { useRef, useState, type RefObject } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { home } from '@/content/home'
import { useDeviceProfile } from '@/components/three/useDeviceProfile'

const ServiceStage = dynamic(() => import('@/components/three/ServiceStage'), { ssr: false })

/** Shown until the 3D is ready, and instead of it on devices without WebGL. */
function FallbackIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    browser: 'M8 14h48v36H8zM8 24h48M14 19h.01M20 19h.01M26 19h.01',
    chat: 'M10 14h44v30H26L14 54V44h-4zM22 29h.01M32 29h.01M42 29h.01',
    orb: 'M32 8a24 24 0 1 1 0 48 24 24 0 0 1 0-48zM22 26l10 12 12-8-12-10zM32 38v8',
  }
  return (
    <svg viewBox="0 0 64 64" className="size-20 text-silver" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[kind]} />
    </svg>
  )
}

export function Services() {
  const { services } = home
  const section = useRef<HTMLElement>(null)
  const slot0 = useRef<HTMLDivElement>(null)
  const slot1 = useRef<HTMLDivElement>(null)
  const slot2 = useRef<HTMLDivElement>(null)
  const slots: RefObject<HTMLDivElement | null>[] = [slot0, slot1, slot2]
  const hovered = useRef<number | null>(null)
  const profile = useDeviceProfile()
  const [ready, setReady] = useState(false)

  return (
    <section ref={section} id="services" className="relative z-10 scroll-mt-16 py-20 sm:py-32">
      <div className="wrap">
        <h2 className="section-heading text-metal">{services.title}</h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3 sm:mt-14">
          {services.cards.map((card, i) => (
            <li
              key={card.href}
              className="panel flex flex-col transition-colors hover:border-border-strong"
              onPointerEnter={() => (hovered.current = i)}
              onPointerLeave={() => (hovered.current = null)}
              onFocus={() => (hovered.current = i)}
              onBlur={() => (hovered.current = null)}
            >
              <div ref={slots[i]} className="-mx-2 flex h-44 items-center justify-center">
                {!ready && <FallbackIcon kind={card.kind} />}
              </div>
              <p className="mt-4 text-sm font-semibold text-accent">{card.label}</p>
              <h3 className="mt-2 font-display text-2xl leading-tight font-medium tracking-tight">{card.title}</h3>
              <p className="mt-3 mb-6 text-silver">{card.body}</p>
              <Link href={card.href} className="mt-auto inline-flex min-h-11 items-center gap-2 font-semibold text-platinum hover:text-accent" aria-label={`${services.more}: ${card.label}`}>
                {services.more}
                <span aria-hidden="true">→</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      {profile?.webgl && <ServiceStage section={section} slots={slots} hovered={hovered} profile={profile} onReady={() => setReady(true)} />}
    </section>
  )
}
