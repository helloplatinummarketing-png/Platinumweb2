/**
 * Shared, mutable state for the one globe on the page. Scroll timelines write to it
 * and the render loop reads it, so scrolling never causes a React re-render.
 */
export const globeControls = {
  scale: 1,
  /** Screen offset in world units. */
  x: 0,
  y: 0,
  /** 0 = free slow spin. 1 = turned to face focusLon and focusLat. */
  focus: 0,
  // Centred on Africa, with Kenya just right of the middle.
  focusLat: 0,
  focusLon: 26,
  /** Set by the globe. Asks for one new frame when the render loop is on demand. */
  invalidate: () => {},
}

/** How far the camera stands back. Narrow screens pull it back so the whole globe still fits. */
export function globeCameraZ(aspect: number) {
  return 3.15 * Math.max(1, 0.72 / aspect)
}

/** Half the visible height and width, in world units, at the globe's depth. */
export function globeViewHalfSize(aspect: number) {
  const halfHeight = globeCameraZ(aspect) * Math.tan((45 / 2) * (Math.PI / 180))
  return { halfHeight, halfWidth: halfHeight * aspect }
}

export function latLonToVector(lat: number, lon: number, radius = 1): [number, number, number] {
  const phi = (lat * Math.PI) / 180
  const lambda = (lon * Math.PI) / 180
  // Longitude 0 faces the camera (+z), with east on the right.
  return [radius * Math.cos(phi) * Math.sin(lambda), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(lambda)]
}
