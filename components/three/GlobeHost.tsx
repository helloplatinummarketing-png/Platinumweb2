'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { loadGsap, prefersReducedMotion, queueRefresh } from '@/lib/gsap'
import { globeControls, globeViewHalfSize } from './globeControls'
import { useDeviceProfile } from './useDeviceProfile'

const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), { ssr: false })

/** Where the globe sits while the stats list is on screen: left half on desktop, top half on phones. */
function statsPose() {
  const aspect = innerWidth / innerHeight
  const { halfHeight, halfWidth } = globeViewHalfSize(aspect)
  return innerWidth >= 1024
    ? { x: -halfWidth * 0.5, y: 0, scale: 1.18 }
    : { x: 0, y: halfHeight * 0.42, scale: 0.92 }
}

/**
 * Hosts the one home page globe in a fixed layer behind the content. It shows behind
 * the hero, hides, then returns for the stats section. The CSS poster paints first
 * and stands in for the globe on devices without WebGL.
 */
export function GlobeHost() {
  const layer = useRef<HTMLDivElement>(null)
  const profile = useDeviceProfile()
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let lastActive = true
    const show = (opacity: number) => {
      const el = layer.current
      if (!el) return
      el.style.opacity = String(opacity)
      el.style.visibility = opacity < 0.005 ? 'hidden' : 'visible'
      const on = opacity >= 0.005
      if (on !== lastActive) {
        lastActive = on
        setActive(on)
      }
    }

    // Reduced motion: no scroll animation. The globe simply holds its start or end state.
    if (prefersReducedMotion()) {
      const hero = document.getElementById('hero')
      const stats = document.getElementById('stats')
      if (!hero || !stats) return
      const visible = new Set<Element>()
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) visible.add(entry.target)
            else visible.delete(entry.target)
          }
          const inStats = visible.has(stats)
          if (inStats) {
            const pose = statsPose()
            Object.assign(globeControls, { ...pose, focus: 1 })
          } else {
            Object.assign(globeControls, { x: 0, y: 0, scale: 1, focus: 0 })
          }
          show(inStats || visible.has(hero) ? 1 : 0)
          globeControls.invalidate()
        },
        { threshold: 0.25 },
      )
      observer.observe(hero)
      observer.observe(stats)
      return () => observer.disconnect()
    }

    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return
      let heroOpacity = 1
      let heroScale = 1
      const stage = { opacity: 0, scale: 1, x: 0, y: 0, focus: 0 }

      const apply = () => {
        const inStats = stage.opacity > 0.001
        globeControls.scale = inStats ? stage.scale : heroScale
        globeControls.x = inStats ? stage.x : 0
        globeControls.y = inStats ? stage.y : 0
        globeControls.focus = inStats ? stage.focus : 0
        show(Math.max(heroOpacity, stage.opacity))
      }

      const heroTrigger = ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          heroOpacity = 1 - self.progress
          heroScale = 1 + self.progress * 0.18
          apply()
        },
      })

      const pin = ScrollTrigger.create({
        trigger: '#stats',
        start: 'top top',
        end: () => `+=${innerHeight * 1.5}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      })

      // One screen in, 1.5 pinned, one screen out. The durations match those distances.
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: pin.pin,
          start: 'top bottom',
          end: () => `+=${innerHeight * 3.5}`,
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
        onUpdate: apply,
      })
      timeline
        .to(stage, { opacity: 1, duration: 0.8 }, 0)
        .to(stage, { scale: () => statsPose().scale, x: () => statsPose().x, y: () => statsPose().y, focus: 1, duration: 1.7, ease: 'power1.inOut' }, 0.2)
        .to(stage, { opacity: 0, duration: 0.7 }, 2.7)
        .set({}, {}, 3.5)

      queueRefresh(() => ScrollTrigger.refresh())
      cleanup = () => {
        heroTrigger.kill()
        pin.kill()
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    })

    return () => {
      cancelled = true
      cleanup()
      // Leaves the shared globe state clean for the next page.
      Object.assign(globeControls, { scale: 1, x: 0, y: 0, focus: 0 })
    }
  }, [])

  return (
    <div ref={layer} className="globe-poster fixed inset-0 z-0" aria-hidden="true">
      {profile?.webgl && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <GlobeCanvas profile={profile} active={active} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  )
}
