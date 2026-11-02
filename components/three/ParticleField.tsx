'use client'

import { useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, ShaderMaterial } from 'three'
import type { DeviceProfile } from './device'
import { cssColor, frameloopFor } from './sceneState'

function buildField(count: number) {
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions.set([(Math.random() - 0.5) * 16, (Math.random() - 0.5) * 9, (Math.random() - 0.5) * 6], i * 3)
    seeds[i] = Math.random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  return geometry
}

function Field({ count, opacity }: { count: number; opacity: number }) {
  const dpr = useThree((s) => s.viewport.dpr)
  const geometry = useMemo(() => buildField(count), [count])
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uColor: { value: new Color(cssColor('--accent')) },
          uOpacity: { value: opacity },
          uPixel: { value: dpr },
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uPixel;
          uniform float uTime;
          varying float vAlpha;
          void main() {
            vec3 p = position;
            p.y += sin(uTime * (0.08 + aSeed * 0.12) + aSeed * 40.0) * 0.28;
            p.x += cos(uTime * (0.06 + aSeed * 0.1) + aSeed * 70.0) * 0.28;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vAlpha = 0.45 + 0.55 * sin(uTime * (0.3 + aSeed) + aSeed * 90.0) * sin(uTime * (0.3 + aSeed) + aSeed * 90.0);
            gl_PointSize = uPixel * (5.0 + aSeed * 11.0) / -mv.z * 3.0;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform float uOpacity;
          varying float vAlpha;
          void main() {
            float a = smoothstep(0.5, 0.1, length(gl_PointCoord - 0.5));
            if (a <= 0.0) discard;
            gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
            #include <colorspace_fragment>
          }`,
      }),
    [dpr, opacity],
  )

  useFrame((state) => {
    material.uniforms.uTime.value = state.clock.elapsedTime
  })

  return <points geometry={geometry} material={material} frustumCulled={false} />
}

interface ParticleFieldProps {
  profile: DeviceProfile
  inView: boolean
  /** Full particle count before the device multiplier. */
  count: number
  opacity: number
}

export default function ParticleField({ profile, inView, count, opacity }: ParticleFieldProps) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.5)]}
      camera={{ position: [0, 0, 6], fov: 50 }}
      frameloop={frameloopFor(profile.reducedMotion, inView)}
      gl={{ antialias: false, alpha: true, stencil: false }}
    >
      <Field count={Math.round(count * profile.density)} opacity={opacity} />
    </Canvas>
  )
}
