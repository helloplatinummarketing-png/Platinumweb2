'use client'

import { useRef } from 'react'
import { useDeviceProfile } from './useDeviceProfile'
import { useInView } from './useInView'

/** What a lazily mounted 3D scene needs: a host to watch, the device profile, and whether it's on screen. */
export function useStage<T extends HTMLElement = HTMLDivElement>() {
  const host = useRef<T>(null)
  const profile = useDeviceProfile()
  const inView = useInView(host)
  return { host, profile, inView }
}
