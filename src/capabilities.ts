/** What this device can do, decided once at startup. */

function hasWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
  } catch {
    return false
  }
}

const params = new URLSearchParams(window.location.search)

export const capabilities = {
  webgl: params.has('nowebgl') ? false : hasWebGL(),
  // ?reduced forces the still version, ?motion forces the full one (handy when the OS has motion turned off).
  reducedMotion: params.has('motion')
    ? false
    : params.has('reduced') || window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  mobile: window.matchMedia('(max-width: 767px)').matches,
}

/**
 * 'full'   scroll-scrubbed 3D experience
 * 'static' reduced motion: one still render of the core behind a normal page
 * 'poster' no WebGL: pre-rendered poster image behind a normal page
 */
export type Mode = 'full' | 'static' | 'poster'

export const mode: Mode = !capabilities.webgl ? 'poster' : capabilities.reducedMotion ? 'static' : 'full'
