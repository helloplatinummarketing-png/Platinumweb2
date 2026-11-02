'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { home } from '@/content/home'
import { loadGsap, prefersReducedMotion, queueRefresh } from '@/lib/gsap'
import { morphState } from '@/components/three/morphState'
import { useDeviceProfile } from '@/components/three/useDeviceProfile'
import { useInView } from '@/components/three/useInView'

const MorphCanvas = dynamic(() => import('@/components/three/MorphCanvas'), { ssr: false })

/**
 * The pinned, three-step story. Without JavaScript or with reduced motion, all three
 * steps simply stack as normal text beside the object's final state.
 */
export function HowItWorks() {
  const { how } = home
  const section = useRef<HTMLElement>(null)
  const steps = useRef<HTMLOListElement>(null)
  const profile = useDeviceProfile()
  const inView = useInView(section)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) {
      // The static end state: particles streaming into the core, held still.
      morphState.build = 1
      morphState.stream = 1
      morphState.invalidate()
      return
    }
    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !section.current || !steps.current) return
      setPinned(true)
      const items = gsap.utils.toArray<HTMLElement>(steps.current.children)
      gsap.set(items.slice(1), { autoAlpha: 0, y: 28 })

      const state = { build: 0, stream: 0 }
      const write = () => {
        morphState.build = state.build
        morphState.stream = state.stream
      }
      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        onUpdate: write,
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${innerHeight * 2.6}`,
          pin: true,
          scrub: 0.5,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      })
      timeline
        // Step 1 holds, then the cloud snaps into a grid.
        .to(state, { build: 1, duration: 0.2, ease: 'power2.inOut' }, 0.24)
        .to(items[0], { autoAlpha: 0, y: -28, duration: 0.07 }, 0.26)
        .to(items[1], { autoAlpha: 1, y: 0, duration: 0.07 }, 0.34)
        // Step 2 holds, then the grid streams into the core.
        .to(state, { stream: 1, duration: 0.2, ease: 'power1.inOut' }, 0.6)
        .to(items[1], { autoAlpha: 0, y: -28, duration: 0.07 }, 0.62)
        .to(items[2], { autoAlpha: 1, y: 0, duration: 0.07 }, 0.7)
        .set({}, {}, 1)

      queueRefresh(() => ScrollTrigger.refresh())
      cleanup = () => {
        timeline.scrollTrigger?.kill()
        timeline.kill()
      }
    })
    return () => {
      cancelled = true
      cleanup()
    }
  }, [])

  return (
    <div>{/* GSAP wraps the pinned section, so React needs this stable parent to remove. */}
    <section ref={section} data-pinned={pinned || undefined} className="relative z-10 flex min-h-svh flex-col overflow-hidden bg-bg lg:flex-row lg:items-center">
      <div className="wrap relative z-10 pt-24 lg:grid lg:grid-cols-2 lg:pt-0">
        <div>
          <h2 className="section-heading text-metal">{how.title}</h2>
          <ol ref={steps} className="how-steps mt-6 space-y-6 lg:mt-10">
            {how.steps.map((step, i) => (
              <li key={step.title} className="how-step flex gap-5">
                <span className="font-display text-5xl leading-none font-medium text-accent sm:text-7xl">{i + 1}</span>
                <div>
                  <h3 className="font-display text-2xl leading-tight font-medium tracking-tight sm:text-4xl">{step.title}</h3>
                  <p className="mt-3 max-w-md text-silver sm:text-lg">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="relative mb-16 h-[40svh] w-full flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:mb-0 lg:h-auto lg:w-1/2" aria-hidden="true">
        {profile?.webgl ? (
          <MorphCanvas profile={profile} active={inView} />
        ) : (
          <div className="h-full bg-[radial-gradient(circle_at_50%_50%,rgb(43_214_123/0.22),transparent_55%)]" />
        )}
      </div>
    </section>
    </div>
  )
}
