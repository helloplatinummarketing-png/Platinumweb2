import { geo } from '../content/copy.ts'
import { Callout, FinalCta, NumberedList, PageHero, Section, TierGrid } from '../ui/parts.tsx'

export function Geo() {
  return (
    <>
      <PageHero act="ai" title={geo.hero.title} sub={geo.hero.sub} />
      <Section>
        <Callout lines={geo.problem} />
      </Section>
      <Section title={geo.listTitle} tone="tint">
        <NumberedList items={geo.list} />
      </Section>
      <Section title={geo.pricingTitle}>
        <TierGrid tiers={geo.tiers} setupLabel={geo.setupLabel} />
      </Section>
      <FinalCta button={geo.finalButton} />
    </>
  )
}
