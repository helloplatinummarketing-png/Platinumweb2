'use client'

import { useEffect, useRef } from 'react'
import { home } from '@/content/home'
import { loadGsap, prefersReducedMotion, queueRefresh } from '@/lib/gsap'

function MetalDefs({ id }: { id: string }) {
  return (
    <defs>
      <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ffffff" />
        <stop offset="0.5" stopColor="#8f9299" />
        <stop offset="1" stopColor="#e5e4e2" />
      </linearGradient>
    </defs>
  )
}

/** Lightweight dimensional icons: a metal object, a soft shadow, and one accent mark. */
const ICONS: Record<string, React.ReactNode> = {
  signal: (
    <>
      <MetalDefs id="metal-signal" />
      <ellipse cx="32" cy="56" rx="17" ry="3" fill="#000" opacity="0.55" />
      <g fill="url(#metal-signal)">
        <rect x="8" y="38" width="9" height="14" rx="2" />
        <rect x="21" y="28" width="9" height="24" rx="2" />
      </g>
      <g fill="none" stroke="#9ea3ad" strokeDasharray="3 4" strokeWidth="1.5">
        <rect x="34.75" y="18.75" width="8.5" height="32.5" rx="2" />
        <rect x="47.75" y="8.75" width="8.5" height="42.5" rx="2" />
      </g>
      <path d="M31 12 58 46" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  phone: (
    <>
      <MetalDefs id="metal-phone" />
      <ellipse cx="30" cy="57" rx="14" ry="3" fill="#000" opacity="0.55" />
      <rect x="17" y="6" width="26" height="48" rx="5" fill="url(#metal-phone)" />
      <rect x="20" y="11" width="20" height="36" rx="2" fill="#07080b" />
      <path d="m25 23 5 5 5-5m-5 5v-9" fill="none" stroke="var(--accent)" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M25 37h10" stroke="#9ea3ad" strokeWidth="2" strokeLinecap="round" />
      <path d="M49 17c3 3 3 8 0 11m5-15c5 5 5 14 0 19" fill="none" stroke="#9ea3ad" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 4" />
    </>
  ),
  eye: (
    <>
      <MetalDefs id="metal-eye" />
      <ellipse cx="32" cy="56" rx="19" ry="3" fill="#000" opacity="0.55" />
      <path d="M4 30C11 17 21 11 32 11s21 6 28 19c-7 13-17 19-28 19S11 43 4 30Z" fill="url(#metal-eye)" />
      <circle cx="32" cy="30" r="12" fill="#07080b" />
      <circle cx="32" cy="30" r="5" fill="#9ea3ad" />
      <path d="M11 51 53 9" stroke="#07080b" strokeWidth="7" strokeLinecap="round" />
      <path d="M11 51 53 9" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" />
    </>
  ),
}

export function Problem() {
  const list = useRef<HTMLUListElement>(null)
  const { problem } = home

  useEffect(() => {
    if (prefersReducedMotion()) return
    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !list.current) return
      const tween = gsap.from(list.current.children, {
        opacity: 0,
        y: 48,
        duration: 0.8,
        stagger: 0.16,
        ease: 'power3.out',
        scrollTrigger: { trigger: list.current, start: 'top 85%', once: true },
      })
      queueRefresh(() => ScrollTrigger.refresh())
      cleanup = () => {
        tween.scrollTrigger?.kill()
        tween.revert()
      }
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <section className="relative z-10 py-20 sm:py-32">
      <div className="wrap">
        <h2 className="section-heading text-metal max-w-4xl">{problem.title}</h2>
        <ul ref={list} className="mt-10 grid gap-5 md:grid-cols-3 sm:mt-14">
          {problem.points.map((point) => (
            <li key={point.title} className="panel">
              <svg viewBox="0 0 64 64" className="size-16" aria-hidden="true">
                {ICONS[point.icon]}
              </svg>
              <h3 className="mt-5 font-display text-xl font-medium">{point.title}</h3>
              <p className="mt-2 text-silver">{point.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
