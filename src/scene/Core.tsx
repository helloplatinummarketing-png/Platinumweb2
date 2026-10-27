import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  buildPetalPanels,
  buildPetalRails,
  createPanelGeometry,
  PETAL,
  PETAL_LENGTH,
  petalMatrix,
  petalWidthAt,
} from './Petal'
import {
  createBrushedTexture,
  createGraphiteMaterial,
  createPanelMaterial,
  createPlatinumMaterial,
  GOLD,
} from './materials'
import { anchors, PETAL_COUNT, readouts, sceneState } from './state'
import { PATH_PETALS } from '../timeline/shots'

const v2 = (r: number, y: number) => new THREE.Vector2(r, y)

/** Machined hub profile, revolved around Y. Points run from bottom axis to top axis. */
const HUB_PROFILE = [
  v2(0, -0.28), v2(0.66, -0.28), v2(0.9, -0.22), v2(1.0, -0.13), v2(1.04, -0.02), v2(1.04, 0.04),
  v2(1.01, 0.12), v2(0.94, 0.16), v2(0.91, 0.2), v2(0.79, 0.21), v2(0.77, 0.29), v2(0.63, 0.33),
  v2(0.6, 0.41), v2(0.47, 0.45), v2(0.45, 0.52), v2(0.31, 0.545), v2(0.29, 0.5), v2(0.2, 0.47), v2(0, 0.47),
]

const PEDESTAL_PROFILE = [
  v2(0, -1.62), v2(1.5, -1.62), v2(1.5, -1.58), v2(0.9, -1.55), v2(0.36, -1.45), v2(0.24, -1.2),
  v2(0.22, -0.5), v2(0.34, -0.36), v2(0.5, -0.3), v2(0, -0.3),
]

interface CoreProps {
  petalCount?: number
  /** Cursor tilt on/off (off for reduced motion). */
  interactive?: boolean
}

export function Core({ petalCount = PETAL_COUNT, interactive = true }: CoreProps) {
  const rootRef = useRef<THREE.Group>(null)
  const hitRef = useRef<THREE.InstancedMesh>(null)
  const panelsRef = useRef<THREE.InstancedMesh>(null)
  const railsRef = useRef<THREE.InstancedMesh>(null)
  const gearRef = useRef<THREE.Group>(null)
  const innerGearRef = useRef<THREE.Group>(null)

  const assets = useMemo(() => {
    const brushed = createBrushedTexture()
    const platinum = createPlatinumMaterial(brushed)
    const graphite = createGraphiteMaterial()
    const panel = createPanelMaterial()
    const lens = new THREE.MeshStandardMaterial({
      color: '#1a1408',
      emissive: GOLD,
      emissiveIntensity: 0.4,
      metalness: 0.2,
      roughness: 0.15,
    })
    return {
      platinum,
      graphite,
      panel,
      lens,
      hubGeo: new THREE.LatheGeometry(HUB_PROFILE, 128),
      pedestalGeo: new THREE.LatheGeometry(PEDESTAL_PROFILE, 96),
      railGeo: new THREE.BoxGeometry(1, 1, 1),
      hingeGeo: new THREE.CylinderGeometry(0.055, 0.055, 0.22, 20),
      toothGeo: new THREE.BoxGeometry(0.035, 0.03, 0.09),
      boltGeo: new THREE.CylinderGeometry(0.022, 0.022, 0.02, 12),
      hitGeo: new THREE.BoxGeometry(PETAL_LENGTH, 0.35, petalWidthAt(PETAL_LENGTH)).translate(PETAL_LENGTH / 2, 0, 0),
      hitMat: new THREE.MeshBasicMaterial({ visible: false }),
      lensGeo: new THREE.SphereGeometry(0.2, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2),
    }
  }, [])

  const layout = useMemo(() => {
    const panels = buildPetalPanels()
    const rails = buildPetalRails()
    const total = panels.length * petalCount
    const seeds = new Float32Array(total)
    const dirs: THREE.Vector3[] = []
    const spins: THREE.Euler[] = []
    // Panel transform without its width scale, so scatter rotation never shears.
    const posRot = panels.map((p) => {
      const pos = new THREE.Vector3()
      const q = new THREE.Quaternion()
      p.matrix.decompose(pos, q, new THREE.Vector3())
      return new THREE.Matrix4().compose(pos, q, new THREE.Vector3(1, 1, 1))
    })
    for (let i = 0; i < total; i++) {
      seeds[i] = Math.random()
      dirs.push(
        new THREE.Vector3(Math.random() - 0.5, Math.random() * 0.8 + 0.1, Math.random() - 0.5).normalize(),
      )
      spins.push(new THREE.Euler(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1))
    }
    return { panels, rails, total, seeds, dirs, spins, posRot }
  }, [petalCount])

  const lit = useMemo(() => new THREE.InstancedBufferAttribute(new Float32Array(layout.total), 1), [layout])
  const petalLit = useMemo(() => new Float32Array(petalCount), [petalCount])
  const petalLift = useMemo(() => new Float32Array(petalCount), [petalCount])

  const panelGeo = useMemo(() => {
    const geometry = createPanelGeometry()
    geometry.setAttribute('aLit', lit)
    geometry.setAttribute('aSeed', new THREE.InstancedBufferAttribute(layout.seeds, 1))
    return geometry
  }, [layout, lit])

  // Static instances: hinge knuckles, gear teeth and bolts.
  const hingeMatrices = useMemo(() => {
    const out: THREE.Matrix4[] = []
    for (let i = 0; i < petalCount; i++) {
      const yaw = (i / petalCount) * Math.PI * 2
      const y = 0.06 + (i % 2) * 0.07
      out.push(
        new THREE.Matrix4()
          .makeRotationY(yaw)
          .multiply(new THREE.Matrix4().makeTranslation(PETAL.hingeRadius, y, 0))
          .multiply(new THREE.Matrix4().makeRotationX(Math.PI / 2)),
      )
    }
    return out
  }, [petalCount])

  const ring = (count: number, radius: number, y: number) =>
    Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return new THREE.Matrix4().makeRotationY(-a).setPosition(Math.cos(a) * radius, y, Math.sin(a) * radius)
    })
  const teeth = useMemo(() => ring(40, 0.85, 0.225), [])
  const innerTeeth = useMemo(() => ring(24, 0.535, 0.425), [])
  const bolts = useMemo(() => ring(16, 0.7, 0.305), [])

  const M = useMemo(() => new THREE.Matrix4(), [])
  const tmp = useMemo(() => new THREE.Matrix4(), [])
  const rot = useMemo(() => new THREE.Matrix4(), [])
  const scale = useMemo(() => new THREE.Matrix4(), [])
  const lift = useMemo(() => new THREE.Matrix4(), [])
  const off = useMemo(() => new THREE.Vector3(), [])
  const euler = useMemo(() => new THREE.Euler(), [])
  const anchorLocal = useMemo(() => new THREE.Vector3(PETAL_LENGTH * 0.82, 0.06, 0), [])
  const petalAnchor = useMemo(() => Array.from({ length: petalCount }, () => new THREE.Vector3()), [petalCount])
  const pathPetals = useMemo(
    () => PATH_PETALS.map((p) => Math.round((p * petalCount) / PETAL_COUNT) % petalCount),
    [petalCount],
  )
  // Spring state for cursor tilt and yaw: [value, velocity].
  const spring = useMemo(() => ({ x: [0, 0], z: [0, 0], y: [0, 0] }), [])

  useFrame((state, dt) => {
    const panels = panelsRef.current
    const rails = railsRef.current
    if (!panels || !rails) return
    const s = sceneState
    const t = state.clock.elapsedTime
    const k = 1 - Math.exp(-dt * 6)
    const step = Math.min(dt, 1 / 30)

    // Cursor tilt and shot / pricing yaw on a soft spring.
    const root = rootRef.current
    if (root) {
      const goals = {
        x: interactive ? -state.pointer.y * 0.07 : 0,
        z: interactive ? -state.pointer.x * 0.06 : 0,
        y: s.coreYaw + s.yawOverride,
      }
      for (const axis of ['x', 'y', 'z'] as const) {
        const sp = spring[axis]
        sp[1] += (goals[axis] - sp[0]) * 28 * step
        sp[1] *= Math.exp(-7 * step)
        sp[0] += sp[1] * step
      }
      root.rotation.set(spring.x[0], spring.y[0], spring.z[0])
      root.updateMatrixWorld()
    }

    assets.panel.uniforms.uTime.value = t
    assets.panel.uniforms.uFlicker.value = s.flicker
    assets.panel.uniforms.uCold.value = s.cold
    assets.panel.uniforms.uGlow.value = s.glow
    assets.lens.emissiveIntensity = 0.2 + s.charge * 1.6

    if (gearRef.current) gearRef.current.rotation.y += dt * 0.35 * s.hubSpin
    if (innerGearRef.current) innerGearRef.current.rotation.y -= dt * 0.6 * s.hubSpin

    const per = layout.panels.length
    const railsPer = layout.rails.length
    const railGrow = THREE.MathUtils.smoothstep(s.assemble, 0.15, 0.85)
    // Lit counts are authored out of 12; scale for the simplified mobile core.
    const litTotal = (s.litOverride >= 0 ? s.litOverride : s.litCount) * (petalCount / PETAL_COUNT)
    let litSum = 0

    for (let p = 0; p < petalCount; p++) {
      const stagger = (p / petalCount) * 0.35
      const pu = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(s.unfold * 1.35 - stagger, 0, 1), 0, 1)
      const pathIndex = pathPetals.indexOf(p)
      const pathLit = pathIndex >= 0 ? THREE.MathUtils.clamp((s.path - pathIndex / 3) * 3, 0, 1) : 0
      const litGoal = Math.max(THREE.MathUtils.clamp(litTotal - p, 0, 1), pathLit)
      petalLit[p] += (litGoal - petalLit[p]) * k
      litSum += petalLit[p]
      petalLift[p] += ((s.hoveredPetal === toPetal12(p) ? 1 : 0) - petalLift[p]) * k

      petalMatrix(p, petalCount, pu, M)
      M.multiply(lift.makeTranslation(0, petalLift[p] * 0.09, 0))
      hitRef.current?.setMatrixAt(p, M)
      petalAnchor[p].copy(anchorLocal).applyMatrix4(M)
      if (root) petalAnchor[p].applyMatrix4(root.matrixWorld)

      for (let r = 0; r < railsPer; r++) {
        tmp.copy(M).multiply(scale.makeScale(railGrow, railGrow, railGrow)).multiply(layout.rails[r])
        rails.setMatrixAt(p * railsPer + r, tmp)
      }

      for (let j = 0; j < per; j++) {
        const i = p * per + j
        const panel = layout.panels[j]
        const seed = layout.seeds[i]
        // Ignition wipes from hinge to tip.
        const rowT = panel.row / PETAL.rows
        lit.array[i] = THREE.MathUtils.clamp(petalLit[p] * 1.7 - rowT * 0.7, 0, 1)

        const arrive = THREE.MathUtils.smoothstep(THREE.MathUtils.clamp(s.assemble * 1.6 - seed * 0.6, 0, 1), 0, 1)
        const away = 1 - arrive
        const drift = s.scatter * (0.25 + panel.row * 0.09) * (0.6 + seed * 0.8) + away * 7
        const spin = s.scatter * 0.9 + away * 4

        tmp.copy(M).multiply(layout.posRot[j])
        if (spin > 0.0001) {
          const e = layout.spins[i]
          euler.set(e.x * spin, e.y * spin, e.z * spin)
          tmp.multiply(rot.makeRotationFromEuler(euler))
        }
        tmp.multiply(scale.makeScale(1, 1, panel.width))
        if (drift > 0.0001) {
          off.copy(layout.dirs[i]).multiplyScalar(drift)
          tmp.premultiply(rot.makeTranslation(off.x, off.y, off.z))
        }
        panels.setMatrixAt(i, tmp)
      }
    }
    panels.instanceMatrix.needsUpdate = true
    rails.instanceMatrix.needsUpdate = true
    lit.needsUpdate = true
    if (hitRef.current) {
      hitRef.current.instanceMatrix.needsUpdate = true
      hitRef.current.computeBoundingSphere()
    }

    // Anchors are authored for 12 petals; map them onto however many we have.
    for (let i = 0; i < PETAL_COUNT; i++) anchors.petal[i].copy(petalAnchor[Math.floor((i * petalCount) / PETAL_COUNT)])
    readouts.petalsLit = (litSum * PETAL_COUNT) / petalCount
  })

  const toPetal12 = (p: number) => Math.round((p * PETAL_COUNT) / petalCount)

  return (
    <group>
      <mesh geometry={assets.pedestalGeo} material={assets.graphite} />
      <group ref={rootRef}>
      <mesh geometry={assets.hubGeo} material={assets.platinum} />
      <mesh geometry={assets.lensGeo} material={assets.lens} position={[0, 0.46, 0]} scale={[1, 0.45, 1]} />

      <group ref={gearRef}>
        <StaticInstances geometry={assets.toothGeo} material={assets.graphite} matrices={teeth} />
      </group>
      <group ref={innerGearRef}>
        <StaticInstances geometry={assets.toothGeo} material={assets.platinum} matrices={innerTeeth} />
      </group>
      <StaticInstances geometry={assets.boltGeo} material={assets.graphite} matrices={bolts} />
      <StaticInstances geometry={assets.hingeGeo} material={assets.platinum} matrices={hingeMatrices} />

      <instancedMesh
        ref={railsRef}
        args={[assets.railGeo, assets.graphite, layout.rails.length * petalCount]}
        frustumCulled={false}
      />
      <instancedMesh
        ref={panelsRef}
        args={[panelGeo, assets.panel.material, layout.total]}
        frustumCulled={false}
      />
      {interactive && (
        <instancedMesh
          ref={hitRef}
          args={[assets.hitGeo, assets.hitMat, petalCount]}
          onPointerMove={(e) => {
            e.stopPropagation()
            if (e.instanceId !== undefined) sceneState.hoveredPetal = toPetal12(e.instanceId)
          }}
          onPointerOut={() => {
            sceneState.hoveredPetal = -1
          }}
        />
      )}
      </group>
    </group>
  )
}

function StaticInstances({
  geometry,
  material,
  matrices,
}: {
  geometry: THREE.BufferGeometry
  material: THREE.Material
  matrices: THREE.Matrix4[]
}) {
  const ref = useRef<THREE.InstancedMesh>(null)
  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    matrices.forEach((m, i) => mesh.setMatrixAt(i, m))
    mesh.instanceMatrix.needsUpdate = true
    mesh.computeBoundingSphere()
  }, [matrices])
  return <instancedMesh ref={ref} args={[geometry, material, matrices.length]} />
}
