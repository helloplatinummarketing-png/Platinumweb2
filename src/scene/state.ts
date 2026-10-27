/**
 * Shared, mutable scene state.
 *
 * The scroll timeline (and UI hovers) write here; the 3D scene reads it every
 * frame inside useFrame. Keeping it outside React state means scrubbing the
 * timeline never triggers a re-render.
 */
export const PETAL_COUNT = 12

export const sceneState = {
  /** 0 = petals closed into a bud, 1 = fully open. Staggered per petal. */
  unfold: 0,
  /** Number of petals switched on, fractional values ignite the next petal partway. */
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
  /** Overall glow of the hub core, 0..1. */
  charge: 0,
  /** Petal index under the cursor, or -1. */
  hoveredPetal: -1,
}

export type SceneState = typeof sceneState
