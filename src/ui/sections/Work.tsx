import { work } from '../../content/copy'
import { Anchored } from '../Anchored'
import { GlassCard } from '../GlassCard'
import { MagneticButton } from '../MagneticButton'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function Work() {
  const cs = work.caseStudy
  return (
    <ShotSection id="work" labelledBy="work-title">
      <div className="flex h-full flex-col justify-end gap-6 px-6 pb-28 pt-24 md:justify-between md:px-16 md:pt-28">
        <div>
          <p className="micro label-line" data-fade>
            {work.label}
          </p>
          <MaskText as="h2" id="work-title" text={work.title} className="headline mt-5 text-[clamp(2.4rem,min(6vw,11svh),6rem)]" />
        </div>

        <div className="flex flex-col gap-6">
          <GlassCard data-fade className="max-w-sm p-5">
            <h3 className="micro text-ink">{cs.name}</h3>
            <p className="mt-1 text-sm text-slate-400">{cs.subtitle}</p>
            <dl className="micro mt-4 grid grid-cols-3 gap-3 border-t border-white/10 pt-4 text-[9px]">
              {cs.meta.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-slate-400">{k}</dt>
                  <dd className="mt-1 text-ink">{v}</dd>
                </div>
              ))}
            </dl>
            <ul className="mt-4 flex flex-wrap gap-2" aria-label="Services delivered">
              {cs.tags.map((t) => (
                <li key={t} className="micro border border-gold/40 px-2 py-1 text-[9px] text-gold">
                  {t}
                </li>
              ))}
            </ul>
            {/* The screenshot is shown on the 3D screen; this keeps an accessible description. */}
            <p className="sr-only">Screenshot of the Bristol Spark Electrical website homepage.</p>
            <MagneticButton href={cs.url} target="_blank" rel="noopener" variant="outline" className="mt-5 w-full">
              {cs.cta}
            </MagneticButton>
          </GlassCard>
          <p data-fade className="micro text-slate-400">
            {work.next}
          </p>
        </div>
      </div>

      <Anchored to="screen" className="hidden md:block" bodyClassName="micro text-[9px] text-slate-400">
        <span className="flex items-center gap-2">
          <span className="pulse-dot" aria-hidden="true" /> LIVE · {cs.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </span>
      </Anchored>
    </ShotSection>
  )
}
