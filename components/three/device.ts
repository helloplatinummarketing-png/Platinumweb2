/** Decides what the visitor's device gets. Runs only in the browser. */
export interface DeviceProfile {
  webgl: boolean
  lowPower: boolean
  reducedMotion: boolean
  /** Multiplier on particle counts. */
  density: number
  maxDpr: number
}

const SOFTWARE_GPU = /swiftshader|llvmpipe|software|basic render/i

export function getDeviceProfile(): DeviceProfile {
  const nav = navigator as Navigator & {
    deviceMemory?: number
    connection?: { saveData?: boolean; effectiveType?: string }
  }
  const params = new URLSearchParams(location.search)
  const forced = params.has('forcewebgl')

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
  const coarse = matchMedia('(pointer: coarse)').matches
  const lowPower =
    coarse ||
    window.innerWidth < 768 ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4

  let webgl = !params.has('nowebgl') && !nav.connection?.saveData && !/2g/.test(nav.connection?.effectiveType ?? '')
  if (webgl) {
    const gl = document.createElement('canvas').getContext('webgl2')
    if (!gl) {
      webgl = false
    } else {
      const debug = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : ''
      if (SOFTWARE_GPU.test(renderer) && !forced) webgl = false
      gl.getExtension('WEBGL_lose_context')?.loseContext()
    }
  }

  return { webgl, lowPower, reducedMotion, density: lowPower ? 0.4 : 1, maxDpr: lowPower ? 1.5 : 2 }
}
