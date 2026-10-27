import * as THREE from 'three'

/**
 * Petal layout. A petal is built in its own local frame:
 *   +X runs from the hinge out to the tip, +Z across its width, +Y is its face normal.
 * Each petal is rows of thin solar-cell panels that widen towards the tip.
 *
 * Everything here is plain data so a Blender .glb can replace it later: export
 * one petal with its panels as separate meshes and feed their local matrices in
 * instead of `buildPetalPanels()`.
 */
export const PETAL = {
  hingeRadius: 0.98,
  rows: 8,
  rowPitch: 0.3,
  firstRow: 0.32,
  baseWidth: 0.26,
  widthGrowth: 0.085,
  panelDepth: 0.255,
  panelThickness: 0.018,
  colPitch: 0.175,
  gap: 0.018,
} as const

export const PETAL_LENGTH = PETAL.firstRow + (PETAL.rows - 1) * PETAL.rowPitch + PETAL.panelDepth / 2

export function petalWidthAt(x: number) {
  return PETAL.baseWidth + ((x - PETAL.firstRow) / PETAL.rowPitch) * PETAL.widthGrowth
}

export interface PanelLayout {
  /** Panel transform in petal-local space. */
  matrix: THREE.Matrix4
  row: number
  /** Width of this panel along local Z, used as the instance scale. */
  width: number
}

/** Unit panel geometry, scaled per instance on Z. */
export function createPanelGeometry() {
  return new THREE.BoxGeometry(PETAL.panelDepth, PETAL.panelThickness, 1)
}

export function buildPetalPanels(): PanelLayout[] {
  const panels: PanelLayout[] = []
  const q = new THREE.Quaternion()
  const euler = new THREE.Euler()
  for (let row = 0; row < PETAL.rows; row++) {
    const x = PETAL.firstRow + row * PETAL.rowPitch
    const w = petalWidthAt(x)
    const cols = Math.max(2, Math.round(w / PETAL.colPitch))
    const cellW = w / cols
    for (let c = 0; c < cols; c++) {
      const z = -w / 2 + cellW * (c + 0.5)
      // Slight louvre tilt and a gentle cup across the width, like a solar wing.
      const cup = (z / (w / 2)) ** 2 * 0.035
      euler.set(z * 0.18, 0, -0.06)
      q.setFromEuler(euler)
      const matrix = new THREE.Matrix4().compose(
        new THREE.Vector3(x, cup, z),
        q,
        new THREE.Vector3(1, 1, cellW - PETAL.gap),
      )
      panels.push({ matrix, row, width: cellW - PETAL.gap })
    }
  }
  return panels
}

/** Frame rails in petal-local space: two edge rails plus a spine underneath. */
export function buildPetalRails(): THREE.Matrix4[] {
  const x0 = 0.08
  const x1 = PETAL_LENGTH
  const w0 = petalWidthAt(x0) / 2 + 0.02
  const w1 = petalWidthAt(PETAL.firstRow + (PETAL.rows - 1) * PETAL.rowPitch) / 2 + 0.03
  const rails: THREE.Matrix4[] = []
  for (const side of [-1, 1]) {
    const a = new THREE.Vector3(x0, -0.012, side * w0)
    const b = new THREE.Vector3(x1, -0.012, side * w1)
    rails.push(railBetween(a, b, 0.022))
  }
  rails.push(railBetween(new THREE.Vector3(x0, -0.035, 0), new THREE.Vector3(x1 - 0.1, -0.03, 0), 0.04))
  // Cross ribs every other row give the wing its machined skeleton.
  for (let row = 1; row < PETAL.rows; row += 2) {
    const x = PETAL.firstRow + row * PETAL.rowPitch + PETAL.panelDepth / 2 + 0.012
    const w = petalWidthAt(x) / 2 + 0.02
    rails.push(railBetween(new THREE.Vector3(x, -0.016, -w), new THREE.Vector3(x, -0.016, w), 0.014))
  }
  return rails
}

const UNIT_X = new THREE.Vector3(1, 0, 0)

/** A unit box (1 x 1 x 1) stretched between two points. */
function railBetween(a: THREE.Vector3, b: THREE.Vector3, thickness: number) {
  const dir = b.clone().sub(a)
  const len = dir.length()
  const q = new THREE.Quaternion().setFromUnitVectors(UNIT_X, dir.normalize())
  return new THREE.Matrix4().compose(a.clone().add(b).multiplyScalar(0.5), q, new THREE.Vector3(len, thickness, thickness))
}

/**
 * Petal i's transform relative to the hub for a given unfold amount (0..1).
 * Closed petals stand up into a crown; open petals lie out flat in two tiers.
 */
export function petalMatrix(i: number, count: number, unfold: number, out: THREE.Matrix4) {
  const tier = i % 2
  const yaw = (i / count) * Math.PI * 2 + (tier ? 0 : 0.012)
  const closed = 1.6 - tier * 0.12
  const open = -0.1 + tier * 0.07
  const fold = THREE.MathUtils.lerp(closed, open, unfold)
  const twist = (1 - unfold) * (tier ? 0.45 : -0.45) * Math.sin(unfold * Math.PI + 0.6)
  const hingeY = 0.06 + tier * 0.07

  _q.setFromEuler(_e.set(0, yaw, 0, 'YXZ'))
  _m.makeRotationFromQuaternion(_q)
  out.copy(_m)
  out.multiply(_t.makeTranslation(PETAL.hingeRadius, hingeY, 0))
  out.multiply(_r.makeRotationZ(fold))
  out.multiply(_r2.makeRotationX(twist))
  return out
}

const _q = new THREE.Quaternion()
const _e = new THREE.Euler()
const _m = new THREE.Matrix4()
const _t = new THREE.Matrix4()
const _r = new THREE.Matrix4()
const _r2 = new THREE.Matrix4()
