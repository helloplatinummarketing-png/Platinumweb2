'use client'

import { useEffect, useRef } from 'react'
import { stats, statsCopy } from '@/config/stats'
import { loadGsap, prefersReducedMotion } from '@/lib/gsap'

function StatValue({ value }: { value: number | null }) {
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || value === null || prefersReducedMotion()) return
    let frame = 0
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()
        const started = performance.now()
        const tick = (now: number) => {
          const t = Math.min((now - started) / 1800, 1)
          el.textContent = Math.round(value * (1 - (1 - t) ** 3)).toLocaleString('en-KE')
          if (t < 1) frame = requestAnimationFrame(tick)
        }
        frame = requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [value])

  return <span ref={ref}>{value === null ? 'X' : value.toLocaleString('en-KE')}</span>
}

/** The globe itself lives in GlobeHost, which pins this section and moves the globe to one side. */
export function Stats() {
  const list = useRef<HTMLUListElement>(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ gsap }) => {
      if (cancelled || !list.current) return
      const tween = gsap.from(list.current.children, {
        opacity: 0,
        y: 44,
        duration: 0.9,
        stagger: 0.18,
        ease: 'power3.out',
        scrollTrigger: { trigger: '#stats', start: 'top 35%', once: true },
      })
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
    <div>{/* GSAP wraps the pinned section, so React needs this stable parent to remove. */}
    <section id="stats" aria-label={statsCopy.ariaLabel} className="relative z-10 flex min-h-svh items-end pb-20 lg:items-center lg:pb-0">
      <div className="wrap grid lg:grid-cols-2">
        <ul ref={list} className="space-y-6 sm:space-y-9 lg:col-start-2 lg:pl-10">
          {stats.map((stat) => (
            <li key={stat.label} className="border-b border-border-strong pb-5 sm:pb-8">
              <p className="flex items-center gap-3 font-display text-5xl leading-none font-medium tracking-tight text-accent sm:text-7xl">
                <StatValue value={stat.value} />
                {stat.value === null && <span className="rounded-full border border-border-strong bg-bg px-2 py-0.5 font-sans text-xs tracking-normal text-silver">{statsCopy.placeholder}</span>}
              </p>
              <p className="mt-2 text-lg text-platinum sm:text-xl">{stat.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
    </div>
  )
}
