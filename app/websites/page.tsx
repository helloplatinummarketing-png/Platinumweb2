import type { Metadata } from 'next'
import { routes } from '@/config/site'
import { websites } from '@/content/websites'
import { closingCta } from '@/content/types'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { PageHero } from '@/components/sections/PageHero'
import { PricingCards } from '@/components/sections/PricingCards'
import { DevicePairHero } from '@/components/services/Heroes'
import { faqSchema, JsonLd, serviceSchema } from '@/components/seo/JsonLd'

export const metadata: Metadata = {
  title: websites.meta.title,
  description: websites.meta.description,
  alternates: { canonical: routes.websites },
  openGraph: { title: websites.meta.title, description: websites.meta.description, url: routes.websites },
}

const ICONS: Record<string, string> = {
  phone: 'M8 3h8a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zM11 18h2',
  bolt: 'M13 3 5 14h6l-1 7 8-11h-6z',
  search: 'M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM16.5 16.5 21 21',
  spark: 'M12 3l1.9 5.6a2 2 0 0 0 1.3 1.3L21 12l-5.8 2.1a2 2 0 0 0-1.3 1.3L12 21l-1.9-5.6a2 2 0 0 0-1.3-1.3L3 12l5.8-2.1a2 2 0 0 0 1.3-1.3z',
  chat: 'M4 5h16v11H9l-5 4zM8 10.5h.01M12 10.5h.01M16 10.5h.01',
  pin: 'M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21zM12 7.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  camera: 'M4 8h4l2-3h4l2 3h4v11H4zM12 10a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z',
}

export default function WebsitesPage() {
  return (
    <>
      <JsonLd data={serviceSchema(websites.serviceName, websites.meta.description, routes.websites, websites.tiers)} />
      <JsonLd data={faqSchema(websites.faq)} />
      <PageHero title={websites.hero.title} sub={websites.hero.sub} button={websites.button}>
        <DevicePairHero />
      </PageHero>
      <section className="relative py-20 sm:py-28">
        <div className="wrap">
          <h2 className="section-heading text-metal">{websites.includedTitle}</h2>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {websites.included.map((item) => (
              <li key={item.text} className="panel flex items-start gap-4">
                <svg viewBox="0 0 24 24" className="size-7 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d={ICONS[item.icon]} />
                </svg>
                {item.text}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <PricingCards title={websites.pricingTitle} tiers={websites.tiers} labels={websites.priceLabels} note={websites.note} />
      <Faq title={websites.faqTitle} items={websites.faq} />
      <FinalCta {...closingCta} button={websites.button} />
    </>
  )
}
