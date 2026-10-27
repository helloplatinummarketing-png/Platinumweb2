import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { sceneState } from './state'

/**
 * Follows the camera written to sceneState by the master timeline, easing
 * towards it so scrubbing stays smooth. The cursor adds a little parallax.
 * On narrow (portrait) screens the camera backs off along its view line so
 * the core still fits.
 */
export function CameraRig({ parallax = true }: { parallax?: boolean }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera
  const pos = useMemo(() => sceneState.camera.position.clone(), [])
  const target = useMemo(() => sceneState.camera.target.clone(), [])
  const desired = useMemo(() => new THREE.Vector3(), [])
  const offset = useMemo(() => new THREE.Vector3(), [])

  useFrame((state, dt) => {
    const k = 1 - Math.exp(-dt * 5)
    const aspect = state.size.width / state.size.height
    const backOff = aspect < 1.3 ? Math.min(1.9, Math.pow(1.3 / aspect, 0.65)) : 1

    const cam = sceneState.camera
    offset.copy(cam.position).sub(cam.target).multiplyScalar(backOff)
    desired.copy(cam.target).add(offset)
    if (parallax) {
      desired.x += state.pointer.x * 0.25
      desired.y += state.pointer.y * 0.15
    }
    pos.lerp(desired, k)
    target.lerp(cam.target, k)

    camera.position.copy(pos)
    camera.lookAt(target)
    // Film offset slides the core sideways in frame without changing perspective.
    // Portrait layouts stack copy above the core, so it stays centred there.
    const filmGoal = aspect >= 1 ? -sceneState.shift * camera.filmGauge : 0
    if (Math.abs(camera.fov - cam.fov) > 0.01 || Math.abs(camera.filmOffset - filmGoal) > 0.001) {
      camera.fov += (cam.fov - camera.fov) * k
      camera.filmOffset += (filmGoal - camera.filmOffset) * k
      camera.updateProjectionMatrix()
    }
  })

  return null
}
