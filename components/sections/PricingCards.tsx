import type { PriceLabels, Tier } from '@/content/types'

export function formatKsh(amount: number) {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

export function PriceCard({ tier, labels, highlight }: { tier: Tier; labels: PriceLabels; highlight?: boolean }) {
  return (
    <li className={`panel flex flex-col ${highlight ? 'border-accent! shadow-[0_0_60px_rgb(43_214_123/0.14)] md:-my-3 md:py-10' : ''}`}>
      <h3 className="font-display text-2xl font-medium">{tier.name}</h3>
      <dl className="mt-5 space-y-4">
        <div>
          <dt className="text-sm text-silver">{labels.setup}</dt>
          <dd className={`mt-0.5 font-display text-3xl leading-tight font-medium tracking-tight ${highlight ? 'text-accent' : ''}`}>
            {formatKsh(tier.setup)}
            {tier.setupFrom && '+'}
          </dd>
        </div>
        <div>
          <dt className="text-sm text-silver">{labels.monthly}</dt>
          <dd className="mt-0.5 text-lg font-semibold">{formatKsh(tier.monthly)}/month</dd>
        </div>
      </dl>
      <p className="mt-5 border-t border-border-strong pt-5 text-silver">{tier.includes}</p>
    </li>
  )
}

interface PricingCardsProps {
  title: string
  tiers: Tier[]
  labels: PriceLabels
  note?: string
}

/** Three cards with the middle tier highlighted. */
export function PricingCards({ title, tiers, labels, note }: PricingCardsProps) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="wrap">
        <h2 className="section-heading text-metal">{title}</h2>
        <ul className="mt-10 grid items-stretch gap-5 md:grid-cols-3 sm:mt-14">
          {tiers.map((tier, i) => (
            <PriceCard key={tier.name} tier={tier} labels={labels} highlight={i === 1} />
          ))}
        </ul>
        {note && <p className="mt-8 max-w-3xl text-sm text-silver">{note}</p>}
      </div>
    </section>
  )
}
