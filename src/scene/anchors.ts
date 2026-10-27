import * as THREE from 'three'
import { PETAL_COUNT } from './state'

/**
 * World-space anchor points the DOM labels track. Core and Screen write them
 * every frame; AnchorProjector turns them into screen positions.
 */
export const anchors = {
  petal: Array.from({ length: PETAL_COUNT }, () => new THREE.Vector3()),
  hub: new THREE.Vector3(0, 0.6, 0),
  screen: new THREE.Vector3(),
}
