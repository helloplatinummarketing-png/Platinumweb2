'use client'

import { useEffect, useRef, useState } from 'react'

/** Google Maps is heavy, so it only loads as the visitor scrolls near it. */
export function MapEmbed({ src, title }: { src: string; title: string }) {
  const host = useRef<HTMLDivElement>(null)
  const [near, setNear] = useState(false)

  useEffect(() => {
    if (!host.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        observer.disconnect()
      },
      { rootMargin: '400px 0px' },
    )
    observer.observe(host.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={host} className="relative z-10 h-80 w-full bg-surface">
      {near && <iframe src={src} title={title} referrerPolicy="no-referrer-when-downgrade" className="block h-full w-full border-0" />}
    </div>
  )
}
