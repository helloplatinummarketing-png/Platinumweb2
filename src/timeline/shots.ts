/**
 * The storyboard. Every section of the page is a camera shot of one scene.
 *
 * Each shot sets the camera and the core's state. The master timeline tweens
 * from one shot to the next while the section scrolls in, then plays the shot's
 * `steps` (if any) evenly across the time the section stays pinned.
 *
 * Tuning tips:
 *  - Camera units: the hub sits at the origin, open petal tips reach ~3.6,
 *    the floor is at y = -1.62.
 *  - `pin: true` holds the section on screen (sticky) for `length` viewports.
 *    Long, scrolling sections (pricing, FAQ) use `pin: false`.
 *  - `mobileLength` shortens the pinned hold on phones.
 */

export type Vec3 = [number, number, number]

export interface ShotState {
  camera: Vec3
  target: Vec3
  fov: number
  unfold: number
  litCount: number
  scatter: number
  flicker: number
  cold: number
  charge: number
  hubSpin: number
  glow: number
  path: number
  screen: number
  coreYaw: number
  /** Horizontal framing: slides the core across the frame (fraction of width, + = right). Desktop only. */
  shift: number
}

export interface Shot extends ShotState {
  id: string
  /** Short name for the HUD progress indicator. */
  name: string
  pin: boolean
  /** Section height in viewports (pinned shots only). */
  length: number
  mobileLength: number
  /** Keyframes spread evenly across the pinned hold. */
  steps?: Partial<ShotState>[]
}

const BASE: ShotState = {
  camera: [0, 6.2, 9.5],
  target: [0, 0.6, 0],
  fov: 32,
  unfold: 0,
  litCount: 0,
  scatter: 0,
  flicker: 0,
  cold: 0,
  charge: 0.05,
  hubSpin: 1,
  glow: 1,
  path: 0,
  screen: 0,
  coreYaw: 0,
  shift: 0.22,
}

/** Petals the gold light path runs through in the process shot (out of 12). */
export const PATH_PETALS = [1, 3, 5]

export const STATE_KEYS = Object.keys(BASE) as (keyof ShotState)[]

/** The state a shot ends on, after its steps. The next shot starts from here. */
export function endState(s: ShotState & { steps?: Partial<ShotState>[] }): ShotState {
  const out = Object.fromEntries(STATE_KEYS.map((k) => [k, s[k]])) as unknown as ShotState
  return Object.assign(out, ...(s.steps ?? []))
}

const shot = (s: Partial<Shot> & Pick<Shot, 'id' | 'name'>, prev: ShotState & { steps?: Partial<ShotState>[] }): Shot => ({
  pin: true,
  length: 2.8,
  mobileLength: 2,
  ...endState(prev),
  ...s,
})

const hero = shot({ id: 'hero', name: 'Core', length: 2.2, mobileLength: 1.7 }, BASE)

const stats = shot(
  {
    id: 'stats',
    name: 'Signal',
    camera: [6.4, 3.4, 6.6],
    target: [0, 0.2, 0],
    fov: 34,
    shift: 0,
    unfold: 0.55,
    litCount: 1,
    charge: 0.15,
    steps: [{ camera: [8.4, 2.8, 3.2], unfold: 0.7 }],
  },
  hero,
)

const problem = shot(
  {
    id: 'problem',
    name: 'Fault',
    camera: [2.4, 1.5, 4.2],
    target: [0.3, 0.5, 0],
    fov: 36,
    shift: 0.18,
    unfold: 0.6,
    litCount: 0,
    scatter: 0.75,
    flicker: 1,
    cold: 1,
    charge: 0,
    hubSpin: 0.25,
    steps: [{ camera: [1.6, 1.2, 3.7], scatter: 0.9 }],
  },
  stats,
)

const solution = shot(
  {
    id: 'solution',
    name: 'Ignite',
    camera: [-4.6, 4.4, 6.6],
    target: [0, 0.1, 0],
    fov: 34,
    shift: 0.24,
    unfold: 1,
    litCount: 0,
    scatter: 0,
    flicker: 0,
    cold: 0,
    charge: 0.2,
    hubSpin: 1,
    length: 3.6,
    mobileLength: 3,
    steps: [
      { litCount: 4, charge: 0.35, camera: [-5.2, 3.8, 5.6] },
      { litCount: 8, charge: 0.6, camera: [-5.4, 3.3, 4.6] },
      { litCount: 12, charge: 0.85, camera: [-5.2, 3.0, 3.8] },
    ],
  },
  problem,
)

const work = shot(
  {
    id: 'work',
    name: 'Proof',
    camera: [6.4, 1.6, 5.6],
    target: [3.8, 1.0, -2.2],
    fov: 38,
    shift: 0,
    unfold: 0.82,
    litCount: 12,
    charge: 0.85,
    screen: 1,
    length: 2.6,
    steps: [{ camera: [3.6, 0.95, 1.4], target: [4.9, 1.2, -2.6], unfold: 0.9 }],
  },
  solution,
)

const pricing = shot(
  {
    id: 'pricing',
    name: 'Meter',
    camera: [0, 0.35, 11],
    target: [0, -1.4, 0],
    fov: 30,
    unfold: 1,
    litCount: 6,
    charge: 0.5,
    screen: 0,
    pin: false,
    length: 1,
    mobileLength: 1,
  },
  work,
)

const process = shot(
  {
    id: 'process',
    name: 'Path',
    camera: [-6.2, 3.6, 5.2],
    target: [-1.2, 0, 0],
    fov: 34,
    litCount: 0,
    charge: 0.4,
    path: 0,
    length: 3,
    mobileLength: 2.4,
    steps: [
      { path: 0.34, camera: [-2.2, 4.0, 6.8], target: [0, 0, 0] },
      { path: 0.67, camera: [2.6, 4.0, 6.6], target: [0.8, 0, 0] },
      { path: 1, camera: [6.2, 3.6, 4.8], target: [1.4, 0, 0] },
    ],
  },
  pricing,
)

const whyUs = shot(
  {
    id: 'whyus',
    name: 'Orbit',
    camera: [0, 4.4, 8.6],
    target: [0, 0.2, 0],
    fov: 36,
    litCount: 12,
    path: 0,
    charge: 0.85,
    length: 2.6,
    steps: [{ coreYaw: Math.PI * 0.5 }],
  },
  process,
)

const faq = shot(
  {
    id: 'faq',
    name: 'Answers',
    camera: [0, -0.9, 8.4],
    target: [0, 1.4, 0],
    fov: 38,
    shift: 0.25,
    charge: 0.55,
    glow: 0.7,
    coreYaw: Math.PI * 0.5,
    pin: false,
    length: 1,
    mobileLength: 1,
  },
  whyUs,
)

const cta = shot(
  {
    id: 'cta',
    name: 'Run',
    camera: [0, 4.6, 14],
    target: [0, 0.4, 0],
    fov: 34,
    shift: 0.2,
    charge: 1,
    glow: 1.25,
    unfold: 1,
    hubSpin: 2,
    length: 2.2,
    steps: [{ camera: [0, 5.4, 16], coreYaw: Math.PI }],
  },
  faq,
)

const footer = shot(
  {
    id: 'footer',
    name: 'Idle',
    camera: [0, 1.6, 12],
    target: [0, -1.2, 0],
    fov: 34,
    charge: 0.15,
    glow: 0.35,
    hubSpin: 0.4,
    pin: false,
    length: 1,
    mobileLength: 1,
  },
  cta,
)

export const SHOTS: Shot[] = [hero, stats, problem, solution, work, pricing, process, whyUs, faq, cta, footer]

export const shotIndex = (id: string) => SHOTS.findIndex((s) => s.id === id)
