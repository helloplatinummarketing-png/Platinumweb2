import { solution } from '../../content/copy'
import { GlassCard } from '../GlassCard'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function Solution() {
  return (
    <ShotSection id="solution" labelledBy="solution-title">
      <div className="flex h-full flex-col justify-between px-6 pb-28 pt-24 md:px-16 md:pt-28">
        <div>
          <p className="micro label-line" data-fade>
            {solution.label}
          </p>
          <MaskText
            as="h2"
            id="solution-title"
            text={solution.title}
            className="headline mt-5 max-w-[16ch] text-[clamp(2.2rem,min(5vw,9svh),5rem)]"
          />
        </div>
        <ol className="grid gap-3 md:max-w-[58%] md:grid-cols-3">
          {solution.stages.map((stage, k) => (
            <li key={stage.title} data-step={k}>
              <GlassCard className="h-full p-4 md:p-5">
                <p className="micro flex justify-between text-gold">
                  <span>{stage.when}</span>
                  <span className="text-slate-500">
                    {String(k * 4 + 1).padStart(2, '0')}–{String(k * 4 + 4).padStart(2, '0')}
                  </span>
                </p>
                <MaskText as="h3" text={stage.title} className="mt-3 block text-xl font-light md:text-2xl" />
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{stage.body}</p>
              </GlassCard>
            </li>
          ))}
        </ol>
      </div>
    </ShotSection>
  )
}
