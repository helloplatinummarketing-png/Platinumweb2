'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  QuadraticBezierCurve3,
  Quaternion,
  ShaderMaterial,
  SphereGeometry,
  TubeGeometry,
  Vector3,
  RingGeometry,
} from 'three'
import { site } from '@/config/site'
import { globeControls, latLonToVector } from './globeControls'

const LAND_MASK = '/textures/land-mask.png'
const SPIN_SPEED = 0.035
const Z = new Vector3(0, 0, 1)
const NAIROBI = new Vector3(...latLonToVector(site.coordinates.lat, site.coordinates.lon))
// Starts with Nairobi just left of centre, so it drifts across the front while the hero is read.
const START_SPIN = (-site.coordinates.lon * Math.PI) / 180 - 0.42

/** Loads the land mask and places evenly spread dots wherever there is land. */
async function sampleLand(candidates: number) {
  const image = new Image()
  image.src = LAND_MASK
  await image.decode()
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(image, 0, 0)
  const { data, width, height } = ctx.getImageData(0, 0, image.width, image.height)

  const out: number[] = []
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < candidates; i++) {
    const y = 1 - ((i + 0.5) / candidates) * 2
    const lat = Math.asin(y)
    const raw = (i * golden) % (Math.PI * 2)
    const lon = raw > Math.PI ? raw - Math.PI * 2 : raw
    const u = Math.min(width - 1, Math.floor(((lon + Math.PI) / (Math.PI * 2)) * width))
    const v = Math.min(height - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * height))
    if (data[(v * width + u) * 4] > 128) {
      const r = Math.cos(lat)
      out.push(r * Math.sin(lon), y, r * Math.cos(lon))
    }
  }
  return new Float32Array(out)
}

const pointsVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uSize;
  uniform float uPixel;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    float facing = normalize(normalMatrix * position).z;
    float twinkle = 0.82 + 0.18 * sin(uTime * (0.6 + aSeed * 1.6) + aSeed * 40.0);
    vAlpha = mix(0.07, 1.0, smoothstep(-0.2, 0.4, facing)) * twinkle;
    gl_PointSize = uSize * uPixel * (0.75 + aSeed * 0.5) / -mv.z;
    gl_Position = projectionMatrix * mv;
  }`

const pointsFragment = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.18, d);
    if (a <= 0.0) discard;
    gl_FragColor = vec4(uColor, a * vAlpha * uOpacity);
    #include <colorspace_fragment>
  }`

function pointsMaterial(color: Color, size: number, opacity: number, pixelRatio: number) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: {
      uColor: { value: color },
      uSize: { value: size },
      uPixel: { value: pixelRatio },
      uTime: { value: 0 },
      uOpacity: { value: opacity },
    },
    vertexShader: pointsVertex,
    fragmentShader: pointsFragment,
  })
}

function withSeeds(positions: Float32Array) {
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const seeds = new Float32Array(positions.length / 3)
  for (let i = 0; i < seeds.length; i++) seeds[i] = Math.random()
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  return geometry
}

function makeAtmosphere(count: number) {
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const u = Math.random() * 2 - 1
    const a = Math.random() * Math.PI * 2
    const r = Math.sqrt(1 - u * u)
    const radius = 1.04 + Math.random() ** 2 * 0.34
    positions.set([r * Math.cos(a) * radius, u * radius, r * Math.sin(a) * radius], i * 3)
  }
  return withSeeds(positions)
}

/** Soft rim of light around the sphere, and it hides nothing behind it. */
function makeRimMaterial(color: Color) {
  return new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uColor: { value: color } },
    vertexShader: /* glsl */ `
      varying float vFacing;
      void main() {
        vFacing = normalize(normalMatrix * normal).z;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      varying float vFacing;
      void main() {
        float rim = pow(1.0 - clamp(vFacing, 0.0, 1.0), 3.5);
        gl_FragColor = vec4(uColor, rim * 0.5 + 0.025);
        #include <colorspace_fragment>
      }`,
  })
}

interface ArcSlot {
  mesh: Mesh<BufferGeometry, MeshBasicMaterial>
  ring: Mesh<RingGeometry, MeshBasicMaterial>
  started: number
  active: boolean
  indexCount: number
}

const ARC_GROW = 1.1
const ARC_HOLD = 0.7
const ARC_FADE = 0.8
const ARC_SEGMENTS = 40

function spawnArc(slot: ArcSlot, now: number) {
  // A random nearby point: a customer in or around Kenya finding a business.
  const distance = MathUtils.randFloat(3, 15)
  const bearing = Math.random() * Math.PI * 2
  const end = new Vector3(
    ...latLonToVector(site.coordinates.lat + Math.sin(bearing) * distance, site.coordinates.lon + Math.cos(bearing) * distance),
  )
  const lift = 1 + NAIROBI.distanceTo(end) * 0.34
  const mid = NAIROBI.clone().add(end).normalize().multiplyScalar(lift)
  const curve = new QuadraticBezierCurve3(NAIROBI.clone().multiplyScalar(1.002), mid, end.clone().multiplyScalar(1.002))
  slot.mesh.geometry.dispose()
  slot.mesh.geometry = new TubeGeometry(curve, ARC_SEGMENTS, 0.0052, 6, false)
  slot.indexCount = slot.mesh.geometry.index!.count
  slot.mesh.geometry.setDrawRange(0, 0)
  slot.mesh.material.opacity = 1
  slot.mesh.visible = true
  slot.ring.position.copy(end).multiplyScalar(1.004)
  slot.ring.quaternion.copy(new Quaternion().setFromUnitVectors(Z, end))
  slot.ring.visible = false
  slot.started = now
  slot.active = true
}

interface GlobeProps {
  density: number
  animated: boolean
  /** Hide the Nairobi marker and arcs, e.g. for the calm About page globe. */
  showMarkers?: boolean
}

export function Globe({ density, animated, showMarkers = true }: GlobeProps) {
  const invalidate = useThree((s) => s.invalidate)
  const dpr = useThree((s) => s.viewport.dpr)

  const [land, setLand] = useState<BufferGeometry | null>(null)
  const parallax = useRef<Group>(null)
  const spin = useRef<Group>(null)
  const marker = useRef<Group>(null)
  const pulseA = useRef<Mesh<RingGeometry, MeshBasicMaterial>>(null)
  const pulseB = useRef<Mesh<RingGeometry, MeshBasicMaterial>>(null)
  const arcsGroup = useRef<Group>(null)
  const tilt = useRef({ x: 0, y: 0 })

  // Reads the live CSS variable, so changing --accent recolours the 3D too.
  const accent = useMemo(() => new Color(getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()), [])
  const landMaterial = useMemo(() => pointsMaterial(accent, 13, 1, dpr), [accent, dpr])
  const atmosphereMaterial = useMemo(() => pointsMaterial(accent, 7, 0.42, dpr), [accent, dpr])
  const atmosphere = useMemo(() => makeAtmosphere(Math.round(2600 * density)), [density])
  const rimGeometry = useMemo(() => new SphereGeometry(1.015, 48, 32), [])
  const rimMaterial = useMemo(() => makeRimMaterial(accent), [accent])
  const ringGeometry = useMemo(() => new RingGeometry(0.72, 1, 40), [])
  const glowColor = useMemo(() => accent.clone().multiplyScalar(1.7), [accent])

  const slots = useMemo<ArcSlot[]>(
    () =>
      Array.from({ length: 3 }, () => ({
        mesh: new Mesh(
          new BufferGeometry(),
          new MeshBasicMaterial({ color: glowColor, transparent: true, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
        ),
        ring: new Mesh(
          ringGeometry,
          new MeshBasicMaterial({ color: glowColor, transparent: true, side: DoubleSide, blending: AdditiveBlending, depthWrite: false, toneMapped: false }),
        ),
        started: 0,
        active: false,
        indexCount: 0,
      })),
    [glowColor, ringGeometry],
  )

  useEffect(() => {
    let cancelled = false
    void sampleLand(Math.round(72000 * density)).then((positions) => {
      if (cancelled) return
      setLand(withSeeds(positions))
      invalidate()
    })
    return () => {
      cancelled = true
    }
  }, [density, invalidate])

  // Gentle parallax from device tilt on phones. The mouse comes through R3F's pointer.
  useEffect(() => {
    if (!animated) return
    const onTilt = (event: DeviceOrientationEvent) => {
      tilt.current.x = MathUtils.clamp((event.gamma ?? 0) / 45, -1, 1)
      tilt.current.y = MathUtils.clamp(((event.beta ?? 45) - 45) / 45, -1, 1)
    }
    window.addEventListener('deviceorientation', onTilt, { passive: true })
    return () => window.removeEventListener('deviceorientation', onTilt)
  }, [animated])

  const markerPosition = useMemo(() => NAIROBI.clone().multiplyScalar(1.006), [])
  const markerRotation = useMemo(() => new Quaternion().setFromUnitVectors(Z, NAIROBI), [])
  const world = useMemo(() => new Vector3(), [])
  const nextArc = useRef(1.2)
  const nextSlot = useRef(0)
  const freeSpin = useRef(START_SPIN)

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    landMaterial.uniforms.uTime.value = t
    atmosphereMaterial.uniforms.uTime.value = t

    if (animated) freeSpin.current += delta * SPIN_SPEED

    // Pull the camera back on narrow screens so the whole globe still fits.
    const fitZ = 3.15 * Math.max(1, 0.72 / state.viewport.aspect)
    if (state.camera.position.z !== fitZ) state.camera.position.z = fitZ

    const c = globeControls
    if (spin.current) {
      const focusY = (-c.focusLon * Math.PI) / 180
      const focusX = (c.focusLat * Math.PI) / 180
      // Take the short way round when the scroll timeline turns the globe to face Africa.
      const free = MathUtils.euclideanModulo(freeSpin.current - focusY + Math.PI, Math.PI * 2) - Math.PI + focusY
      spin.current.rotation.y = MathUtils.lerp(free, focusY, c.focus)
      spin.current.rotation.x = MathUtils.lerp(0.14, focusX, c.focus)
    }

    if (parallax.current) {
      const px = state.pointer.x + tilt.current.x
      const py = state.pointer.y + tilt.current.y
      const ease = 1 - Math.exp(-delta * 2.5)
      parallax.current.rotation.y += (px * 0.09 - parallax.current.rotation.y) * ease
      parallax.current.rotation.x += (-py * 0.06 - parallax.current.rotation.x) * ease
      parallax.current.position.set(c.x, c.y, 0)
      parallax.current.scale.setScalar(c.scale)
    }

    if (!showMarkers || !marker.current || !arcsGroup.current) return

    // Marker and arcs only show on the side of the globe facing the camera.
    world.copy(NAIROBI).applyQuaternion(spin.current!.quaternion)
    const front = world.z > 0.12
    marker.current.visible = front
    arcsGroup.current.visible = front

    const pulse = (t * 0.55) % 1
    for (const [ref, offset] of [[pulseA, 0], [pulseB, 0.5]] as const) {
      const life = (pulse + offset) % 1
      if (ref.current) {
        ref.current.scale.setScalar(0.012 + life * 0.05)
        ref.current.material.opacity = (1 - life) * 0.9
      }
    }

    if (animated && front && t > nextArc.current) {
      spawnArc(slots[nextSlot.current], t)
      nextSlot.current = (nextSlot.current + 1) % slots.length
      nextArc.current = t + MathUtils.randFloat(1.8, 3.4)
    }

    for (const slot of slots) {
      if (!slot.active) continue
      const age = t - slot.started
      const grow = Math.min(age / ARC_GROW, 1)
      slot.mesh.geometry.setDrawRange(0, Math.floor((1 - (1 - grow) ** 2) * slot.indexCount))
      const fadeAt = ARC_GROW + ARC_HOLD
      slot.mesh.material.opacity = age < fadeAt ? 1 : Math.max(0, 1 - (age - fadeAt) / ARC_FADE)
      // The endpoint pulses as the arc lands.
      const landed = (age - ARC_GROW) / (ARC_HOLD + ARC_FADE)
      slot.ring.visible = landed > 0 && landed < 1
      if (slot.ring.visible) {
        slot.ring.scale.setScalar(0.008 + landed * 0.04)
        slot.ring.material.opacity = 1 - landed
      }
      if (age > fadeAt + ARC_FADE) {
        slot.active = false
        slot.mesh.visible = false
        slot.ring.visible = false
      }
    }
  })

  return (
    <group ref={parallax}>
      <mesh geometry={rimGeometry} material={rimMaterial} />
      <group ref={spin} rotation={[0.14, START_SPIN, 0]}>
        {land && <points geometry={land} material={landMaterial} frustumCulled={false} />}
        <points geometry={atmosphere} material={atmosphereMaterial} frustumCulled={false} />
        {showMarkers && (
          <>
            <group ref={marker} position={markerPosition} quaternion={markerRotation}>
              <mesh>
                <circleGeometry args={[0.011, 24]} />
                <meshBasicMaterial color="#ffffff" toneMapped={false} />
              </mesh>
              <mesh ref={pulseA} geometry={ringGeometry}>
                <meshBasicMaterial color={glowColor} transparent side={DoubleSide} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
              </mesh>
              <mesh ref={pulseB} geometry={ringGeometry}>
                <meshBasicMaterial color={glowColor} transparent side={DoubleSide} blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
              </mesh>
            </group>
            <group ref={arcsGroup}>
              {slots.map((slot, i) => (
                <group key={i}>
                  <primitive object={slot.mesh} visible={false} />
                  <primitive object={slot.ring} visible={false} />
                </group>
              ))}
            </group>
          </>
        )}
      </group>
    </group>
  )
}
