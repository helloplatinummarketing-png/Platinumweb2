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
  focusLat: 2,
  focusLon: 36.8,
}

export function latLonToVector(lat: number, lon: number, radius = 1): [number, number, number] {
  const phi = (lat * Math.PI) / 180
  const lambda = (lon * Math.PI) / 180
  // Longitude 0 faces the camera (+z), with east on the right.
  return [radius * Math.cos(phi) * Math.sin(lambda), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(lambda)]
}
