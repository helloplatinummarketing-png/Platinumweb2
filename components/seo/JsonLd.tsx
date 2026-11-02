import { site } from '@/config/site'

export function JsonLd({ data }: { data: object }) {
  // Escaping "<" stops any copy containing "</script>" from ending the tag early.
  const json = JSON.stringify(data).replace(/</g, '\\u003c')
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />
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
