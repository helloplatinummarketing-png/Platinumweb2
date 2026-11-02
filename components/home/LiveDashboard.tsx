'use client'

import { useEffect, useRef, useState } from 'react'
import { home } from '@/content/home'

const VISIBLE_ROWS = 4
const STEP_MS = 2400

function Kpi({ label, value, animate }: { label: string; value: number; animate: boolean }) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || !animate) return
    const started = performance.now()
    let frame = 0
    const tick = (now: number) => {
      const t = Math.min((now - started) / 1800, 1)
      el.textContent = String(Math.round(value * (1 - (1 - t) ** 3)))
      if (t < 1) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [animate, value])

  return (
    <div className="rounded-xl border border-border bg-bg/60 p-3 sm:p-4">
      <dd className="font-display text-2xl font-medium tracking-tight sm:text-3xl">
        <span ref={ref}>{value}</span>
      </dd>
      <dt className="mt-0.5 text-xs text-silver sm:text-sm">{label}</dt>
    </div>
  )
}

/**
 * The example dashboard rising out of the hero. Plain HTML/CSS so the text stays crisp.
 * Everything in it is illustrative, and it says so on the panel.
 */
export function LiveDashboard() {
  const { dashboard } = home
  const [tick, setTick] = useState(VISIBLE_ROWS - 1)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    // eslint-disable-next-line react-hooks/set-state-in-effect -- motion preference only exists after mount
    setAnimate(true)
    const timer = setInterval(() => setTick((t) => t + 1), STEP_MS)
    return () => clearInterval(timer)
  }, [])

  const rows = Array.from({ length: VISIBLE_ROWS }, (_, i) => {
    const index = tick - i
    return { index, text: dashboard.feed[index % dashboard.feed.length] }
  })

  return (
    <aside className="glass-panel rise-in mx-auto max-w-5xl rounded-t-3xl border-b-0 p-4 sm:p-6" aria-label={dashboard.exampleLabel}>
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
        <p className="flex items-center gap-2.5 font-display font-medium">
          <span className="live-dot" aria-hidden="true" />
          {dashboard.title}
        </p>
        <p className="rounded-full border border-border-strong px-2.5 py-0.5 text-xs text-silver">{dashboard.exampleLabel}</p>
      </div>
      <div className="mt-4 grid gap-4 md:grid-cols-[3fr_2fr]">
        <ul className="min-h-[10.5rem] space-y-2" aria-hidden="true">
          {rows.map((row) => (
            <li key={row.index} className="feed-item flex items-center gap-2.5 rounded-lg border border-border bg-bg/60 px-3 py-2 text-sm">
              <span className="size-1.5 shrink-0 rounded-full bg-accent" />
              {row.text}
            </li>
          ))}
        </ul>
        <dl className="grid grid-cols-2 gap-2 md:gap-3">
          {dashboard.kpis.map((kpi) => (
            <Kpi key={kpi.label} label={kpi.label} value={kpi.value} animate={animate} />
          ))}
        </dl>
      </div>
      {/* The animated feed is decorative; this is the same content for screen readers. */}
      <p className="sr-only">{dashboard.feed.join('. ')}</p>
    </aside>
  )
}
