'use client'

import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerformanceMonitor } from '@react-three/drei'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Globe } from './Globe'
import type { DeviceProfile } from './device'

interface GlobeCanvasProps {
  profile: DeviceProfile
  active: boolean
  onReady: () => void
  /** The About page version: fewer particles, no markers and no bloom. */
  calm?: boolean
}

export default function GlobeCanvas({ profile, active, onReady, calm }: GlobeCanvasProps) {
  const [struggling, setStruggling] = useState(false)
  const lowPower = profile.lowPower || struggling || calm
  const animated = !profile.reducedMotion
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--bg').trim()

  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, struggling ? 1 : profile.maxDpr]}
      camera={{ position: [0, 0, 3.15], fov: 45, near: 0.1, far: 20 }}
      frameloop={!animated ? 'demand' : active ? 'always' : 'never'}
      gl={{ antialias: false, alpha: false, powerPreference: 'high-performance', stencil: false }}
      onCreated={onReady}
    >
      <color attach="background" args={[bg]} />
      {animated && <PerformanceMonitor onDecline={() => setStruggling(true)} />}
      <Globe density={profile.density * (calm ? 0.6 : 1)} animated={animated} showMarkers={!calm} />
      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur intensity={0.28} luminanceThreshold={0.5} luminanceSmoothing={0.3} radius={0.55} />
        </EffectComposer>
      )}
    </Canvas>
  )
}
