import { websites } from '../content/copy.ts'
import { Icon } from '../ui/Icon.tsx'
import { Faq, FinalCta, PageHero, Section, TierGrid } from '../ui/parts.tsx'

export function Websites() {
  return (
    <>
      <PageHero act="websites" title={websites.hero.title} sub={websites.hero.sub} />
      <Section title={websites.includedTitle}>
        <ul className="grid gap-4 md:grid-cols-2">
          {websites.included.map((item) => (
            <li key={item} className="flex gap-3">
              <Icon name="check" className="mt-0.5 size-5 shrink-0 text-gold-soft" />
              {item}
            </li>
          ))}
        </ul>
      </Section>
      <Section title={websites.pricingTitle} tone="tint">
        <TierGrid tiers={websites.tiers} setupLabel={websites.setupLabel} note={websites.note} />
      </Section>
      <Section title="Common Questions">
        <Faq items={websites.faq} />
      </Section>
      <FinalCta button={websites.finalButton} />
    </>
  )
}
