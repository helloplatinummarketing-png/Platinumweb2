/** A plain 3-vector. Keeps this module free of three.js so the DOM bundle stays small. */
export class Vec3 {
  x: number
  y: number
  z: number
  constructor(x = 0, y = 0, z = 0) {
    this.x = x
    this.y = y
    this.z = z
  }
  set(x: number, y: number, z: number) {
    this.x = x
    this.y = y
    this.z = z
    return this
  }
}

/**
 * Shared, mutable scene state.
 *
 * The scroll timeline (and UI hovers) write here; the 3D scene reads it every
 * frame inside useFrame and the HUD polls it. Keeping it outside React state
 * means scrubbing the timeline never triggers a re-render. This object is the
 * single value both the 3D scene and the DOM read, which is what keeps them
 * one unit.
 */
export const PETAL_COUNT = 12

export const sceneState = {
  /** 0 = petals closed into a bud, 1 = fully open. Staggered per petal. */
  unfold: 0,
  /** Petals switched on, out of 12. Fractional values ignite the next petal partway. */
  litCount: 0,
  /** 0..1, panels drift apart from their petals (the "problem" shot). */
  scatter: 0,
  /** 0..1, panels fly in and assemble into petals (loader). */
  assemble: 1,
  /** 0..1, broken flickering of panels. */
  flicker: 0,
  /** 0..1, cold blue cast on the lighting. */
  cold: 0,
  /** Multiplier on the idle hub spin. */
  hubSpin: 1,
  /** Glow of the hub core and scene warmth, 0..1. */
  charge: 0,
  /** Overall brightness of lit panels (dims the machine to idle in the footer). */
  glow: 1,
  /** 0..1, how far the gold light path has travelled (process shot). */
  path: 0,
  /** 0..1, visibility of the floating case-study screen (work shot). */
  screen: 0,
  /** Extra yaw of the whole core, radians. */
  coreYaw: 0,

  /** UI overrides: a pricing hover lights N petals and turns the core towards the card. */
  litOverride: -1,
  yawOverride: 0,
  /** Petal index under the cursor, or -1. */
  hoveredPetal: -1,

  /** Camera, written by the timeline, eased by the rig. */
  camera: {
    position: new Vec3(0, 6.2, 9.5),
    target: new Vec3(0, 0.6, 0),
    fov: 32,
  },
  /** Horizontal framing offset, fraction of frame width. */
  shift: 0.22,

  /** True once the 3D scene has compiled its shaders and drawn its first frame. */
  ready: false,

  /** 0..1 scroll progress through the whole timeline. */
  progress: 0,
  /** Index into SHOTS of the shot currently on screen. */
  shot: 0,
}

export type SceneState = typeof sceneState

/** Petal lit level as the scene currently resolves it (written by Core, read by the HUD). */
export const readouts = {
  petalsLit: 0,
  /** Per petal lit level 0..1, indexed on the 12-petal scale. */
  petalLevels: new Float32Array(PETAL_COUNT),
}
