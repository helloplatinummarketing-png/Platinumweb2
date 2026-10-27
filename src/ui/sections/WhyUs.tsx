import { whyUs } from '../../content/copy'
import { Anchored } from '../Anchored'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function WhyUs() {
  return (
    <ShotSection id="whyus" labelledBy="whyus-title">
      <div className="px-6 pt-24 md:px-16 md:pt-28">
        <p className="micro label-line" data-fade>
          {whyUs.label}
        </p>
        <MaskText as="h2" id="whyus-title" text={whyUs.title} className="headline mt-5 text-[clamp(2.4rem,min(6vw,11svh),6rem)]" />
      </div>
      <ul className="anchor-list mt-8 grid grid-cols-2 gap-5 px-6 md:mt-0 md:block md:p-0">
        {whyUs.points.map((p) => (
          <li key={p.title}>
            <Anchored to={`petal:${p.petal}`} bodyClassName="max-w-[230px]">
              <h3 className="micro text-gold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{p.body}</p>
            </Anchored>
          </li>
        ))}
      </ul>
    </ShotSection>
  )
}
