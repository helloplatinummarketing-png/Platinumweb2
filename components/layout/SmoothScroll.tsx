'use client'

import { useEffect } from 'react'

/**
 * Lenis smooth scroll, kept in sync with GSAP ScrollTrigger. Both are imported
 * after first paint so they never delay the text, and skipped for reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let cleanup = () => {}
    let cancelled = false

    void Promise.all([import('lenis'), import('gsap'), import('gsap/ScrollTrigger')]).then(
      ([{ default: Lenis }, { gsap }, { ScrollTrigger }]) => {
        if (cancelled) return
        gsap.registerPlugin(ScrollTrigger)
        const lenis = new Lenis({ anchors: true })
        lenis.on('scroll', ScrollTrigger.update)
        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)
        cleanup = () => {
          gsap.ticker.remove(tick)
          lenis.destroy()
        }
      },
    )

    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return null
}
