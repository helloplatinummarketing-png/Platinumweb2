import { useTexture } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { work } from '../content/copy'
import { GOLD } from './materials'
import { anchors, sceneState } from './state'

const POSITION = new THREE.Vector3(5.1, 1.35, -2.9)
const FACING = new THREE.Vector3(3.6, 0.95, 1.4)
const WIDTH = 3.2
const RADIUS = 4

/** A plane bent around Y so its edges curve towards the viewer. */
function curvedPlane(width: number, height: number, radius: number) {
  const g = new THREE.PlaneGeometry(width, height, 48, 1)
  const pos = g.attributes.position as THREE.BufferAttribute
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    pos.setZ(i, (x * x) / (2 * radius))
  }
  g.computeVertexNormals()
  return g
}

/**
 * The work shot's floating case-study screen: the live site screenshot as a
 * texture on a curved panel, with a gold hairline frame. Fades in with
 * sceneState.screen.
 */
export function Screen() {
  const group = useRef<THREE.Group>(null)
  const texture = useTexture(work.caseStudy.screenshot ?? '/work/bristol-spark.jpg')
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 4

  const aspect = (texture.image as HTMLImageElement | undefined)?.width
    ? (texture.image as HTMLImageElement).width / (texture.image as HTMLImageElement).height
    : 2.37
  const height = WIDTH / aspect

  const assets = useMemo(() => {
    const screen = curvedPlane(WIDTH, height, RADIUS)
    const backing = curvedPlane(WIDTH + 0.08, height + 0.08, RADIUS).translate(0, 0, -0.02)
    const edge = new THREE.EdgesGeometry(new THREE.PlaneGeometry(WIDTH + 0.08, height + 0.08, 1, 1))
    return {
      screen,
      backing,
      edge,
      screenMat: new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false }),
      backingMat: new THREE.MeshStandardMaterial({ color: '#0b0e16', metalness: 0.8, roughness: 0.35, transparent: true }),
      edgeMat: new THREE.LineBasicMaterial({ color: GOLD.clone().multiplyScalar(2.2), transparent: true, toneMapped: false }),
    }
  }, [texture, height])

  useFrame((state) => {
    const g = group.current
    if (!g) return
    const v = sceneState.screen
    g.visible = v > 0.01
    if (!g.visible) return
    assets.screenMat.opacity = v * 0.95
    assets.backingMat.opacity = v
    assets.edgeMat.opacity = v * 0.8
    const s = 0.85 + v * 0.15
    g.scale.setScalar(s)
    g.position.copy(POSITION)
    g.position.y += Math.sin(state.clock.elapsedTime * 0.8) * 0.04 + (1 - v) * -0.4
    anchors.screen.set(-WIDTH * 0.42 * s, -height * 0.5 * s - 0.12, 0).applyMatrix4(g.matrixWorld)
  })

  return (
    <group ref={group} position={POSITION} onUpdate={(g) => g.lookAt(FACING)}>
      <mesh geometry={assets.backing} material={assets.backingMat} />
      <mesh geometry={assets.screen} material={assets.screenMat} />
      <lineSegments geometry={assets.edge} material={assets.edgeMat} position-z={-0.01} />
    </group>
  )
}
