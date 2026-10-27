import { faq } from '../../content/copy'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function Faq() {
  return (
    <ShotSection id="faq" labelledBy="faq-title" contentClassName="px-6 pb-32 pt-28 md:px-16 md:pt-36">
      <div className="max-w-2xl">
        <p className="micro label-line" data-fade>
          {faq.label}
        </p>
        <MaskText as="h2" id="faq-title" text={faq.title} className="headline mt-5 text-[clamp(2.4rem,5vw,5rem)]" />
        <div className="mt-12 space-y-2">
          {faq.items.map((item) => (
            <details key={item.q} data-fade data-interactive className="faq-item glass">
              <summary className="flex items-center justify-between gap-6 px-5 py-4 text-base font-light md:text-lg">
                {item.q}
                <span aria-hidden="true" className="faq-item__icon font-mono text-gold">
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-sm leading-relaxed text-slate-400">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </ShotSection>
  )
}
