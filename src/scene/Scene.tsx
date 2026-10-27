import { Canvas } from '@react-three/fiber'
import * as THREE from 'three'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Core } from './Core'
import { Effects } from './Effects'
import { Lights } from './Lights'

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 4.2, 8.5], fov: 32, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
      }}
    >
      <fog attach="fog" args={['#020617', 10, 24]} />
      <Lights />
      <Atmosphere />
      <Core />
      <CameraRig />
      <Effects />
    </Canvas>
  )
}
