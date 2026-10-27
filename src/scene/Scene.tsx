import { PerformanceMonitor } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
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

/**
 * Compiles every material in parallel (KHR_parallel_shader_compile) before the
 * render loop starts, so the first frame doesn't freeze the page.
 */
function Warmup({ onReady }: { onReady: () => void }) {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)
  const camera = useThree((s) => s.camera)
  useEffect(() => {
    let cancelled = false
    const done = () => {
      if (cancelled) return
      sceneState.ready = true
      onReady()
    }
    gl.compileAsync(scene, camera).then(done, done)
    return () => {
      cancelled = true
    }
  }, [gl, scene, camera, onReady])
  return null
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
  const [compiled, setCompiled] = useState(false)
  const onReady = useCallback(() => setCompiled(true), [])

  return (
    <Canvas
      dpr={[1, dpr]}
      frameloop={!compiled ? 'never' : still ? 'demand' : 'always'}
      camera={{ position: [sceneState.camera.position.x, sceneState.camera.position.y, sceneState.camera.position.z], fov: sceneState.camera.fov, near: 0.1, far: 60 }}
      gl={{ antialias: false, powerPreference: 'high-performance', preserveDrawingBuffer: false }}
      // Pointer events come from the whole page so the core reacts under the DOM overlays.
      eventSource={document.getElementById('root')!}
      eventPrefix="client"
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.NoToneMapping
        // Dev only: lets the perf pass read draw calls from the console.
        if (import.meta.env.DEV) (window as unknown as { __gl: THREE.WebGLRenderer }).__gl = gl
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
      {/* Post-processing mounts after the scene's shaders are compiled, so the two
          compile costs land in separate, shorter tasks. */}
      {compiled && <Effects quality={quality} />}
      {still && compiled && <SettleThenStop />}
      <Warmup onReady={onReady} />
    </Canvas>
  )
}
