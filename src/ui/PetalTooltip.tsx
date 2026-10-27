import { useEffect, useRef } from 'react'
import { petals } from '../content/copy'
import { readouts, sceneState } from '../scene/state'

const pad = (n: number) => String(n).padStart(2, '0')

/** Mono tooltip that follows the cursor while it is over a petal. */
export function PetalTooltip() {
  const el = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let x = 0
    let y = 0
    let raf = 0
    let shown = -2
    const move = (e: PointerEvent) => {
      x = e.clientX
      y = e.clientY
    }
    const tick = () => {
      raf = requestAnimationFrame(tick)
      const node = el.current
      if (!node) return
      const p = sceneState.hoveredPetal
      node.style.transform = `translate3d(${x + 18}px, ${y + 18}px, 0)`
      const online = p >= 0 && readouts.petalLevels[p] > 0.5
      const key = p * 2 + (online ? 1 : 0)
      if (key !== shown) {
        shown = key
        node.style.opacity = p >= 0 ? '1' : '0'
        if (p >= 0) {
          node.innerHTML = `<span class="text-slate-400">PETAL ${pad(p + 1)} / 12</span><br/><span class="text-ink">${petals[p].toUpperCase()}</span><br/><span class="${online ? 'text-gold' : 'text-slate-400'}">${online ? '● ONLINE' : '○ STANDBY'}</span>`
        }
      }
    }
    window.addEventListener('pointermove', move)
    tick()
    return () => {
      window.removeEventListener('pointermove', move)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div
      ref={el}
      aria-hidden="true"
      className="micro glass pointer-events-none fixed left-0 top-0 z-40 px-3 py-2 leading-relaxed opacity-0 transition-opacity duration-200"
    />
  )
}
