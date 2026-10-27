import gsap from 'gsap'
import { useLayoutEffect, useRef, useState } from 'react'
import { loader } from '../content/copy'
import { sceneState } from '../scene/state'
import { getLenis } from '../timeline/useMasterTimeline'

/**
 * Shot 0. The hub spins up, panels fly in and assemble into petals while a
 * counter runs to 100%. Then the overlay lifts and the hero copy masks in.
 */
export function Loader() {
  const [done, setDone] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const count = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    const hero = document.querySelector('[data-shot="hero"]')
    const words = hero?.querySelectorAll('[data-wi]') ?? []
    const fades = hero?.querySelectorAll('[data-hero-fade]') ?? []
    gsap.set(words, { yPercent: 115 })
    // Chips are positioned by the anchor projector, so they only fade (a transform would re-parent them).
    const chips = hero?.querySelectorAll('[data-hero-chips]') ?? []
    gsap.set(fades, { autoAlpha: 0, y: 20 })
    gsap.set(chips, { autoAlpha: 0 })

    sceneState.assemble = 0
    sceneState.hubSpin = 8
    const progress = { v: 0 }

    // Lenis is created in the same commit; wait a tick before pausing it.
    const lock = window.setTimeout(() => getLenis()?.stop(), 0)

    const tl = gsap.timeline({ delay: 0.3 })
    tl.to(progress, {
      v: 100,
      duration: 2.6,
      ease: 'power2.inOut',
      onUpdate: () => {
        if (count.current) count.current.textContent = String(Math.round(progress.v)).padStart(3, '0')
        if (bar.current) bar.current.style.transform = `scaleX(${progress.v / 100})`
      },
    })
      .to(sceneState, { assemble: 1, duration: 2.4, ease: 'power3.out' }, 0.1)
      .to(sceneState, { hubSpin: 1, duration: 2.6, ease: 'power2.out' }, 0.2)
      .to(root.current, { autoAlpha: 0, duration: 0.8, ease: 'power2.inOut' }, '>-0.1')
      .to(words, { yPercent: 0, duration: 1.1, stagger: 0.06, ease: 'power4.out' }, '<0.2')
      .to(fades, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out' }, '<0.3')
      .to(chips, { autoAlpha: 1, duration: 1 }, '<0.4')
      .add(() => {
        getLenis()?.start()
        setDone(true)
      })

    return () => {
      window.clearTimeout(lock)
      tl.kill()
      sceneState.assemble = 1
      sceneState.hubSpin = 1
      gsap.set([...words, ...fades, ...chips], { clearProps: 'all' })
    }
  }, [])

  if (done) return null

  return (
    <div ref={root} className="fixed inset-0 z-50 grid place-items-center bg-navy/40" role="status" aria-label="Loading">
      <div className="text-center">
        <p className="headline text-7xl tabular-nums md:text-8xl">
          <span ref={count}>000</span>
          <span className="text-gold">%</span>
        </p>
        <span className="mx-auto mt-6 block h-px w-56 bg-white/10">
          <span ref={bar} className="block h-px origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
        </span>
        <p className="micro mt-6 text-slate-400">{loader.label}</p>
      </div>
    </div>
  )
}
