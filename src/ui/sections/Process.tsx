import { process } from '../../content/copy'
import { Anchored } from '../Anchored'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function Process() {
  return (
    <ShotSection id="process" labelledBy="process-title">
      <div className="px-6 pt-24 md:absolute md:bottom-28 md:left-16 md:p-0">
        <p className="micro label-line" data-fade>
          {process.label}
        </p>
        <MaskText
          as="h2"
          id="process-title"
          text={process.title}
          className="headline mt-5 max-w-[17ch] text-[clamp(2.2rem,min(4vw,8svh),4rem)]"
        />
      </div>
      <ol className="mt-8 space-y-6 px-6 md:mt-0 md:space-y-0 md:p-0">
        {process.steps.map((step, k) => (
          <li key={step.n}>
            <Anchored to={`petal:${step.petal}`} reveal={k} bodyClassName="glass w-[260px] p-4">
              <p className="micro text-gold">{step.n}</p>
              <MaskText as="h3" text={step.title} className="mt-2 block text-xl font-light" />
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{step.body}</p>
            </Anchored>
          </li>
        ))}
      </ol>
    </ShotSection>
  )
}
