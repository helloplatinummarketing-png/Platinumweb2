import { useEffect, useRef, useState } from 'react'
import { hero } from '../content/copy'
import { readouts, sceneState } from '../scene/state'
import { SHOTS } from '../timeline/shots'
import { scrollToShot } from '../timeline/useMasterTimeline'

const LAT = 51.4545
const LON = -2.5879

/** Solar elevation over Bristol, degrees. Good to about a degree, which is plenty for a HUD. */
function sunElevation(date: Date) {
  const rad = Math.PI / 180
  const start = Date.UTC(date.getUTCFullYear(), 0, 0)
  const day = (date.getTime() - start) / 86400000
  const decl = -23.44 * Math.cos(((2 * Math.PI) / 365) * (day + 10))
  const solarHours = date.getUTCHours() + date.getUTCMinutes() / 60 + LON / 15
  const hourAngle = 15 * (solarHours - 12)
  const sin = Math.sin(LAT * rad) * Math.sin(decl * rad) + Math.cos(LAT * rad) * Math.cos(decl * rad) * Math.cos(hourAngle * rad)
  return Math.asin(sin) / rad
}

const ukTime = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: 'numeric', minute: '2-digit', hour12: true })

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The HUD frame. Every readout is live: UK time, the real sun angle over
 * Bristol, core charge from scroll progress, and petals lit from the scene.
 * Values are written straight to the DOM each frame; React only re-renders
 * when the shot changes.
 */
export function Hud() {
  const [shot, setShot] = useState(0)
  const time = useRef<HTMLSpanElement>(null)
  const sun = useRef<HTMLSpanElement>(null)
  const charge = useRef<HTMLSpanElement>(null)
  const lit = useRef<HTMLSpanElement>(null)
  const bar = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    let last = -1
    let lastShot = -1
    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (sceneState.shot !== lastShot) {
        lastShot = sceneState.shot
        setShot(lastShot)
      }
      const now = new Date()
      if (now.getSeconds() !== last) {
        last = now.getSeconds()
        if (time.current) time.current.textContent = ukTime.format(now).toUpperCase()
        if (sun.current) sun.current.textContent = `${sunElevation(now).toFixed(1)}°`
      }
      const pct = Math.round(sceneState.progress * 100)
      if (charge.current) charge.current.textContent = `${pct}%`
      if (bar.current) bar.current.style.transform = `scaleX(${sceneState.progress})`
      if (lit.current) lit.current.textContent = pad(Math.round(readouts.petalsLit))
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="pointer-events-none fixed inset-0 z-20 select-none" aria-hidden="false">
      <span className="hud-corner left-4 top-4 md:left-6 md:top-6" aria-hidden="true" />
      <span className="hud-corner right-4 top-4 md:right-6 md:top-6" aria-hidden="true" />
      <span className="hud-corner bottom-4 left-4 md:bottom-6 md:left-6" aria-hidden="true" />
      <span className="hud-corner bottom-4 right-4 md:bottom-6 md:right-6" aria-hidden="true" />

      {/* Bottom left: where we are in the story. */}
      <div className="micro absolute bottom-7 left-7 hidden text-slate-400 md:block">
        <p className="mb-3 text-[9px] text-slate-400 [@media(max-height:760px)]:hidden">{hero.hudLeft}</p>
        <nav aria-label="Story progress" className="pointer-events-auto flex items-center gap-2">
          {SHOTS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => scrollToShot(s.id)}
              aria-label={`Go to ${s.name}`}
              aria-current={i === shot ? 'step' : undefined}
              className="group grid h-4 w-4 place-items-center"
            >
              <span
                className={`block h-1.5 w-1.5 rounded-full transition-all duration-500 ${
                  i === shot ? 'scale-125 bg-gold' : i < shot ? 'bg-slate-300' : 'bg-slate-600 group-hover:bg-slate-300'
                }`}
              />
            </button>
          ))}
          <span className="ml-3 text-ink">
            {pad(shot + 1)} <span className="text-gold">{SHOTS[shot].name}</span>
          </span>
        </nav>
      </div>

      {/* Bottom right: live readouts. */}
      <div className="micro absolute bottom-7 right-7 text-right text-[9px] text-slate-400 md:text-[10px]" role="status" aria-live="off">
        <p className="hidden md:block">
          <span ref={time}>--:--</span> · SUN <span ref={sun}>--</span> · CHARGE <span ref={charge}>0%</span>
        </p>
        <p className="mt-2 text-ink">
          PETALS LIT <span ref={lit} className="text-gold">00</span> / 12
        </p>
        <span className="mt-3 ml-auto block h-px w-40 bg-white/10">
          <span ref={bar} className="block h-px origin-left bg-gold" style={{ transform: 'scaleX(0)' }} />
        </span>
      </div>
    </div>
  )
}
