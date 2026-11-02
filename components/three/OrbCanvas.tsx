'use client'

import { useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import type { DeviceProfile } from './device'
import { frameloopFor } from './sceneState'
import { OrbObject, Spinner } from './ServiceObjects'

/** The AI orb from the home page service card, large and turning slowly. */
export default function OrbCanvas({ profile, inView }: { profile: DeviceProfile; inView: boolean }) {
  // Holding this at the orb's own index makes it rotate continuously, as if hovered.
  const hovered = useRef<number | null>(0)
  const animated = !profile.reducedMotion
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.75)]}
      camera={{ position: [0, 0, 3.7], fov: 38 }}
      frameloop={frameloopFor(profile.reducedMotion, inView)}
      gl={{ antialias: !profile.lowPower, alpha: true, stencil: false }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={3.2} />
      <directionalLight position={[-4, -1, 2]} intensity={1.2} color="#2bd67b" />
      <Spinner index={0} hovered={hovered} animated={animated} speed={0.22}>
        <OrbObject density={profile.density * 2.4} />
      </Spinner>
    </Canvas>
  )
}
