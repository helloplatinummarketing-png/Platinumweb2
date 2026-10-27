import { useFrame } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { createRandom } from './random'
import { sceneState } from './state'

const FLOOR_Y = -1.62

/**
 * Cheap volumetric feel: a soft light shaft, drifting dust and a floor that
 * fades into the dark. Three draw calls, no extra render passes.
 */
export function Atmosphere({ dust = 420 }: { dust?: number }) {
  const shaft = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        uniforms: { uTime: { value: 0 }, uCold: { value: 0 }, uStrength: { value: 0.07 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          varying vec3 vNormalV;
          varying vec3 vViewPos;
          void main() {
            vUv = uv;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vViewPos = mv.xyz;
            vNormalV = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mv;
          }`,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform float uCold;
          uniform float uStrength;
          varying vec2 vUv;
          varying vec3 vNormalV;
          varying vec3 vViewPos;
          void main() {
            float facing = abs(dot(normalize(-vViewPos), vNormalV));
            float fall = smoothstep(0.0, 0.85, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            float drift = 0.85 + 0.15 * sin(vUv.x * 18.0 + uTime * 0.3);
            vec3 warm = vec3(1.0, 0.92, 0.78);
            vec3 cold = vec3(0.55, 0.68, 1.0);
            gl_FragColor = vec4(mix(warm, cold, uCold) * pow(facing, 2.0) * fall * drift * uStrength, 1.0);
          }`,
      }),
    [],
  )

  const floor = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: { uCharge: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uCharge;
          varying vec2 vUv;
          void main() {
            float d = length(vUv - 0.5) * 2.0;
            float shadow = smoothstep(0.08, 0.32, d);
            float pool = smoothstep(0.55, 0.1, d);
            vec3 base = vec3(0.008, 0.012, 0.028) * pool * 1.4;
            vec3 glow = vec3(0.83, 0.69, 0.22) * smoothstep(0.38, 0.12, d) * 0.12 * uCharge;
            float ring = smoothstep(0.004, 0.0, abs(d - 0.42)) * 0.25 + smoothstep(0.003, 0.0, abs(d - 0.62)) * 0.12;
            vec3 col = (base + glow) * shadow + vec3(0.6, 0.62, 0.68) * ring * pool * 0.35;
            gl_FragColor = vec4(col, smoothstep(1.0, 0.4, d));
          }`,
      }),
    [],
  )

  const backdrop = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        depthTest: false,
        uniforms: { uCharge: { value: 0 }, uCold: { value: 0 } },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() { vUv = uv; gl_Position = vec4(position.xy, 0.9999, 1.0); }`,
        fragmentShader: /* glsl */ `
          uniform float uCharge;
          uniform float uCold;
          varying vec2 vUv;
          void main() {
            vec2 p = (vUv - vec2(0.5, 0.52)) * vec2(1.6, 1.0);
            float d = length(p);
            vec3 navy = vec3(0.0007, 0.002, 0.009);
            vec3 mid = mix(vec3(0.014, 0.018, 0.038), vec3(0.008, 0.02, 0.065), uCold);
            vec3 gold = vec3(0.83, 0.69, 0.22);
            vec3 col = mix(mid, navy, smoothstep(0.0, 0.75, d));
            col += gold * smoothstep(0.45, 0.0, d) * 0.05 * (0.4 + uCharge);
            gl_FragColor = vec4(col, 1.0);
          }`,
      }),
    [],
  )

  const dustGeo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    const pos = new Float32Array(dust * 3)
    const random = createRandom(7)
    for (let i = 0; i < dust; i++) {
      const r = Math.sqrt(random()) * 7
      const a = random() * Math.PI * 2
      pos[i * 3] = Math.cos(a) * r
      pos[i * 3 + 1] = FLOOR_Y + random() * 7
      pos[i * 3 + 2] = Math.sin(a) * r
    }
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return g
  }, [dust])

  // Dust rises and wraps in the vertex shader, so no buffer upload per frame.
  const dustTime = useMemo(() => ({ value: 0 }), [])
  const dustMat = useMemo(() => {
    const m = new THREE.PointsMaterial({
      size: 0.018,
      color: '#e8dcc0',
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    })
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = dustTime
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', '#include <common>\nuniform float uTime;')
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
          transformed.y = ${FLOOR_Y.toFixed(2)} + mod(transformed.y - ${FLOOR_Y.toFixed(2)} + uTime * 0.04, 7.0);`,
        )
    }
    return m
  }, [dustTime])

  useFrame((state) => {
    shaft.uniforms.uTime.value = state.clock.elapsedTime
    shaft.uniforms.uCold.value = sceneState.cold
    floor.uniforms.uCharge.value = sceneState.charge
    backdrop.uniforms.uCharge.value = sceneState.charge
    backdrop.uniforms.uCold.value = sceneState.cold
    dustTime.value = state.clock.elapsedTime
  })

  return (
    <>
      <mesh material={backdrop} renderOrder={-1} frustumCulled={false}>
        <planeGeometry args={[2, 2]} />
      </mesh>
      <mesh material={shaft} position={[-1.2, 2.6, 1]} rotation={[0.1, 0, 0.32]}>
        <cylinderGeometry args={[0.6, 3.4, 9, 48, 1, true]} />
      </mesh>
      <mesh material={floor} rotation-x={-Math.PI / 2} position-y={FLOOR_Y + 0.001}>
        <planeGeometry args={[16, 16]} />
      </mesh>
      <points geometry={dustGeo} material={dustMat} frustumCulled={false} />
    </>
  )
}
