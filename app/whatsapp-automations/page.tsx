import type { Metadata } from 'next'
import { routes } from '@/config/site'
import { automations } from '@/content/automations'
import { closingCta } from '@/content/types'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'
import { PricingCards } from '@/components/sections/PricingCards'
import { AutomationSequence } from '@/components/services/AutomationSequence'
import { PhoneHero } from '@/components/services/Heroes'
import { faqSchema, JsonLd, serviceSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: automations.meta.title,
  description: automations.meta.description,
  alternates: { canonical: routes.automations },
  openGraph: { title: automations.meta.title, description: automations.meta.description, url: routes.automations, images: ['/opengraph-image'] },
}

export default function AutomationsPage() {
  return (
    <>
      <JsonLd data={serviceSchema(automations.serviceName, automations.meta.description, routes.automations, automations.tiers)} />
      <JsonLd data={faqSchema(automations.faq)} />
      <PageHero title={automations.hero.title} sub={automations.hero.sub} button={automations.button}>
        <PhoneHero />
      </PageHero>
      <section className="relative py-20 sm:py-28">
        <div className="wrap max-w-5xl space-y-6">
          <p className="section-heading text-metal">{automations.problem[0]}</p>
          <p className="max-w-3xl text-xl text-platinum sm:text-2xl">{automations.problem[1]}</p>
        </div>
      </section>
      <AutomationSequence />
      <PricingCards title={automations.pricingTitle} tiers={automations.tiers} labels={automations.priceLabels} note={automations.note} />
      <Faq title={automations.faqTitle} items={automations.faq} />
      <FinalCta {...closingCta} button={automations.button} />
    </>
  )
}
