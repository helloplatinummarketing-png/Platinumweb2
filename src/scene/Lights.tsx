import { Environment, Lightformer } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'
import { COLD, GOLD } from './materials'
import { sceneState } from './state'

const KEY_WARM = new THREE.Color('#fff1dc')

/**
 * Studio lighting. A procedural environment (no HDR download) gives the metals
 * something to reflect; a warm key, a cool rim and a gold core light do the rest.
 * The key shifts towards cold blue and the gold light scales with charge.
 */
export function Lights() {
  const key = useRef<THREE.SpotLight>(null)
  const core = useRef<THREE.PointLight>(null)
  const rim = useRef<THREE.DirectionalLight>(null)

  useFrame(() => {
    const s = sceneState
    if (key.current) {
      key.current.color.copy(KEY_WARM).lerp(COLD, s.cold * 0.85)
      key.current.intensity = 28 * (1 - s.cold * 0.45)
    }
    if (core.current) core.current.intensity = 0.4 + s.charge * 9 + s.litCount * 0.25
    if (rim.current) rim.current.intensity = 1.6 + s.cold * 1.5
  })

  return (
    <>
      <ambientLight intensity={0.05} />
      <spotLight
        ref={key}
        position={[-4, 7, 4]}
        angle={0.5}
        penumbra={0.9}
        intensity={28}
        distance={30}
        decay={1.6}
      />
      <directionalLight ref={rim} position={[5, 2.5, -6]} intensity={1.6} color="#9fb4ff" />
      <pointLight ref={core} position={[0, 0.9, 0]} color={GOLD} intensity={0.4} distance={6} decay={1.5} />

      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#05070d']} />
        <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[-2, 6, 2]} rotation-x={Math.PI / 2} scale={[5, 2, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#fff3e0" position={[-6, 2, 3]} rotation-y={Math.PI / 2.5} scale={[2, 6, 1]} />
        <Lightformer form="rect" intensity={0.45} color="#a9b8ff" position={[6, 1, -3]} rotation-y={-Math.PI / 2.5} scale={[1.2, 6, 1]} />
        <Lightformer form="ring" intensity={0.8} color="#d4af37" position={[0, -2, 5]} scale={3} />
      </Environment>
    </>
  )
}
