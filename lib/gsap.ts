/** GSAP and ScrollTrigger, loaded once and after first paint so they never delay the text. */
let loading: Promise<{ gsap: typeof import('gsap').gsap; ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger }> | null = null

export function loadGsap() {
  loading ??= Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger)
    ScrollTrigger.config({ ignoreMobileResize: true })
    return { gsap, ScrollTrigger }
  })
  return loading
}

let refreshQueued = 0

/** Sections pin at different times, so re-measure once after the last one has been created. */
export function queueRefresh(refresh: () => void) {
  cancelAnimationFrame(refreshQueued)
  refreshQueued = requestAnimationFrame(() => {
    refreshQueued = requestAnimationFrame(refresh)
  })
}

export function prefersReducedMotion() {
  return matchMedia('(prefers-reduced-motion: reduce)').matches
}
