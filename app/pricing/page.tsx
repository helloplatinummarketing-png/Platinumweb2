import type { Metadata } from 'next'
import Link from 'next/link'
import { routes } from '@/config/site'
import { automations } from '@/content/automations'
import { geo } from '@/content/geo'
import { pricing } from '@/content/pricing'
import { websites } from '@/content/websites'
import { ParticleBackdrop } from '@/components/sections/Backdrops'
import { FinalCta } from '@/components/sections/FinalCta'
import { PriceCard } from '@/components/sections/PricingCards'

export const metadata: Metadata = {
  title: { absolute: `${pricing.meta.title} | Platinum Marketing Agency` },
  description: pricing.meta.description,
  alternates: { canonical: routes.pricing },
  openGraph: { title: pricing.meta.title, description: pricing.meta.description, url: routes.pricing, images: ['/opengraph-image'] },
}

const COLUMNS = [
  { title: pricing.columns.websites, href: routes.websites, data: websites },
  { title: pricing.columns.automations, href: routes.automations, data: automations },
  { title: pricing.columns.geo, href: routes.geo, data: geo },
]

export default function PricingPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
        <ParticleBackdrop count={900} opacity={0.32} />
        <div className="wrap relative">
          <h1 className="display-hero text-metal max-w-5xl">{pricing.title}</h1>
          <p className="mt-6 text-lg sm:text-xl">{pricing.sub}</p>
        </div>
      </section>

      <section className="relative z-10 bg-accent text-bg">
        <p className="wrap py-4 text-center font-semibold">{pricing.bundle}</p>
      </section>

      <section className="relative py-16 sm:py-24">
        <div className="wrap grid gap-12 lg:grid-cols-3 lg:gap-5">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h2 className="font-display text-3xl font-medium tracking-tight">
                <Link href={column.href} className="hover:text-accent">
                  {column.title}
                </Link>
              </h2>
              <ul className="mt-6 space-y-5">
                {column.data.tiers.map((tier) => (
                  <PriceCard key={tier.name} tier={tier} labels={column.data.priceLabels} />
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="wrap mt-10 max-w-3xl space-y-2 text-sm text-silver lg:mx-0 lg:ml-[max(0px,calc((100vw-82rem)/2))]">
          <p>{websites.note}</p>
          <p>{automations.note}</p>
        </div>
      </section>

      <FinalCta title={pricing.finalTitle} body={pricing.finalBody} button={pricing.button} />
    </>
  )
}
