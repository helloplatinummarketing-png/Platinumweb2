'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { geo } from '@/content/geo'
import { loadGsap, prefersReducedMotion, queueRefresh } from '@/lib/gsap'
import { sceneState } from '@/components/three/sceneState'
import { useDeviceProfile } from '@/components/three/useDeviceProfile'
import { useInView } from '@/components/three/useInView'

const NairobiMapCanvas = dynamic(() => import('@/components/three/NairobiMapCanvas'), { ssr: false })

/** The "Try it yourself" mock: a stylised Nairobi map where the "You" pin lights up after GEO. */
export function TryItMap() {
  const { tryIt } = geo
  const section = useRef<HTMLElement>(null)
  const profile = useDeviceProfile()
  const inView = useInView(section)
  const [after, setAfter] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      // The static end state: tilted, both pins up, "You" lit.
      sceneState.mapProgress = 1
      // eslint-disable-next-line react-hooks/set-state-in-effect -- motion preference only exists after mount
      setAfter(true)
      return
    }
    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ ScrollTrigger }) => {
      if (cancelled || !section.current) return
      const trigger = ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: () => `+=${innerHeight * 1.8}`,
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          sceneState.mapProgress = self.progress
          setAfter(self.progress > 0.68)
        },
      })
      queueRefresh(() => ScrollTrigger.refresh())
      cleanup = () => trigger.kill()
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div>{/* GSAP wraps the pinned section, so React needs this stable parent to remove. */}
    <section ref={section} className="relative flex min-h-svh flex-col overflow-hidden bg-bg lg:flex-row lg:items-center">
      <div className="wrap relative z-10 grid pt-20 lg:grid-cols-[1fr_1.15fr] lg:pt-0">
        <div>
          <p className="font-display text-2xl leading-tight font-medium tracking-tight sm:text-4xl">{tryIt.prompt}</p>
          <p className="mt-4 max-w-lg text-silver sm:mt-5 sm:text-lg">{tryIt.consequence}</p>
          <p className="mt-4 inline-block rounded-full border border-border-strong px-3 py-1 text-xs text-silver">{tryIt.mockLabel}</p>
          {/* The pins are decorative 3D, so what they show is here as real text. */}
          <p className="sr-only">
            {tryIt.competitorPin}. {tryIt.youPin}
            {after && `, ${tryIt.afterLabel}`}.
          </p>
        </div>
      </div>
      <div className="scene-slot relative mb-16 h-[48svh] w-full flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:mb-0 lg:h-auto lg:w-[72%]" aria-hidden="true">
        {profile?.webgl && <NairobiMapCanvas profile={profile} inView={inView} />}
      </div>
    </section>
    </div>
  )
}
