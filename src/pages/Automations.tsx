import { automations } from '../content/copy.ts'
import { Callout, Faq, FinalCta, NumberedList, PageHero, Section, TierGrid } from '../ui/parts.tsx'

export function Automations() {
  return (
    <>
      <PageHero act="whatsapp" title={automations.hero.title} sub={automations.hero.sub} />
      <Section>
        <Callout lines={automations.problem} />
      </Section>
      <Section title={automations.listTitle} tone="tint">
        <NumberedList items={automations.list} />
      </Section>
      <Section title={automations.pricingTitle}>
        <TierGrid tiers={automations.tiers} setupLabel={automations.setupLabel} note={automations.note} />
      </Section>
      <Section title="Common Questions" tone="tint">
        <Faq items={automations.faq} />
      </Section>
      <FinalCta button={automations.finalButton} />
    </>
  )
}
