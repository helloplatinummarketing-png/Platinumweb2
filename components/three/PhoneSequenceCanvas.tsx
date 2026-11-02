'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Group, MathUtils } from 'three'
import { automations } from '@/content/automations'
import type { DeviceProfile } from './device'
import { PhoneBody, PhoneLights } from './PhoneBody'
import { frameloopFor, sceneState } from './sceneState'
import { drawChat, makeTexture } from './screens'

function Scene() {
  const { list, phoneName } = automations
  const group = useRef<Group>(null)
  const drawn = useRef(-1)
  const turn = useRef(0)

  const { canvas, screen } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 512
    c.height = 1056
    return { canvas: c, screen: makeTexture(c) }
  }, [])

  useFrame((state, delta) => {
    const step = sceneState.phoneStep
    if (step !== drawn.current) {
      // The phone gives a small turn each time its screen changes.
      if (drawn.current >= 0) turn.current = 0.5
      drawn.current = step
      drawChat(canvas, phoneName, list[step].flow)
      screen.needsUpdate = true
    }
    const ease = 1 - Math.exp(-delta * 4)
    turn.current = MathUtils.lerp(turn.current, 0, ease)
    if (group.current) {
      group.current.rotation.y = -0.2 + turn.current + state.pointer.x * 0.07
      group.current.rotation.x = 0.05 - state.pointer.y * 0.04
    }
  })

  return (
    <group ref={group}>
      <PhoneBody screen={screen} />
    </group>
  )
}

export default function PhoneSequenceCanvas({ profile, inView }: { profile: DeviceProfile; inView: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.75)]}
      camera={{ position: [0, 0, 8.4], fov: 38 }}
      frameloop={frameloopFor(profile.reducedMotion, inView)}
      gl={{ antialias: true, alpha: true, stencil: false }}
    >
      <PhoneLights />
      <Scene />
    </Canvas>
  )
}
