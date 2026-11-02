'use client'

import { useLayoutEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Color, Group, InstancedMesh, MathUtils, Mesh, MeshBasicMaterial, MeshStandardMaterial, Object3D, Sprite } from 'three'
import { geo } from '@/content/geo'
import type { DeviceProfile } from './device'
import { cssColor, frameloopFor, sceneState } from './sceneState'
import { makeTexture } from './screens'

const GRID = 28
const CELL = 0.3

/** Small seeded generator, so the city looks the same on every visit. */
function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

/** A stylised low-poly city: a dense centre, ring and radial roads, and open green land to the south. */
function City({ count }: { count: number }) {
  const mesh = useRef<InstancedMesh>(null)

  const blocks = useMemo(() => {
    const random = seeded(1899)
    const out: { x: number; z: number; h: number; w: number; d: number; park: boolean }[] = []
    const half = (count - 1) / 2
    for (let ix = 0; ix < count; ix++) {
      for (let iz = 0; iz < count; iz++) {
        const gx = ix - half
        const gz = iz - half
        const r = Math.hypot(gx, gz)
        if (r > half + 0.5) continue
        const onRing = Math.abs(r - half * 0.42) < 0.55 || Math.abs(r - half * 0.8) < 0.55
        const onRadial = Math.abs(gx) < 0.55 || Math.abs(gz) < 0.55 || Math.abs(gx - gz) < 0.65
        if (onRing || onRadial) continue
        const park = gz > half * 0.42 && gx > -half * 0.25
        const centre = Math.exp(-(r * r) / (half * half * 0.1))
        out.push({
          x: gx * CELL,
          z: gz * CELL,
          h: park ? 0.025 : 0.05 + random() * 0.14 + centre * (0.45 + random() * 0.95),
          w: CELL * (park ? 0.92 : 0.66 + random() * 0.2),
          d: CELL * (park ? 0.92 : 0.66 + random() * 0.2),
          park,
        })
      }
    }
    return out
  }, [count])

  useLayoutEffect(() => {
    const m = mesh.current
    if (!m) return
    const dummy = new Object3D()
    const base = new Color('#20242c')
    const tall = new Color('#6d7280')
    const park = new Color(cssColor('--accent')).multiplyScalar(0.09)
    const color = new Color()
    blocks.forEach((b, i) => {
      dummy.position.set(b.x, b.h / 2, b.z)
      dummy.scale.set(b.w, b.h, b.d)
      dummy.updateMatrix()
      m.setMatrixAt(i, dummy.matrix)
      m.setColorAt(i, b.park ? park : color.copy(base).lerp(tall, Math.min(1, b.h / 1.2)))
    })
    m.instanceMatrix.needsUpdate = true
    if (m.instanceColor) m.instanceColor.needsUpdate = true
  }, [blocks])

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, blocks.length]} key={blocks.length}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial flatShading metalness={0.25} roughness={0.72} />
    </instancedMesh>
  )
}

/** A pill-shaped label drawn to a texture, so it can sit in the scene with the pin. */
function drawTag(text: string, on: boolean) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 112
  const ctx = canvas.getContext('2d')!
  const color = on ? cssColor('--accent') : cssColor('--platinum')
  ctx.font = '600 44px Inter, system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const width = ctx.measureText(text).width + 64
  ctx.fillStyle = 'rgba(7,8,11,0.94)'
  ctx.strokeStyle = on ? color : 'rgba(229,228,226,0.4)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect((640 - width) / 2, 4, width, 104, 52)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = color
  ctx.fillText(text, 320, 58)
  return makeTexture(canvas)
}

function Pin({ label, x, z, lit, reveal }: { label: string; x: number; z: number; lit?: boolean; reveal: readonly [number, number] }) {
  const { afterLabel } = geo.tryIt
  const group = useRef<Group>(null)
  const head = useRef<Mesh>(null)
  const pulse = useRef<Mesh>(null)
  const tag = useRef<Sprite>(null)
  const silver = useMemo(() => new Color(cssColor('--silver')), [])
  const accent = useMemo(() => new Color(cssColor('--accent')), [])
  const tagOff = useMemo(() => drawTag(label, false), [label])
  const tagOn = useMemo(() => (lit ? drawTag(`${label} · ${afterLabel}`, true) : null), [label, afterLabel, lit])

  useFrame((state) => {
    const p = sceneState.mapProgress
    const rise = MathUtils.smootherstep(p, reveal[0], reveal[1])
    if (group.current) {
      group.current.scale.y = Math.max(0.001, rise)
      group.current.visible = rise > 0.01
    }
    const on = lit ? MathUtils.smootherstep(p, 0.68, 0.84) : 1
    if (head.current) {
      const material = head.current.material as MeshStandardMaterial
      material.color.copy(silver).multiplyScalar(lit ? 0.42 : 1).lerp(accent, lit ? on : 0)
      material.emissive.copy(accent).multiplyScalar(lit ? on * 1.5 : 0)
    }
    if (pulse.current) {
      const life = (state.clock.elapsedTime * 0.6) % 1
      pulse.current.visible = !!lit && on > 0.05
      pulse.current.scale.setScalar(0.16 + life * 0.75)
      ;(pulse.current.material as MeshBasicMaterial).opacity = (1 - life) * on * 0.9
    }
    if (tag.current) {
      tag.current.visible = rise > 0.01
      tag.current.material.opacity = rise
      const map = tagOn && on > 0.5 ? tagOn : tagOff
      if (tag.current.material.map !== map) {
        tag.current.material.map = map
        tag.current.material.needsUpdate = true
      }
    }
  })

  return (
    <group position={[x, 0, z]}>
      <group ref={group}>
        <mesh position={[0, 0.45, 0]}>
          <cylinderGeometry args={[0.012, 0.012, 0.9, 8]} />
          <meshStandardMaterial color="#e5e4e2" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh ref={head} position={[0, 1.0, 0]}>
          <sphereGeometry args={[0.12, 24, 16]} />
          <meshStandardMaterial color={silver} toneMapped={false} />
        </mesh>
      </group>
      <mesh ref={pulse} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <ringGeometry args={[0.8, 1, 40]} />
        <meshBasicMaterial color={accent} transparent depthWrite={false} toneMapped={false} />
      </mesh>
      <sprite ref={tag} position={[0, 1.38, 0]} scale={[2.2, 0.385, 1]} renderOrder={5}>
        <spriteMaterial map={tagOff} transparent depthTest={false} toneMapped={false} />
      </sprite>
    </group>
  )
}

function Scene({ count, animated }: { count: number; animated: boolean }) {
  const { competitorPin, youPin } = geo.tryIt
  const tilt = useRef<Group>(null)

  useFrame((state, delta) => {
    if (!tilt.current) return
    const p = sceneState.mapProgress
    // Reduced motion draws a single frame, so it goes straight to the end state.
    const ease = animated ? 1 - Math.exp(-delta * 4) : 1
    // Starts nearly flat like a map, then tips up into the city as the visitor scrolls.
    tilt.current.rotation.x = MathUtils.lerp(tilt.current.rotation.x, 1.02 - p * 0.68 - state.pointer.y * 0.03, ease)
    tilt.current.rotation.y = MathUtils.lerp(tilt.current.rotation.y, -0.35 + p * 0.52 + state.pointer.x * 0.05, ease)
  })

  return (
    <group position={[0, -0.72, 0]}>
      <group ref={tilt} rotation={[1.02, -0.35, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.005, 0]}>
          <circleGeometry args={[(count / 2 + 1) * CELL, 64]} />
          <meshStandardMaterial color="#0f1116" roughness={0.9} />
        </mesh>
        <City count={count} />
        <Pin label={competitorPin} x={-1.25} z={-0.72} reveal={[0.12, 0.34]} />
        <Pin label={youPin} x={1.15} z={0.42} lit reveal={[0.3, 0.52]} />
      </group>
    </group>
  )
}

export default function NairobiMapCanvas({ profile, inView }: { profile: DeviceProfile; inView: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.75)]}
      camera={{ position: [0, 0.9, profile.lowPower ? 10 : 10.6], fov: 38 }}
      frameloop={frameloopFor(profile.reducedMotion, inView)}
      gl={{ antialias: !profile.lowPower, alpha: true, stencil: false }}
    >
      <ambientLight intensity={1.3} />
      <directionalLight position={[4, 6, 3]} intensity={3} />
      <directionalLight position={[-5, 2, -2]} intensity={1.2} color="#2bd67b" />
      <Scene count={profile.lowPower ? 20 : GRID} animated={!profile.reducedMotion} />
    </Canvas>
  )
}
