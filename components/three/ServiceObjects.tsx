'use client'

import { useMemo, useRef, type RefObject } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox } from '@react-three/drei'
import { AdditiveBlending, BufferAttribute, BufferGeometry, CanvasTexture, Color, ExtrudeGeometry, Group, Mesh, Shape } from 'three'

const PLATINUM = '#e5e4e2'
const SILVER = '#9ea3ad'
const ACCENT = '#2bd67b'

interface SpinProps {
  index: number
  hovered: RefObject<number | null>
  animated: boolean
  children: React.ReactNode
  rest?: [number, number, number]
}

/** Holds a resting angle with a slow sway. Rotates fully while its card is hovered or focused. */
export function Spinner({ index, hovered, animated, children, rest = [0.12, -0.42, 0] }: SpinProps) {
  const group = useRef<Group>(null)
  const extra = useRef(0)

  useFrame((state, delta) => {
    if (!group.current || !animated) return
    if (hovered.current === index) {
      extra.current += delta * 1.6
    } else {
      // Unwinds to the nearest full turn, so it always returns to facing the viewer.
      const target = Math.round(extra.current / (Math.PI * 2)) * Math.PI * 2
      extra.current += (target - extra.current) * (1 - Math.exp(-delta * 2.5))
    }
    const t = state.clock.elapsedTime
    group.current.rotation.y = rest[1] + extra.current + Math.sin(t * 0.5 + index) * 0.1
    group.current.rotation.x = rest[0] + Math.sin(t * 0.4 + index * 2) * 0.04
    group.current.position.y = Math.sin(t * 0.8 + index) * 0.05
  })

  return (
    <group ref={group} rotation={rest}>
      {children}
    </group>
  )
}

export function BrowserObject() {
  return (
    <group>
      <RoundedBox args={[2.5, 1.7, 0.12]} radius={0.05} smoothness={3}>
        <meshStandardMaterial color={PLATINUM} metalness={0.92} roughness={0.32} />
      </RoundedBox>
      <mesh position={[0, -0.08, 0.065]}>
        <planeGeometry args={[2.34, 1.36]} />
        <meshBasicMaterial color="#07080b" />
      </mesh>
      {[-1.08, -0.96, -0.84].map((x, i) => (
        <mesh key={x} position={[x, 0.72, 0.066]}>
          <circleGeometry args={[0.035, 16]} />
          <meshBasicMaterial color={i === 2 ? ACCENT : SILVER} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[-0.42, 0.27, 0.075]}>
        <planeGeometry args={[1.3, 0.17]} />
        <meshBasicMaterial color={PLATINUM} />
      </mesh>
      <mesh position={[-0.62, 0.02, 0.075]}>
        <planeGeometry args={[0.9, 0.06]} />
        <meshBasicMaterial color={SILVER} />
      </mesh>
      <mesh position={[-0.72, -0.22, 0.075]}>
        <planeGeometry args={[0.7, 0.2]} />
        <meshBasicMaterial color={ACCENT} toneMapped={false} />
      </mesh>
      {[-0.78, 0, 0.78].map((x) => (
        <mesh key={x} position={[x, -0.56, 0.075]}>
          <planeGeometry args={[0.68, 0.26]} />
          <meshBasicMaterial color="#1a1d24" />
        </mesh>
      ))}
    </group>
  )
}

function bubbleGeometry() {
  const s = new Shape()
  const w = 2.3
  const h = 1.35
  const r = 0.34
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 - 0.36)
  s.lineTo(-w / 2 + r + 0.16, -h / 2)
  s.closePath()
  const geometry = new ExtrudeGeometry(s, { depth: 0.22, bevelEnabled: true, bevelSize: 0.04, bevelThickness: 0.04, bevelSegments: 3, curveSegments: 10 })
  geometry.translate(0, 0, -0.11)
  return geometry
}

export function ChatObject({ animated }: { animated: boolean }) {
  const geometry = useMemo(() => bubbleGeometry(), [])
  const dots = useRef<(Mesh | null)[]>([])

  useFrame((state) => {
    if (!animated) return
    const t = state.clock.elapsedTime
    dots.current.forEach((dot, i) => {
      if (dot) dot.position.y = Math.max(0, Math.sin(t * 4.5 - i * 0.8)) * 0.13
    })
  })

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial color={ACCENT} metalness={0.2} roughness={0.3} />
      </mesh>
      {[-0.46, 0, 0.46].map((x, i) => (
        <mesh key={x} ref={(el) => void (dots.current[i] = el)} position={[x, 0, 0.17]}>
          <sphereGeometry args={[0.15, 20, 14]} />
          <meshStandardMaterial color="#f4f3f1" metalness={0.3} roughness={0.35} />
        </mesh>
      ))}
    </group>
  )
}

/** A platinum shell with a network of dots glowing inside it. */
export function OrbObject({ density }: { density: number }) {
  const { points, lines } = useMemo(() => {
    const count = Math.round(70 * Math.max(density, 0.6))
    const positions: number[] = []
    const golden = Math.PI * (3 - Math.sqrt(5))
    for (let i = 0; i < count; i++) {
      const y = 1 - ((i + 0.5) / count) * 2
      const r = Math.sqrt(1 - y * y)
      const radius = 0.62 + ((i * 7) % 10) * 0.024
      positions.push(Math.cos(i * golden) * r * radius, y * radius, Math.sin(i * golden) * r * radius)
    }
    const pointGeometry = new BufferGeometry()
    pointGeometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))

    const links: number[] = []
    for (let i = 0; i < count; i++) {
      for (const offset of [5, 8]) {
        const j = i + offset
        if (j >= count) continue
        links.push(...positions.slice(i * 3, i * 3 + 3), ...positions.slice(j * 3, j * 3 + 3))
      }
    }
    const lineGeometry = new BufferGeometry()
    lineGeometry.setAttribute('position', new BufferAttribute(new Float32Array(links), 3))
    return { points: pointGeometry, lines: lineGeometry }
  }, [density])

  const glow = useMemo(() => new Color(ACCENT).multiplyScalar(1.4), [])
  const dot = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 32
    const ctx = canvas.getContext('2d')!
    ctx.fillStyle = '#fff'
    ctx.beginPath()
    ctx.arc(16, 16, 15, 0, Math.PI * 2)
    ctx.fill()
    return new CanvasTexture(canvas)
  }, [])

  return (
    <group>
      <points geometry={points}>
        <pointsMaterial color={glow} map={dot} alphaTest={0.4} size={0.055} sizeAttenuation transparent blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </points>
      <lineSegments geometry={lines}>
        <lineBasicMaterial color={ACCENT} transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} />
      </lineSegments>
      <mesh>
        <sphereGeometry args={[1.08, 48, 32]} />
        <meshStandardMaterial color={PLATINUM} metalness={1} roughness={0.28} transparent opacity={0.17} depthWrite={false} />
      </mesh>
      <mesh rotation={[Math.PI / 2 + 0.2, 0, 0]}>
        <torusGeometry args={[1.1, 0.012, 10, 96]} />
        <meshStandardMaterial color={PLATINUM} metalness={1} roughness={0.25} />
      </mesh>
    </group>
  )
}
