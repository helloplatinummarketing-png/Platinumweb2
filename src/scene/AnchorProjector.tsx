import { useFrame, useThree } from '@react-three/fiber'
import { useMemo } from 'react'
import * as THREE from 'three'
import { anchors } from './state'

const DESKTOP = '(min-width: 768px)'

/**
 * Pins DOM labels to points on the 3D core. Any element with
 * `data-anchor="petal:3" | "hub" | "screen"` is moved, every frame, to the
 * screen position of that point, and told which side of the hub it is on
 * (`data-side`) so its label can sit outwards. Labels behind the hub dim.
 * Phones skip this and show the same labels in normal flow.
 */
export function AnchorProjector() {
  const camera = useThree((s) => s.camera)
  const size = useThree((s) => s.size)
  const v = useMemo(() => new THREE.Vector3(), [])
  const hub = useMemo(() => new THREE.Vector3(), [])
  const cache = useMemo(() => ({ els: [] as HTMLElement[], frame: 0, desktop: true }), [])

  useFrame(() => {
    if (cache.frame++ % 30 === 0) {
      cache.els = Array.from(document.querySelectorAll<HTMLElement>('[data-anchor]'))
      cache.desktop = window.matchMedia(DESKTOP).matches
    }
    if (!cache.desktop) return

    hub.copy(anchors.hub).project(camera)
    const hubX = (hub.x * 0.5 + 0.5) * size.width
    const hubDist = camera.position.distanceTo(anchors.hub)

    for (const el of cache.els) {
      const [kind, index] = (el.dataset.anchor ?? '').split(':')
      const world = kind === 'petal' ? anchors.petal[Number(index)] : kind === 'screen' ? anchors.screen : anchors.hub
      if (!world) continue
      const behind = camera.position.distanceTo(world) > hubDist + 0.6
      v.copy(world).project(camera)
      const x = (v.x * 0.5 + 0.5) * size.width
      const y = (-v.y * 0.5 + 0.5) * size.height
      el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      const side = x >= hubX ? 'r' : 'l'
      if (el.dataset.side !== side) el.dataset.side = side
      el.style.setProperty('--occluded', behind || v.z > 1 ? '0.3' : '1')
    }
  })

  return null
}
