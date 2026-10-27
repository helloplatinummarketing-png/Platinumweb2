import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame } from '@react-three/fiber'
import { Suspense, useRef, useState } from 'react'
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

interface SceneProps {
  /** Phones: 6 petals, no depth of field, lighter bloom and haze. */
  mobile?: boolean
  /** Reduced motion: one settled still of the lit core, no scroll camera. */
  still?: boolean
}

/** In still mode, render just long enough for the core's easing to settle, then stop. */
function SettleThenStop({ frames = 120 }: { frames?: number }) {
  const left = useRef(frames)
  useFrame(({ invalidate }) => {
    if (left.current-- > 0) invalidate()
  })
  return null
}

export function Scene({ mobile = false, still = false }: SceneProps) {
  const [degraded, setDegraded] = useState(false)
  const [dpr, setDpr] = useState(mobile ? 1.5 : 1.75)
  const quality = mobile || degraded || still ? 'low' : 'high'

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={still ? 'demand' : 'always'}
      camera={{ position: sceneState.camera.position.toArray(), fov: sceneState.camera.fov, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
      // Pointer events come from the whole page so the core reacts under the DOM overlays.
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
      }}
    >
      {!still && (
        <PerformanceMonitor
          onDecline={() => {
            setDegraded(true)
            setDpr(1)
          }}
          onIncline={() => setDpr(mobile ? 1.5 : 1.75)}
        />
      )}
      <fog attach="fog" args={['#020617', 12, 30]} />
      <Lights />
      <Atmosphere dust={mobile ? 180 : 420} />
      <Core petalCount={mobile ? 6 : 12} interactive={!still && !mobile}>
        <LightPath petalCount={mobile ? 6 : 12} />
      </Core>
      {!still && (
        <Suspense fallback={null}>
          <Screen />
        </Suspense>
      )}
      <CameraRig parallax={!still && !mobile} />
      {!still && <AnchorProjector />}
      <Effects quality={quality} />
      {still && <SettleThenStop />}
    </Canvas>
  )
}
