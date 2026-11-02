'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { automations } from '@/content/automations'
import { loadGsap, prefersReducedMotion, queueRefresh } from '@/lib/gsap'
import { sceneState } from '@/components/three/sceneState'
import { useDeviceProfile } from '@/components/three/useDeviceProfile'
import { useInView } from '@/components/three/useInView'

const PhoneSequenceCanvas = dynamic(() => import('@/components/three/PhoneSequenceCanvas'), { ssr: false })

/**
 * The seven automations as a pinned sequence, with the phone screen following along.
 * Without JavaScript or with reduced motion they stack as normal text, each with its
 * message flow written out, so nothing depends on the 3D.
 */
export function AutomationSequence() {
  const { list, listTitle } = automations
  const section = useRef<HTMLElement>(null)
  const steps = useRef<HTMLOListElement>(null)
  const profile = useDeviceProfile()
  const inView = useInView(section)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    if (prefersReducedMotion()) return
    let cleanup = () => {}
    let cancelled = false
    void loadGsap().then(({ gsap, ScrollTrigger }) => {
      if (cancelled || !section.current || !steps.current) return
      setPinned(true)
      const items = gsap.utils.toArray<HTMLElement>(steps.current.children)
      gsap.set(items.slice(1), { autoAlpha: 0, y: 24 })

      const timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: section.current,
          start: 'top top',
          end: () => `+=${innerHeight * 4.5}`,
          pin: true,
          scrub: 0.4,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            sceneState.phoneStep = Math.min(items.length - 1, Math.floor(self.progress * items.length))
          },
        },
      })
      items.forEach((item, i) => {
        if (i === 0) return
        // Each change is centred on the boundary where the phone screen switches too.
        const at = i / items.length
        timeline.to(items[i - 1], { autoAlpha: 0, y: -24, duration: 0.03 }, at - 0.03)
        timeline.to(item, { autoAlpha: 1, y: 0, duration: 0.03 }, at)
      })
      timeline.set({}, {}, 1)

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
    <section ref={section} data-pinned={pinned || undefined} className={`relative flex flex-col overflow-hidden bg-bg lg:flex-row lg:items-center ${pinned ? 'min-h-svh' : 'py-20'}`}>
      <div className="wrap relative z-10 pt-20 lg:grid lg:grid-cols-2 lg:pt-0">
        <div>
          <h2 className="section-heading text-metal">{listTitle}</h2>
          <ol ref={steps} className="seq-steps mt-6 space-y-8 lg:mt-10">
            {list.map((item, i) => (
              <li key={item.title} className="seq-step flex gap-4 sm:gap-5">
                <span className="w-9 shrink-0 font-display text-4xl leading-none font-medium text-accent sm:w-14 sm:text-6xl">{i + 1}</span>
                <div>
                  <h3 className="font-display text-xl leading-tight font-medium tracking-tight sm:text-3xl">{item.title}</h3>
                  <p className="mt-2 max-w-lg text-silver sm:mt-3 sm:text-lg">{item.body}</p>
                  <ul className="seq-flow mt-4 max-w-sm space-y-2">
                    {item.flow.map((message, m) => (
                      <li key={m} className="rounded-xl border border-border bg-surface px-3 py-2 text-sm">
                        {message.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      {pinned && (
        <div className="scene-slot relative mb-16 h-[42svh] w-full flex-1 lg:absolute lg:inset-y-0 lg:right-0 lg:mb-0 lg:h-auto lg:w-1/2" aria-hidden="true">
          {profile?.webgl && <PhoneSequenceCanvas profile={profile} inView={inView} />}
        </div>
      )}
    </section>
    </div>
  )
}
