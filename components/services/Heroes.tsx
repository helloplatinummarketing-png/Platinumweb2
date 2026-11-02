'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { loadGsap, prefersReducedMotion } from '@/lib/gsap'
import { automations } from '@/content/automations'
import { sceneState } from '@/components/three/sceneState'
import { useStage } from '@/components/three/useStage'

const DevicePairCanvas = dynamic(() => import('@/components/three/DevicePairCanvas'), { ssr: false })
const PhoneHeroCanvas = dynamic(() => import('@/components/three/PhoneHeroCanvas'), { ssr: false })
const OrbCanvas = dynamic(() => import('@/components/three/OrbCanvas'), { ssr: false })

/** Websites: the browser and phone pair, tilting as the page scrolls. */
export function DevicePairHero() {
  const { host, profile, inView } = useStage()

  useEffect(() => {
    if (prefersReducedMotion() || !host.current) return
    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled || !host.current) return
      const trigger = ScrollTrigger.create({
        trigger: host.current,
        start: 'top 60%',
        end: 'bottom top',
        scrub: true,
        onUpdate: (self) => {
          sceneState.deviceTilt = self.progress
        },
      })
      cleanup = () => trigger.kill()
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [host])

  return <div ref={host} className="absolute inset-0">{profile?.webgl && <DevicePairCanvas profile={profile} inView={inView} />}</div>
}

/** WhatsApp: the phone with chat bubbles popping out in sequence. */
export function PhoneHero() {
  const { host, profile, inView } = useStage()
  const { hero } = automations
  return (
    <div ref={host} className="absolute inset-0">
      {profile?.webgl && <PhoneHeroCanvas profile={profile} inView={inView} />}
      {/* The bubbles are decorative 3D, so the same messages are here as real text. */}
      <ul className="sr-only">
        <li>{hero.missedCall}</li>
        {hero.bubbles.map((bubble) => (
          <li key={bubble.label}>
            {bubble.label}: {bubble.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

/** AI Visibility: the orb. */
export function OrbHero() {
  const { host, profile, inView } = useStage()
  return <div ref={host} className="absolute inset-0">{profile?.webgl && <OrbCanvas profile={profile} inView={inView} />}</div>
}
