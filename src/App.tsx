import { Scene } from './scene/Scene'
import * as copy from './content/copy'
import { SHOTS } from './timeline/shots'
import { useMasterTimeline } from './timeline/useMasterTimeline'
import { MaskText } from './ui/MaskText'
import { ShotSection } from './ui/ShotSection'

// Step 3: placeholder copy per shot to prove the camera timeline.
const PLACEHOLDER: Record<string, { label: string; title: string }> = {
  hero: { label: copy.hero.eyebrow, title: copy.hero.title.join(' ') },
  stats: { label: 'STATS', title: 'Signal' },
  problem: copy.problem,
  solution: copy.solution,
  work: copy.work,
  pricing: copy.pricing,
  process: copy.process,
  whyus: copy.whyUs,
  faq: copy.faq,
  cta: copy.finalCta,
  footer: { label: copy.footer.location, title: 'Footer' },
}

export default function App() {
  useMasterTimeline(true)
  return (
    <>
      <div className="fixed inset-0">
        <Scene />
      </div>
      <main className="relative">
        {SHOTS.map((s) => (
          <ShotSection key={s.id} id={s.id} className={s.pin ? '' : 'min-h-[160svh]'}>
            <div className="flex h-full flex-col justify-center px-6 py-24 md:px-16">
              <p className="micro label-line" data-fade>
                {PLACEHOLDER[s.id].label}
              </p>
              <MaskText as="h2" className="headline mt-6 max-w-3xl text-5xl md:text-7xl" text={PLACEHOLDER[s.id].title} />
            </div>
          </ShotSection>
        ))}
      </main>
    </>
  )
}
