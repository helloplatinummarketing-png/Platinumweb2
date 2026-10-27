import { finalCta, links } from '../../content/copy'
import { MagneticButton } from '../MagneticButton'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function FinalCta() {
  return (
    <ShotSection id="cta" labelledBy="cta-title">
      <div className="flex h-full flex-col items-center justify-between px-6 pb-24 pt-24 text-center md:items-start md:px-16 md:pt-28 md:text-left">
        <div className="flex flex-col items-center md:items-start">
          <p className="micro label-line" data-fade>
            {finalCta.label}
          </p>
          <MaskText
            as="h2"
            id="cta-title"
            text={finalCta.title}
            className="headline mt-5 max-w-[16ch] text-[clamp(2.2rem,min(5vw,9svh),5rem)]"
          />
          <p data-fade className="mt-5 max-w-lg text-slate-400">
            {finalCta.body}
          </p>
          <div data-fade className="mt-7 flex flex-col items-center gap-3 md:items-start">
            <MagneticButton href={links.bookDemo} target="_blank" rel="noopener">
              {finalCta.cta}
            </MagneticButton>
            <p className="micro text-slate-400">
              {finalCta.call}{' '}
              <a href={links.phone} className="text-ink hover:text-gold">
                {links.phoneLabel}
              </a>
            </p>
          </div>
        </div>
        <MaskText
          as="p"
          text={finalCta.closing}
          className="headline text-[clamp(2.8rem,min(9vw,15svh),10rem)] text-ink/90"
        />
      </div>
    </ShotSection>
  )
}
