import { Scene } from './scene/Scene'
import { useMasterTimeline } from './timeline/useMasterTimeline'
import { Hud } from './ui/Hud'
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

export default function App() {
  useMasterTimeline(true)
  return (
    <>
      <div className="fixed inset-0" aria-hidden="true">
        <Scene />
      </div>
      <Nav />
      <main className="relative">
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
      <Hud />
      <PetalTooltip />
    </>
  )
}
