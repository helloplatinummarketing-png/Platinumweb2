import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { sceneState } from '../scene/state'
import { SHOTS, STATE_KEYS, type ShotState } from './shots'

gsap.registerPlugin(ScrollTrigger)

/**
 * ONE master timeline, normalised to a duration of 1 and scrubbed by scroll.
 *
 * Shot positions on the timeline are measured from the real DOM sections, so
 * camera moves, petal states and text reveals always land exactly where the
 * matching copy is on the page, whatever its height.
 *
 * Section i "arrives" when its top reaches the top of the viewport. The camera
 * tweens into shot i over the stretch of scroll just before that, and the
 * shot's `steps` play across the scroll that follows while it is pinned.
 */

type Flat = Record<string, number>

const KEYS = new Set<string>(STATE_KEYS)

const flatten = (s: Partial<ShotState>): Flat => {
  const out: Flat = {}
  for (const [k, v] of Object.entries(s)) {
    if (!KEYS.has(k)) continue
    if (k === 'camera' || k === 'target') {
      const [x, y, z] = v as [number, number, number]
      const p = k === 'camera' ? 'c' : 't'
      out[`${p}x`] = x
      out[`${p}y`] = y
      out[`${p}z`] = z
    } else if (typeof v === 'number') {
      out[k] = v
    }
  }
  return out
}

function applyProxy(p: Flat) {
  const s = sceneState as unknown as Record<string, number>
  for (const k in p) {
    if (k.length === 2 && (k[0] === 'c' || k[0] === 't')) continue
    if (k === 'fov') continue
    s[k] = p[k]
  }
  sceneState.camera.position.set(p.cx, p.cy, p.cz)
  sceneState.camera.target.set(p.tx, p.ty, p.tz)
  sceneState.camera.fov = p.fov
}

let lenis: Lenis | null = null
/** Scroll position (px) where each shot is fully on screen. */
let shotScroll: number[] = []
/** Timeline progress at which each shot starts taking over the screen. */
let shotStart: number[] = []

export function scrollToShot(id: string) {
  const i = SHOTS.findIndex((s) => s.id === id)
  if (i < 0) return
  const el = document.querySelector<HTMLElement>(`[data-shot="${id}"]`)
  const y = shotScroll[i] ?? (el ? el.getBoundingClientRect().top + window.scrollY : 0)
  if (lenis) lenis.scrollTo(y, { duration: 1.6 })
  else window.scrollTo({ top: y })
}

export function getLenis() {
  return lenis
}

export function useMasterTimeline(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return

    lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.9 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    let tl: gsap.core.Timeline | null = null
    let trigger: ScrollTrigger | null = null

    const build = () => {
      const progress = trigger?.progress ?? 0
      trigger?.kill()
      tl?.kill()

      const vh = window.innerHeight
      const max = Math.max(1, document.documentElement.scrollHeight - vh)
      const sections = SHOTS.map((s) => document.querySelector<HTMLElement>(`[data-shot="${s.id}"]`))
      const tops = sections.map((el) => (el ? el.getBoundingClientRect().top + window.scrollY : 0))
      const arrive = tops.map((t) => Math.min(1, t / max))
      const trans = tops.map((t, i) => (i === 0 ? 0 : Math.min(0.6 * vh, 0.5 * (t - tops[i - 1])) / max))
      shotScroll = tops.map((t, i) => Math.min(max, t + (SHOTS[i].pin ? vh * 0.05 : 0)))
      shotStart = arrive.map((a, i) => a - trans[i] * 0.5)

      const proxy: Flat = flatten(SHOTS[0])
      tl = gsap.timeline({ paused: true, onUpdate: () => applyProxy(proxy) })

      SHOTS.forEach((shot, i) => {
        const content = sections[i]?.querySelector<HTMLElement>('[data-shot-content]') ?? sections[i]
        const holdStart = arrive[i]
        const holdEnd = i + 1 < SHOTS.length ? arrive[i + 1] - trans[i + 1] : 1
        const steps = shot.steps ?? []
        const stepDur = steps.length ? Math.max(0, holdEnd - holdStart) / steps.length : 0

        // Camera + core into this shot.
        if (i > 0) {
          tl!.to(proxy, { ...flatten(shot), duration: trans[i], ease: 'power2.inOut' }, arrive[i] - trans[i])
        }
        steps.forEach((step, j) => {
          tl!.to(proxy, { ...flatten(step), duration: stepDur * 0.85, ease: 'power1.inOut' }, holdStart + j * stepDur)
        })

        if (!content) return
        // Text reveals ride the same timeline as the camera. The hero is revealed by the loader.
        if (i > 0) {
          const at = arrive[i] - trans[i] * 0.4
          const d = trans[i] || 0.02
          const words = content.querySelectorAll('[data-wi]:not([data-step] [data-wi])')
          const fades = content.querySelectorAll('[data-fade]:not([data-step] [data-fade])')
          if (words.length)
            tl!.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: d * 0.45, stagger: d * 0.015, ease: 'power3.out' }, at)
          if (fades.length)
            tl!.fromTo(fades, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: d * 0.4, stagger: d * 0.04, ease: 'power2.out' }, at + d * 0.12)
          content.querySelectorAll<HTMLElement>('[data-count]:not([data-step] [data-count])').forEach((el) => {
            const to = Number(el.dataset.count)
            tl!.fromTo(el, { innerText: 0 }, { innerText: to, snap: { innerText: 1 }, duration: d * 0.6, ease: 'power2.out' }, at)
          })
        }
        // Pinned sections reveal their [data-step] blocks in time with the shot's steps.
        content.querySelectorAll<HTMLElement>('[data-step]').forEach((el) => {
          const k = Number(el.dataset.step)
          const at = steps.length ? holdStart + k * stepDur : arrive[i]
          const d = stepDur || trans[i] || 0.02
          tl!.fromTo(el.querySelectorAll('[data-wi]'), { yPercent: 115 }, { yPercent: 0, duration: d * 0.3, stagger: d * 0.01, ease: 'power3.out' }, at)
          tl!.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: d * 0.3 }, at)
          el.querySelectorAll<HTMLElement>('[data-count]').forEach((c) => {
            tl!.fromTo(c, { innerText: 0 }, { innerText: Number(c.dataset.count), snap: { innerText: 1 }, duration: d * 0.4 }, at)
          })
        })
        // A pinned shot clears its copy before the next shot takes over.
        if (shot.pin && i + 1 < SHOTS.length) {
          const out = arrive[i + 1] - trans[i + 1]
          tl!.fromTo(content, { autoAlpha: 1 }, { autoAlpha: 0, duration: trans[i + 1] * 0.35, ease: 'power1.in', immediateRender: false }, out)
        }
      })
      tl.to({}, { duration: 0 }, 1)

      trigger = ScrollTrigger.create({
        start: 0,
        end: 'max',
        animation: tl,
        scrub: 0.5,
        onUpdate: (self) => {
          sceneState.progress = self.progress
          let current = 0
          for (let i = 0; i < shotStart.length; i++) if (self.progress >= shotStart[i]) current = i
          sceneState.shot = current
        },
      })
      tl.progress(progress)
      trigger.update()
    }

    build()
    let timer = 0
    const onResize = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        ScrollTrigger.refresh()
        build()
      }, 200)
    }
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(onResize)

    return () => {
      window.removeEventListener('resize', onResize)
      window.clearTimeout(timer)
      trigger?.kill()
      tl?.kill()
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  }, [enabled])
}
