'use client'

import { useEffect, useState } from 'react'
import { getDeviceProfile, type DeviceProfile } from './device'

const LOW_POWER_DELAY_MS = 5000
const INTERACTIONS = ['pointerdown', 'touchstart', 'keydown', 'wheel', 'scroll'] as const

let cached: DeviceProfile | null = null
let lowPowerGate: Promise<void> | null = null

/**
 * Phones and low-power devices keep their processor free for the first moments, so
 * the page can be read and tapped straight away. The 3D starts on the first
 * interaction, or after a few seconds, with the poster showing until then.
 */
function waitForLowPowerStart() {
  lowPowerGate ??= new Promise((resolve) => {
    const start = () => {
      clearTimeout(timer)
      INTERACTIONS.forEach((name) => window.removeEventListener(name, start))
      resolve()
    }
    const timer = setTimeout(start, LOW_POWER_DELAY_MS)
    INTERACTIONS.forEach((name) => window.addEventListener(name, start, { passive: true, once: true }))
  })
  return lowPowerGate
}

/** Null until the browser has painted the text, so WebGL work can never delay it. */
export function useDeviceProfile() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null)

  useEffect(() => {
    let frame = 0
    let idle = 0
    let cancelled = false
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const mount = () => {
          cached ??= getDeviceProfile()
          const ready = cached
          if (!ready.webgl || !ready.lowPower) {
            setProfile(ready)
            return
          }
          void waitForLowPowerStart().then(() => {
            if (!cancelled) setProfile(ready)
          })
        }
        if ('requestIdleCallback' in window) idle = requestIdleCallback(mount, { timeout: 1200 })
        else mount()
      })
    })
    return () => {
      cancelled = true
      cancelAnimationFrame(frame)
      if (idle) cancelIdleCallback(idle)
    }
  }, [])

  return profile
}
