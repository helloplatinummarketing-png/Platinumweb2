'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { getDeviceProfile, type DeviceProfile } from './device'
import { globeControls } from './globeControls'

const GlobeCanvas = dynamic(() => import('./GlobeCanvas'), { ssr: false })

/**
 * Hosts the one home page globe in a fixed layer behind the content. The CSS poster
 * paints first, and the 3D mounts only after the browser has painted the text.
 */
export function GlobeHost() {
  const layer = useRef<HTMLDivElement>(null)
  const [profile, setProfile] = useState<DeviceProfile | null>(null)
  const [active, setActive] = useState(true)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let frame = 0
    let idle = 0
    // Two frames guarantees a paint has happened before any WebGL work starts.
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const mount = () => {
          const next = getDeviceProfile()
          if (next.webgl) setProfile(next)
        }
        if ('requestIdleCallback' in window) idle = requestIdleCallback(mount, { timeout: 1200 })
        else mount()
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      if (idle) cancelIdleCallback(idle)
    }
  }, [])

  // The globe grows slightly and fades as the hero scrolls away, then stops rendering.
  useEffect(() => {
    if (!profile || profile.reducedMotion) return
    let cleanup = () => {}
    let cancelled = false
    void Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
      if (cancelled) return
      gsap.registerPlugin(ScrollTrigger)
      const trigger = ScrollTrigger.create({
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          const p = self.progress
          globeControls.scale = 1 + p * 0.18
          if (layer.current) layer.current.style.opacity = String(1 - p)
          setActive(p < 0.995)
        },
      })
      cleanup = () => trigger.kill()
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [profile])

  return (
    <div ref={layer} className="globe-poster fixed inset-0 z-0" aria-hidden="true">
      {profile && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? 'opacity-100' : 'opacity-0'}`}>
          <GlobeCanvas profile={profile} active={active} onReady={() => setReady(true)} />
        </div>
      )}
    </div>
  )
}
