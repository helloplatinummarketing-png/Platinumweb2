import { Canvas, useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'

function PlaceholderHub() {
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => {
    const profile = [
      [0, -0.2],
      [1, -0.2],
      [1, 0],
      [0.8, 0.1],
      [0.6, 0.4],
      [0, 0.5],
    ].map(([x, y]) => new THREE.Vector2(x, y))
    return new THREE.LatheGeometry(profile, 64)
  }, [])

  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.5
  })

  return (
    <mesh ref={ref} geometry={geometry}>
      <meshStandardMaterial color="#c9ccd1" metalness={0.9} roughness={0.3} />
    </mesh>
  )
}

export default function App() {
  return (
    <div className="stage-backdrop fixed inset-0">
      <Canvas dpr={[1, 1.75]} camera={{ position: [0, 2.5, 5], fov: 35 }}>
        <ambientLight intensity={0.3} />
        <directionalLight position={[3, 5, 2]} intensity={2} />
        <PlaceholderHub />
      </Canvas>
    </div>
  )
}
