import { links, pricing } from '../../content/copy'
import { sceneState } from '../../scene/state'
import { GlassCard } from '../GlassCard'
import { MagneticButton } from '../MagneticButton'
import { MaskText } from '../MaskText'
import { ShotSection } from '../ShotSection'

/** Hovering (or focusing) a tier lights its petals and turns the core towards the card. */
const focusTier = (k: number, petals: number) => {
  sceneState.litOverride = petals
  sceneState.yawOverride = (k - 1.5) * 0.45
}
const clearTier = () => {
  sceneState.litOverride = -1
  sceneState.yawOverride = 0
}

export function Pricing() {
  return (
    <ShotSection id="pricing" labelledBy="pricing-title" contentClassName="px-6 pb-32 pt-[42svh] md:px-16">
      <div className="text-center">
        <p className="micro label-line" data-fade>
          {pricing.label}
        </p>
        <MaskText
          as="h2"
          id="pricing-title"
          text={pricing.title}
          className="headline mx-auto mt-5 max-w-[18ch] text-[clamp(2.4rem,5vw,5rem)]"
        />
      </div>

      <ul className="mx-auto mt-14 grid max-w-7xl gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pricing.tiers.map((tier, k) => (
          <li
            key={tier.name}
            data-fade
            data-interactive
            onMouseEnter={() => focusTier(k, tier.petals)}
            onMouseLeave={clearTier}
            onFocus={() => focusTier(k, tier.petals)}
            onBlur={clearTier}
          >
            <GlassCard highlight={tier.highlight} className="flex h-full flex-col p-6 hover:border-gold/60">
              <p className={`micro ${tier.highlight ? 'text-gold' : 'text-slate-400'}`}>{tier.badge}</p>
              <h3 className="mt-4 text-2xl font-light">{tier.name}</h3>
              <p className="mt-4">
                <span className="headline text-4xl">{tier.setup}</span>
                <span className="micro ml-2 text-slate-400">+ {tier.monthly}</span>
              </p>
              <p className="micro mt-3 flex items-center gap-2 text-[9px] text-slate-500" aria-hidden="true">
                <span className="flex gap-[3px]">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className={`h-2 w-[3px] ${i < tier.petals ? 'bg-gold' : 'bg-white/15'}`} />
                  ))}
                </span>
                {tier.petals}/12 PETALS
              </p>
              <ul className="mt-6 flex-1 space-y-2.5 border-t border-white/10 pt-6 text-sm text-slate-300">
                {tier.features.map((f) => (
                  <li key={f} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 h-px w-3 shrink-0 bg-gold" />
                    {f}
                  </li>
                ))}
              </ul>
              <MagneticButton
                href={links.bookDemo}
                target="_blank"
                rel="noopener"
                variant={tier.highlight ? 'gold' : 'outline'}
                className="mt-8 w-full"
                aria-label={`${tier.cta.replace(' →', '')} with the ${tier.name}`}
              >
                {tier.cta}
              </MagneticButton>
            </GlassCard>
          </li>
        ))}
      </ul>

      <div data-fade className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 text-center md:flex-row md:justify-center md:text-left">
        <p className="text-slate-400">{pricing.note}</p>
        <MagneticButton href={links.bookDemo} target="_blank" rel="noopener" variant="ghost">
          {pricing.noteCta}
        </MagneticButton>
      </div>
    </ShotSection>
  )
}
