import type { Metadata } from 'next'
import { routes } from '@/config/site'
import { geo } from '@/content/geo'
import { closingCta } from '@/content/types'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'
import { PricingCards } from '@/components/sections/PricingCards'
import { OrbHero } from '@/components/services/Heroes'
import { TryItMap } from '@/components/services/TryItMap'
import { JsonLd, serviceSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: geo.meta.title,
  description: geo.meta.description,
  alternates: { canonical: routes.geo },
  openGraph: { title: geo.meta.title, description: geo.meta.description, url: routes.geo },
}

export default function AiVisibilityPage() {
  return (
    <>
      <JsonLd data={serviceSchema(geo.serviceName, geo.meta.description, routes.geo, geo.tiers)} />
      <PageHero title={geo.hero.title} sub={geo.hero.sub} button={geo.button}>
        <OrbHero />
      </PageHero>
      <TryItMap />
      <section className="relative py-20 sm:py-28">
        <div className="wrap">
          <h2 className="section-heading text-metal">{geo.listTitle}</h2>
          <ol className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-2 lg:grid-cols-3">
            {geo.list.map((item, i) => (
              <li key={item.title} className="panel">
                <span className="font-display text-4xl font-medium text-accent">{i + 1}</span>
                <h3 className="mt-3 font-display text-xl font-medium">{item.title}</h3>
                <p className="mt-2 text-silver">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <PricingCards title={geo.pricingTitle} tiers={geo.tiers} labels={geo.priceLabels} />
      <FinalCta {...closingCta} button={geo.button} />
    </>
  )
}
