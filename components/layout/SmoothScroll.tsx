'use client'

import { useEffect } from 'react'
import { loadGsap, prefersReducedMotion } from '@/lib/gsap'

/** Lenis smooth scroll, kept in sync with GSAP ScrollTrigger. Skipped for reduced motion. */
export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    let cleanup = () => {}
    let cancelled = false

    void Promise.all([import('lenis'), loadGsap()]).then(([{ default: Lenis }, { gsap, ScrollTrigger }]) => {
      if (cancelled) return
      const lenis = new Lenis({ anchors: true })
      lenis.on('scroll', ScrollTrigger.update)
      const tick = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(tick)
      gsap.ticker.lagSmoothing(0)
      cleanup = () => {
        gsap.ticker.remove(tick)
        lenis.destroy()
      }
    })

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return null
}
