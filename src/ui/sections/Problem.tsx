import { problem } from '../../content/copy'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function Problem() {
  return (
    <ShotSection id="problem" labelledBy="problem-title">
      <div className="flex h-full flex-col justify-end px-6 pb-28 md:justify-center md:px-16 md:pb-0">
        <p className="micro label-line text-[#7fa2ff]" data-fade>
          {problem.label}
        </p>
        <MaskText
          as="h2"
          id="problem-title"
          text={problem.title}
          className="headline mt-6 max-w-[14ch] text-[clamp(2.4rem,min(6vw,11svh),6rem)]"
        />
        <p data-fade className="mt-6 max-w-md text-slate-400">
          {problem.body}
        </p>
        <ul className="mt-10 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
          {problem.stats.map((s) => (
            <li key={s.label} data-fade>
              <p className="glitch font-mono text-2xl text-ink md:text-4xl" data-text={s.value}>
                {s.value}
              </p>
              <p className="micro mt-2 text-[9px] leading-relaxed text-slate-400">{s.label}</p>
            </li>
          ))}
        </ul>
      </div>
    </ShotSection>
  )
}
