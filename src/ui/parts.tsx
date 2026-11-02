import type { ReactNode } from 'react'
import { cta, type FaqItem, type Tier } from '../content/copy.ts'
import { paths } from '../content/site.ts'
import { Icon } from './Icon.tsx'

export function formatKsh(amount: number) {
  return `KSh ${amount.toLocaleString('en-KE')}`
}

export function Button({
  href,
  children,
  variant = 'primary',
}: {
  href: string
  children: ReactNode
  variant?: 'primary' | 'ghost' | 'outline'
}) {
  return (
    <a href={href} className={`btn btn-${variant}`}>
      {children}
    </a>
  )
}

export function Section({
  title,
  children,
  id,
  tone = 'plain',
}: {
  title?: string
  children: ReactNode
  id?: string
  tone?: 'plain' | 'tint'
}) {
  return (
    <section id={id} className={tone === 'tint' ? 'bg-tint/90' : undefined}>
      <div className="wrap py-14 sm:py-20">
        {title && <h2 className="section-title mb-8 sm:mb-10">{title}</h2>}
        {children}
      </div>
    </section>
  )
}

export function PageHero({ title, sub, act, children }: { title: string; sub?: string; act: string; children?: ReactNode }) {
  return (
    <section data-act={act} className="page-hero">
      <div className="wrap py-14 sm:py-20">
        <h1 className="display max-w-4xl">{title}</h1>
        {sub && <p className="mt-5 max-w-2xl text-lg text-ink">{sub}</p>}
        {children}
      </div>
    </section>
  )
}

export function FinalCta({
  button,
  title = cta.finalTitle,
  body = cta.finalBody,
  tall,
}: {
  button: string
  title?: string
  body?: string
  tall?: boolean
}) {
  return (
    <section className={tall ? "beat" : "bg-tint/90"}>
      <div className="wrap reveal py-14 text-center sm:py-20">
        <h2 className={`${tall ? "statement" : "section-title"} mx-auto max-w-2xl`}>{title}</h2>
        <p className="lede mx-auto mt-4 max-w-xl">{body}</p>
        <div className="mt-8">
          <Button href={paths.contact}>{button}</Button>
        </div>
      </div>
    </section>
  )
}

export function TierCard({ tier, setupLabel, compact }: { tier: Tier; setupLabel: string; compact?: boolean }) {
  return (
    <li className={`card flex flex-col ${compact ? 'gap-3' : 'gap-5'}`}>
      <h3 className="text-xl font-semibold">{tier.name}</h3>
      <div>
        <p className="text-2xl font-semibold tracking-tight">
          {formatKsh(tier.setup)}
          {tier.setupFrom && '+'}
        </p>
        <p className="text-sm text-muted">{setupLabel}</p>
      </div>
      <p className="text-sm">
        <span className="font-semibold">{formatKsh(tier.monthly)}/month</span>
      </p>
      <p className="border-t border-line pt-4 text-sm leading-relaxed text-muted">{tier.includes}</p>
    </li>
  )
}

export function TierGrid({ tiers, setupLabel, note }: { tiers: Tier[]; setupLabel: string; note?: string }) {
  return (
    <>
      <ul className="grid gap-5 md:grid-cols-3">
        {tiers.map((tier) => (
          <TierCard key={tier.name} tier={tier} setupLabel={setupLabel} />
        ))}
      </ul>
      {note && <p className="mt-6 max-w-3xl text-sm text-muted">{note}</p>}
    </>
  )
}

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="max-w-3xl divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group py-2">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold">
            {item.q}
            <Icon name="plus" className="size-5 shrink-0 text-gold-soft transition-transform group-open:rotate-45" />
          </summary>
          <p className="mt-1 pb-2 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  )
}

/** Numbered feature list, used by the automation and AI visibility pages. */
export function NumberedList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-5 md:grid-cols-2">
      {items.map((item, i) => (
        <li key={item.title} className="card flex gap-4">
          <span className="step-number">{i + 1}</span>
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

export function Callout({ lines }: { lines: string[] }) {
  return (
    <div className="max-w-3xl space-y-4 border-l-4 border-gold pl-5 text-lg sm:pl-6">
      {lines.map((line) => (
        <p key={line}>{line}</p>
      ))}
    </div>
  )
}
