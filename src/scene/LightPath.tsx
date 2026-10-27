import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { PATH_PETALS } from '../timeline/shots'
import { GOLD } from './materials'
import { PETAL_LENGTH, petalMatrix } from './Petal'
import { PETAL_COUNT, sceneState } from './state'

/**
 * The process shot's gold light path: leaves the hub and runs out along the
 * three step petals, drawn progressively by sceneState.path. Lives inside the
 * core's rotating group so it stays glued to the petals.
 */
export function LightPath({ petalCount = PETAL_COUNT }: { petalCount?: number }) {
  const mesh = useRef<THREE.Mesh>(null)
  const head = useRef<THREE.Mesh>(null)

  const { geometry, curve, count } = useMemo(() => {
    const m = new THREE.Matrix4()
    const points: THREE.Vector3[] = [new THREE.Vector3(0, 0.62, 0)]
    PATH_PETALS.forEach((p12) => {
      const p = Math.round((p12 * petalCount) / PETAL_COUNT) % petalCount
      petalMatrix(p, petalCount, 1, m)
      points.push(new THREE.Vector3(0.4, 0.08, 0).applyMatrix4(m))
      points.push(new THREE.Vector3(PETAL_LENGTH * 0.82, 0.08, 0).applyMatrix4(m))
      points.push(new THREE.Vector3(PETAL_LENGTH * 0.45, 0.35, 0).applyMatrix4(m))
      points.push(new THREE.Vector3(0, 0.75, 0))
    })
    points.pop()
    const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
    const geometry = new THREE.TubeGeometry(curve, 360, 0.014, 6, false)
    return { geometry, curve, count: geometry.index!.count }
  }, [petalCount])

  const material = useMemo(
    () => new THREE.MeshBasicMaterial({ color: GOLD.clone().multiplyScalar(2.6), toneMapped: false }),
    [],
  )
  const headPos = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    const p = sceneState.path
    const visible = p > 0.002
    if (mesh.current) {
      mesh.current.visible = visible
      // Draw whole tube segments (6 radial * 6 indices per ring step).
      const step = 6 * 6
      geometry.setDrawRange(0, Math.floor((count * p) / step) * step)
    }
    if (head.current) {
      head.current.visible = visible && p < 0.999
      curve.getPointAt(Math.min(p, 1), headPos)
      head.current.position.copy(headPos)
    }
  })

  return (
    <>
      <mesh ref={mesh} geometry={geometry} material={material} visible={false} />
      <mesh ref={head} material={material} visible={false}>
        <sphereGeometry args={[0.045, 16, 8]} />
      </mesh>
    </>
  )
}
