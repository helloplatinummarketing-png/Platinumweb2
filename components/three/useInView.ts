'use client'

import { useEffect, useState, type RefObject } from 'react'

/** Used to pause a canvas's render loop while it is off-screen. */
export function useInView(ref: RefObject<Element | null>, rootMargin = '10% 0px') {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return inView
}
