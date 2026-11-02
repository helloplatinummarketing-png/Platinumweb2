/** Written by scroll timelines and read by render loops, so scrolling never re-renders React. */
export const sceneState = {
  /** 0 to 1: how far the Websites page devices have tilted. */
  deviceTilt: 0,
  /** Which automation the phone is showing. */
  phoneStep: 0,
  /** 0 to 1: the Nairobi map story. */
  mapProgress: 0,
}

export function cssColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

/** Reduced motion gets one frame on demand. Otherwise the loop runs only while on screen. */
export function frameloopFor(reducedMotion: boolean, inView: boolean) {
  if (reducedMotion) return 'demand' as const
  return inView ? ('always' as const) : ('never' as const)
}
