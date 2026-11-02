'use client'

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { globeControls } from '@/components/three/globeControls'
import { useStage } from '@/components/three/useStage'

const ParticleField = dynamic(() => import('@/components/three/ParticleField'), { ssr: false })
const GlobeCanvas = dynamic(() => import('@/components/three/GlobeCanvas'), { ssr: false })

/** Contact: a minimal field of accent particles. Pricing: the same, but quieter. */
export function ParticleBackdrop({ count, opacity }: { count: number; opacity: number }) {
  const { host, profile, inView } = useStage()
  return (
    <div ref={host} className="pointer-events-none absolute inset-0" aria-hidden="true">
      {profile?.webgl && <ParticleField profile={profile} inView={inView} count={count} opacity={opacity} />}
    </div>
  )
}

/** About: the same globe component as the home page, small and calm behind the headline. */
export function CalmGlobeBackdrop() {
  const { host, profile, inView } = useStage()

  useEffect(() => {
    Object.assign(globeControls, { scale: 0.74, x: 0, y: 0, focus: 0 })
    return () => {
      Object.assign(globeControls, { scale: 1 })
    }
  }, [])

  return (
    <div ref={host} className="globe-poster pointer-events-none absolute inset-0" aria-hidden="true">
      {profile?.webgl && <GlobeCanvas profile={profile} active={inView} onReady={() => {}} calm />}
    </div>
  )
}
