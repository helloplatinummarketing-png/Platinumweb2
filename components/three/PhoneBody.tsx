'use client'

import type { Texture } from 'three'
import { RoundedBox } from '@react-three/drei'

export function PhoneBody({ screen }: { screen: Texture }) {
  return (
    <group>
      <RoundedBox args={[2.1, 4.2, 0.16]} radius={0.08} smoothness={3}>
        <meshStandardMaterial color="#c9cace" metalness={1} roughness={0.3} />
      </RoundedBox>
      <mesh position={[0, 0, 0.083]}>
        <planeGeometry args={[1.94, 4.0]} />
        <meshBasicMaterial map={screen} toneMapped={false} />
      </mesh>
    </group>
  )
}

export function PhoneLights() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[3, 4, 5]} intensity={2.8} />
      <directionalLight position={[-4, -1, 2]} intensity={1.6} color="#2bd67b" />
    </>
  )
}
