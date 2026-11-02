'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Group, MathUtils, Mesh, MeshBasicMaterial } from 'three'
import { automations } from '@/content/automations'
import type { DeviceProfile } from './device'
import { PhoneBody, PhoneLights } from './PhoneBody'
import { frameloopFor } from './sceneState'
import { drawBubble, drawChat, makeTexture } from './screens'

const LOOP = 11
const FIRST_BUBBLE = 1.3
const BUBBLE_GAP = 1.5
// Bubbles alternate either side of the phone, working downwards.
const SPOTS: [number, number, number][] = [
  [-1.25, 1.35, 0.7],
  [1.25, 0.45, 0.9],
  [-1.25, -0.45, 0.8],
  [1.25, -1.35, 0.7],
]

function Scene({ animated, narrow }: { animated: boolean; narrow: boolean }) {
  const { hero, phoneName } = automations
  const phone = useRef<Group>(null)
  const bubbles = useRef<(Mesh | null)[]>([])

  const screen = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512
    canvas.height = 1056
    drawChat(canvas, phoneName, [{ from: 'event', text: hero.missedCall }])
    return makeTexture(canvas)
  }, [hero.missedCall, phoneName])
  const textures = useMemo(() => hero.bubbles.map((b) => drawBubble(b.label, b.text)), [hero.bubbles])

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    if (phone.current) {
      const ease = 1 - Math.exp(-delta * 3)
      const sway = animated ? Math.sin(t * 0.45) * 0.05 : 0
      phone.current.rotation.y = MathUtils.lerp(phone.current.rotation.y, -0.14 + sway + state.pointer.x * 0.08, ease)
      phone.current.rotation.x = MathUtils.lerp(phone.current.rotation.x, 0.04 - state.pointer.y * 0.05, ease)
    }
    const clock = t % LOOP
    bubbles.current.forEach((mesh, i) => {
      if (!mesh) return
      const age = clock - (FIRST_BUBBLE + i * BUBBLE_GAP)
      // A springy pop in, and everything clears together before the loop restarts.
      const appear = !animated ? 1 : age <= 0 ? 0 : 1 - Math.exp(-age * 7) * Math.cos(age * 13)
      const leave = !animated ? 1 : MathUtils.clamp((LOOP - clock) / 0.5, 0, 1)
      const s = Math.max(0.0001, appear * leave)
      mesh.scale.set(s, s, 1)
      ;(mesh.material as MeshBasicMaterial).opacity = Math.min(1, s * 1.4)
    })
  })

  return (
    <group>
      <group ref={phone} scale={narrow ? 0.92 : 1}>
        <PhoneBody screen={screen} />
      </group>
      {textures.map((map, i) => (
        <mesh key={i} ref={(el) => void (bubbles.current[i] = el)} position={SPOTS[i]}>
          <planeGeometry args={[2.05, 0.705]} />
          <meshBasicMaterial map={map} transparent toneMapped={false} depthWrite={false} />
        </mesh>
      ))}
    </group>
  )
}

export default function PhoneHeroCanvas({ profile, inView }: { profile: DeviceProfile; inView: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.75)]}
      camera={{ position: [0, 0, profile.lowPower ? 10.6 : 9.2], fov: 38 }}
      frameloop={frameloopFor(profile.reducedMotion, inView)}
      gl={{ antialias: true, alpha: true, stencil: false }}
    >
      <PhoneLights />
      <Scene animated={!profile.reducedMotion} narrow={profile.lowPower} />
    </Canvas>
  )
}
