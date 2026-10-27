import { hero, links } from '../../content/copy'
import { scrollToShot } from '../../timeline/useMasterTimeline'
import { Anchored } from '../Anchored'
import { MagneticButton } from '../MagneticButton'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

export function Hero() {
  return (
    <ShotSection id="hero" labelledBy="hero-title">
      <div className="flex h-full flex-col justify-end px-6 pb-28 pt-28 md:justify-center md:px-16 md:pb-0">
        <p className="micro label-line" data-hero-fade>
          {hero.eyebrow}
        </p>
        <MaskText
          as="h1"
          id="hero-title"
          text={hero.title}
          className="headline mt-6 text-[clamp(3.2rem,min(10vw,17svh),10rem)] uppercase"
        />
        <p data-hero-fade className="mt-6 max-w-md text-base text-slate-400 md:text-lg">
          {hero.sub}
        </p>
        <div data-hero-fade className="mt-8 flex flex-wrap gap-3">
          <MagneticButton
            href="#work"
            onClick={(e) => {
              e.preventDefault()
              scrollToShot('work')
            }}
          >
            {hero.primary}
          </MagneticButton>
          <MagneticButton href={links.bookDemo} target="_blank" rel="noopener" variant="outline">
            {hero.secondary}
          </MagneticButton>
        </div>
      </div>

      <ul aria-label="Live activity" className="anchor-list hidden md:block" data-hero-chips>
        {hero.events.map((e) => (
          <li key={e.tag}>
            <Anchored to={`petal:${e.petal}`} reveal="fade" bodyClassName="glass px-4 py-3" className="hero-chip">
              <span className="block">
                <span className="micro flex items-center gap-2 text-gold">
                  <span className="pulse-dot" aria-hidden="true" />
                  {e.tag}
                </span>
                <span className="mt-1.5 block text-sm text-slate-300">{e.text}</span>
              </span>
            </Anchored>
          </li>
        ))}
      </ul>

      <p data-hero-fade className="micro absolute bottom-7 left-1/2 -translate-x-1/2 text-slate-400">
        {hero.hudRight}
      </p>
    </ShotSection>
  )
}
