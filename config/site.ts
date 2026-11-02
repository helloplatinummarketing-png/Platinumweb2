/** Business details and integrations. Victor can edit everything here without touching components. */
export const site = {
  name: 'Platinum Marketing Agency',
  tagline: 'More Customers. Less Stress. All Automated.',
  description:
    'We help Kenyan businesses get found online, capture every lead, and never miss a customer — using websites, WhatsApp automation, and AI visibility.',
  // TODO(Victor): confirm the domain, .co.ke or .com.
  url: 'https://platinummarketingagency.co.ke',
  location: 'Nairobi, Kenya',
  coordinates: { lat: -1.2864, lon: 36.8172 },
  // TODO(Victor): confirm this is the right public email address.
  email: 'helloplatinummarketing@gmail.com',
  // TODO(Victor): add the Kenya phone number. Display text, then international format for links.
  phoneDisplay: '+254 7XX XXX XXX',
  phoneE164: '',
  // TODO(Victor): add the WhatsApp Business number, digits only, e.g. 2547XXXXXXXX. Left invalid on purpose so nobody's real number gets messaged.
  whatsappNumber: '254XXXXXXXXX',
  // TODO(Victor): confirm the prefilled WhatsApp message.
  whatsappMessage: "Hi Platinum, I'd like a free AI Visibility Check for my business.",
  // TODO(Victor): add the Calendly (or similar) URL.
  calendlyUrl: '',
  mapEmbedUrl: 'https://www.google.com/maps?q=Nairobi,Kenya&output=embed',
  // TODO(Victor): add a GA4 ID (G-XXXXXXX) if wanted. The cookie banner only appears when one is set.
  ga4Id: '',
}

export const routes = {
  home: '/',
  websites: '/websites',
  automations: '/whatsapp-automations',
  geo: '/ai-visibility',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
} as const

export function whatsappHref() {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(site.whatsappMessage)}`
}
