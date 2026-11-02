'use client'

import type { RefObject } from 'react'
import { Canvas } from '@react-three/fiber'
import { PerspectiveCamera, View } from '@react-three/drei'
import type { DeviceProfile } from './device'
import { BrowserObject, ChatObject, OrbObject, Spinner } from './ServiceObjects'
import { useInView } from './useInView'

function Lights() {
  return (
    <>
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 5]} intensity={3.2} />
      <directionalLight position={[-4, -1, 2]} intensity={1.1} color="#2bd67b" />
      <pointLight position={[0, 2, 3]} intensity={6} />
    </>
  )
}

interface ServiceStageProps {
  section: RefObject<HTMLElement | null>
  slots: RefObject<HTMLDivElement | null>[]
  hovered: RefObject<number | null>
  profile: DeviceProfile
  onReady: () => void
}

/** One shared canvas across the section, with a drei View drawing into each card. */
export default function ServiceStage({ section, slots, hovered, profile, onReady }: ServiceStageProps) {
  const inView = useInView(section)
  const animated = !profile.reducedMotion

  const objects = [
    <BrowserObject key="browser" />,
    <ChatObject key="chat" animated={animated} />,
    <OrbObject key="orb" density={profile.density} />,
  ]

  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <Canvas
        dpr={[1, Math.min(profile.maxDpr, 1.5)]}
        frameloop={inView ? 'always' : 'never'}
        gl={{ antialias: !profile.lowPower, alpha: true, powerPreference: 'high-performance', stencil: false }}
        onCreated={onReady}
        style={{ pointerEvents: 'none' }}
      >
        {objects.map((object, i) => (
          <View key={i} track={slots[i] as RefObject<HTMLElement>}>
            <PerspectiveCamera makeDefault position={[0, 0, 4.2]} fov={34} />
            <Lights />
            <Spinner index={i} hovered={hovered} animated={animated}>
              {object}
            </Spinner>
          </View>
        ))}
      </Canvas>
    </div>
  )
}
