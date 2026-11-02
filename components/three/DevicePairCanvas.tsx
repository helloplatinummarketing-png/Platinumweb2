'use client'

import { useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { Group, MathUtils } from 'three'
import type { DeviceProfile } from './device'
import { frameloopFor, sceneState } from './sceneState'
import { drawSite, makeTexture } from './screens'

function makeScreen(width: number, height: number, compact: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  drawSite(canvas, compact)
  return makeTexture(canvas)
}

function Devices({ animated }: { animated: boolean }) {
  const group = useRef<Group>(null)
  const phone = useRef<Group>(null)
  const browserScreen = useMemo(() => makeScreen(1024, 640, false), [])
  const phoneScreen = useMemo(() => makeScreen(360, 760, true), [])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = sceneState.deviceTilt
    const ease = 1 - Math.exp(-delta * 4)
    const sway = animated ? Math.sin(state.clock.elapsedTime * 0.5) * 0.03 : 0
    g.rotation.y = MathUtils.lerp(g.rotation.y, -0.42 + t * 0.68 + state.pointer.x * 0.07 + sway, ease)
    g.rotation.x = MathUtils.lerp(g.rotation.x, 0.1 + t * 0.26 - state.pointer.y * 0.05, ease)
    if (phone.current) {
      phone.current.position.z = MathUtils.lerp(phone.current.position.z, 0.75 + t * 0.55, ease)
      phone.current.position.y = -0.42 + (animated ? Math.sin(state.clock.elapsedTime * 0.8) * 0.04 : 0)
    }
  })

  return (
    <group ref={group} rotation={[0.1, -0.42, 0]}>
      <group position={[-0.24, 0.14, 0]}>
        <RoundedBox args={[3.3, 2.15, 0.1]} radius={0.05} smoothness={3}>
          <meshStandardMaterial color="#e5e4e2" metalness={0.9} roughness={0.34} />
        </RoundedBox>
        <mesh position={[0, 0.965, 0.052]}>
          <planeGeometry args={[3.16, 0.14]} />
          <meshBasicMaterial color="#171a21" />
        </mesh>
        {[-1.47, -1.37, -1.27].map((x) => (
          <mesh key={x} position={[x, 0.965, 0.054]}>
            <circleGeometry args={[0.028, 14]} />
            <meshBasicMaterial color="#9ea3ad" />
          </mesh>
        ))}
        <mesh position={[0, -0.075, 0.052]}>
          <planeGeometry args={[3.16, 1.94]} />
          <meshBasicMaterial map={browserScreen} toneMapped={false} />
        </mesh>
      </group>
      <group ref={phone} position={[1.28, -0.42, 0.75]} rotation={[0, -0.08, 0]}>
        <RoundedBox args={[0.82, 1.68, 0.08]} radius={0.04} smoothness={3}>
          <meshStandardMaterial color="#c9cace" metalness={1} roughness={0.28} />
        </RoundedBox>
        <mesh position={[0, 0, 0.043]}>
          <planeGeometry args={[0.74, 1.56]} />
          <meshBasicMaterial map={phoneScreen} toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}

export default function DevicePairCanvas({ profile, inView }: { profile: DeviceProfile; inView: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.75)]}
      camera={{ position: [0, 0, profile.lowPower ? 8.2 : 7.4], fov: 38 }}
      frameloop={frameloopFor(profile.reducedMotion, inView)}
      gl={{ antialias: true, alpha: true, stencil: false }}
    >
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={3} />
      <directionalLight position={[-4, 0, 2]} intensity={1.4} color="#2bd67b" />
      <Devices animated={!profile.reducedMotion} />
    </Canvas>
  )
}
