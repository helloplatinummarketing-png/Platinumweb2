import 'lenis/dist/lenis.css'
import { lazy, Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { capabilities, mode } from './capabilities'
import { sceneState } from './scene/state'
import { SHOTS, endState } from './timeline/shots'
import { useMasterTimeline } from './timeline/useMasterTimeline'
import { Hud } from './ui/Hud'
import { Loader } from './ui/Loader'
import { Nav } from './ui/Nav'
import { PetalTooltip } from './ui/PetalTooltip'
import { Faq } from './ui/sections/Faq'
import { FinalCta } from './ui/sections/FinalCta'
import { Footer } from './ui/sections/Footer'
import { Hero } from './ui/sections/Hero'
import { Pricing } from './ui/sections/Pricing'
import { Problem } from './ui/sections/Problem'
import { Process } from './ui/sections/Process'
import { Solution } from './ui/sections/Solution'
import { Stats } from './ui/sections/Stats'
import { Work } from './ui/sections/Work'
import { WhyUs } from './ui/sections/WhyUs'

/** Reduced motion: hold the fully running core in the hero framing. */
function applyStillState() {
  const lit = endState(SHOTS.find((s) => s.id === 'whyus')!)
  Object.assign(sceneState, {
    unfold: 1,
    litCount: 12,
    charge: lit.charge,
    glow: 1,
    hubSpin: 0,
    shift: 0.22,
  })
  sceneState.camera.position.set(0, 4.6, 10.5)
  sceneState.camera.target.set(0, 0.3, 0)
  sceneState.camera.fov = 34
}

if (mode === 'static') applyStillState()

// The 3D bundle loads after first paint; the poster holds the frame until then.
const Scene = lazy(() => import('./scene/Scene').then((m) => ({ default: m.Scene })))
const Poster = () => <img src="/poster.jpg" alt="" className="h-full w-full object-cover opacity-80" />

/** Mount the 3D only once the page has painted and the browser is idle. */
function useIdle(timeout = 1200) {
  const [idle, setIdle] = useState(false)
  useEffect(() => {
    const go = () => setIdle(true)
    // Safari has no requestIdleCallback.
    if (typeof window.requestIdleCallback !== 'function') {
      const id = setTimeout(go, 300)
      return () => clearTimeout(id)
    }
    const id = window.requestIdleCallback(go, { timeout })
    return () => window.cancelIdleCallback(id)
  }, [timeout])
  return idle
}

export default function App() {
  const full = mode === 'full'
  const idle = useIdle()
  useMasterTimeline(full)

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('static-page', !full)
  }, [full])

  return (
    <>
      <div className="fixed inset-0" aria-hidden="true">
        {mode === 'poster' ? (
          <Poster />
        ) : (
          <Suspense fallback={<Poster />}>
            {idle ? <Scene mobile={capabilities.mobile} still={mode === 'static'} /> : <Poster />}
          </Suspense>
        )}
      </div>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-navy">
        Skip to content
      </a>
      <Nav />
      <main id="main" className="relative">
        <Hero />
        <Stats />
        <Problem />
        <Solution />
        <Work />
        <Pricing />
        <Process />
        <WhyUs />
        <Faq />
        <FinalCta />
        <Footer />
      </main>
      {full && <Hud />}
      {full && !capabilities.mobile && <PetalTooltip />}
      {full && <Loader />}
    </>
  )
}
