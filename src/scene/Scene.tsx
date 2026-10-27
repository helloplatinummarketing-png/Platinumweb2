import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { AnchorProjector } from './AnchorProjector'
import { Atmosphere } from './Atmosphere'
import { CameraRig } from './CameraRig'
import { Core } from './Core'
import { Effects } from './Effects'
import { LightPath } from './LightPath'
import { Lights } from './Lights'
import { Screen } from './Screen'
import { sceneState } from './state'

export function Scene() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: sceneState.camera.position.toArray(), fov: sceneState.camera.fov, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance' }}
      // Pointer events come from the whole page so the core reacts under the DOM overlays.
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
      }}
    >
      <fog attach="fog" args={['#020617', 12, 30]} />
      <Lights />
      <Atmosphere />
      <Core>
        <LightPath />
      </Core>
      <Suspense fallback={null}>
        <Screen />
      </Suspense>
      <CameraRig />
      <AnchorProjector />
      <Effects />
    </Canvas>
  )
}
