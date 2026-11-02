'use client'

import { useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Color,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  ShaderMaterial,
  Sprite,
} from 'three'
import type { DeviceProfile } from './device'
import { morphState } from './morphState'

function cssColor(name: string) {
  return new Color(getComputedStyle(document.documentElement).getPropertyValue(name).trim())
}

function buildGeometry(side: number) {
  const count = side ** 3
  const grid = new Float32Array(count * 3)
  const scatter = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  const size = 2.3
  let i = 0
  for (let x = 0; x < side; x++) {
    for (let y = 0; y < side; y++) {
      for (let z = 0; z < side; z++) {
        const step = size / (side - 1)
        grid.set([x * step - size / 2, y * step - size / 2, z * step - size / 2], i * 3)
        // A loose, uneven cloud: disordered, like a business nobody has audited yet.
        const a = Math.random() * Math.PI * 2
        const u = Math.random() * 2 - 1
        const r = Math.sqrt(1 - u * u)
        const radius = 0.7 + Math.random() ** 0.7 * 1.35
        scatter.set([r * Math.cos(a) * radius, u * radius * 0.82, r * Math.sin(a) * radius], i * 3)
        seeds[i] = Math.random()
        i++
      }
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(grid, 3))
  geometry.setAttribute('aScatter', new BufferAttribute(scatter, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  return geometry
}

function glowTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 128
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.25, 'rgba(255,255,255,0.4)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 128, 128)
  return new CanvasTexture(canvas)
}

function Field({ side, animated }: { side: number; animated: boolean }) {
  const dpr = useThree((s) => s.viewport.dpr)
  const invalidate = useThree((s) => s.invalidate)
  const group = useRef<Group>(null)
  const core = useRef<Mesh>(null)
  const glow = useRef<Sprite>(null)
  const frame = useRef<LineSegments>(null)

  const geometry = useMemo(() => buildGeometry(side), [side])
  const accent = useMemo(() => cssColor('--accent'), [])
  const silver = useMemo(() => cssColor('--silver'), [])
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(2.42, 2.42, 2.42)), [])
  const glowMap = useMemo(() => glowTexture(), [])
  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: {
          uBuild: { value: 0 },
          uStream: { value: 0 },
          uTime: { value: 0 },
          uPixel: { value: dpr },
          uDisorder: { value: silver },
          uOrder: { value: accent },
        },
        vertexShader: /* glsl */ `
          attribute vec3 aScatter;
          attribute float aSeed;
          uniform float uBuild;
          uniform float uStream;
          uniform float uTime;
          uniform float uPixel;
          uniform vec3 uDisorder;
          uniform vec3 uOrder;
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            // Each particle snaps home at a slightly different moment.
            float snap = smoothstep(aSeed * 0.45, aSeed * 0.45 + 0.55, uBuild);
            vec3 drift = vec3(sin(uTime * 0.4 + aSeed * 30.0), cos(uTime * 0.33 + aSeed * 50.0), sin(uTime * 0.27 + aSeed * 70.0)) * 0.1 * (1.0 - snap);
            vec3 p = mix(aScatter + drift, position, snap);

            // Customers arriving: particles stream from the grid into the core, on a loop.
            float life = fract(uTime * (0.1 + aSeed * 0.22) + aSeed * 11.0);
            float pull = life * life;
            vec3 streamed = position * (1.0 - pull);
            p = mix(p, streamed, uStream);

            vColor = mix(uDisorder, uOrder, snap);
            vAlpha = mix(0.75, 1.0, snap) * mix(1.0, smoothstep(0.0, 0.1, life) * (1.0 - pull * 0.5), uStream);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_PointSize = uPixel * (5.5 + aSeed * 8.0) * mix(1.0, 0.8, snap) / -mv.z * 3.0;
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          varying vec3 vColor;
          varying float vAlpha;
          void main() {
            float a = smoothstep(0.5, 0.12, length(gl_PointCoord - 0.5));
            if (a <= 0.0) discard;
            gl_FragColor = vec4(vColor, a * vAlpha);
            #include <colorspace_fragment>
          }`,
      }),
    [accent, silver, dpr],
  )
  const frameMaterial = useMemo(() => new LineBasicMaterial({ color: accent, transparent: true, opacity: 0, blending: AdditiveBlending, depthWrite: false }), [accent])
  const hot = useMemo(() => accent.clone().lerp(new Color('#ffffff'), 0.55), [accent])

  useEffect(() => {
    morphState.invalidate = invalidate
    return () => {
      morphState.invalidate = () => {}
    }
  }, [invalidate])

  useFrame((state, delta) => {
    const u = material.uniforms
    u.uBuild.value = morphState.build
    u.uStream.value = morphState.stream
    u.uTime.value = animated ? state.clock.elapsedTime : 4
    if (group.current && animated) group.current.rotation.y += delta * 0.14
    frameMaterial.opacity = morphState.build * (1 - morphState.stream) * 0.5
    if (core.current) {
      core.current.scale.setScalar(Math.max(0.0001, morphState.stream * (0.2 + (animated ? Math.sin(state.clock.elapsedTime * 2.2) * 0.012 : 0))))
    }
    if (glow.current) {
      glow.current.scale.setScalar(morphState.stream * 2.6)
      glow.current.material.opacity = morphState.stream * 0.85
    }
  })

  return (
    <group ref={group} rotation={[0.42, 0.6, 0]}>
      <points geometry={geometry} material={material} frustumCulled={false} />
      <lineSegments ref={frame} geometry={edges} material={frameMaterial} />
      <mesh ref={core}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshBasicMaterial color={hot} toneMapped={false} />
      </mesh>
      <sprite ref={glow}>
        <spriteMaterial map={glowMap} color={accent} transparent blending={AdditiveBlending} depthWrite={false} opacity={0} />
      </sprite>
    </group>
  )
}

export default function MorphCanvas({ profile, active }: { profile: DeviceProfile; active: boolean }) {
  return (
    <Canvas
      aria-hidden="true"
      dpr={[1, Math.min(profile.maxDpr, 1.75)]}
      camera={{ position: [0, 0, profile.lowPower ? 7.4 : 6.6], fov: 42, near: 0.1, far: 30 }}
      frameloop={!profile.reducedMotion ? (active ? 'always' : 'never') : 'demand'}
      gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', stencil: false }}
    >
      <Field side={profile.lowPower ? 13 : 18} animated={!profile.reducedMotion} />
    </Canvas>
  )
}
