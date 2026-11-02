import { automations, cta, geo, pricing, websites } from '../content/copy.ts'
import { paths } from '../content/site.ts'
import { FinalCta, PageHero, Section, TierCard } from '../ui/parts.tsx'

const COLUMNS = [
  { title: 'Websites', href: paths.websites, data: websites },
  { title: 'WhatsApp Automations', href: paths.automations, data: automations },
  { title: 'AI Visibility', href: paths.geo, data: geo },
]

export function Pricing() {
  return (
    <>
      <PageHero act="rise" title={pricing.title} sub={pricing.sub} />
      <section className="bg-gold text-navy">
        <p className="wrap py-4 text-center font-semibold">{pricing.bundle}</p>
      </section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-3 lg:gap-5">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="mb-4 text-2xl font-semibold tracking-tight">
                <a href={column.href} className="hover:underline">
                  {column.title}
                </a>
              </h2>
              <ul className="space-y-4">
                {column.data.tiers.map((tier) => (
                  <TierCard key={tier.name} tier={tier} setupLabel={column.data.setupLabel} compact />
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 max-w-3xl space-y-2 text-sm text-muted">
          <p>{websites.note}</p>
          <p>{automations.note}</p>
        </div>
      </Section>
      <FinalCta button={cta.book} title={pricing.finalTitle} body={pricing.finalBody} />
    </>
  )
}
