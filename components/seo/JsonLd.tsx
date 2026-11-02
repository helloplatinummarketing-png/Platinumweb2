import { site } from '@/config/site'
import type { FaqItem, Tier } from '@/content/types'

export function JsonLd({ data }: { data: object }) {
  // Escaping "<" stops any copy containing "</script>" from ending the tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
}

export function serviceSchema(name: string, description: string, path: string, tiers: Tier[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${site.url}${path}`,
    provider: { '@id': `${site.url}/#business` },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    offers: tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.includes,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'KES',
        [tier.setupFrom ? 'minPrice' : 'price']: tier.setup,
      },
    })),
  }
}

export function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${site.url}/#business`,
    name: site.name,
    description: site.description,
    url: site.url,
    email: site.email,
    ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
    address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
    geo: { '@type': 'GeoCoordinates', latitude: site.coordinates.lat, longitude: site.coordinates.lon },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    currenciesAccepted: 'KES',
  }
}
