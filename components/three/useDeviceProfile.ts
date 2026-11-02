'use client'

import { useEffect, useState } from 'react'
import { getDeviceProfile, type DeviceProfile } from './device'

let cached: DeviceProfile | null = null

/** Null until the browser has painted the text, so WebGL work can never delay it. */
export function useDeviceProfile() {
  const [profile, setProfile] = useState<DeviceProfile | null>(null)

  useEffect(() => {
    let frame = 0
    let idle = 0
    frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(() => {
        const mount = () => {
          cached ??= getDeviceProfile()
          setProfile(cached)
        }
        if ('requestIdleCallback' in window) idle = requestIdleCallback(mount, { timeout: 1200 })
        else mount()
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      if (idle) cancelIdleCallback(idle)
    }
  }, [])

  return profile
}
