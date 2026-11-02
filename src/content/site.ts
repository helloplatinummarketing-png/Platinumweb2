/**
 * Business details and integrations. Anything set to null is still waiting on
 * Victor: the site shows a clear fallback until the real value is added here.
 */
export const site = {
  name: 'Platinum Marketing Agency',
  /** .co.ke or .com still to be confirmed. Drives canonical URLs, schema and the sitemap. */
  url: 'https://platinummarketingagency.co.ke',
  tagline: 'More Customers. Less Stress. All Automated.',
  location: 'Nairobi, Kenya',
  email: 'helloplatinummarketing@gmail.com',
  /** Kenya number for display, e.g. '0712 345 678'. */
  phone: null as string | null,
  /** Kenya number for tel: links and schema, e.g. '+254712345678'. */
  phoneE164: null as string | null,
  /** WhatsApp Business number, digits only with country code, e.g. '254712345678'. */
  whatsapp: null as string | null,
  /** Calendly (or similar) scheduling URL, embedded on the contact page. */
  bookingUrl: null as string | null,
  /** Where the contact form posts (Google Apps Script, form service, etc). Falls back to opening an email. */
  formEndpoint: null as string | null,
  /** Google Analytics ID, e.g. 'G-XXXXXXX'. Only loads after a visitor accepts the cookie banner. */
  gaId: null as string | null,
  mapEmbed: 'https://www.google.com/maps?q=Nairobi,Kenya&output=embed',
}

export const paths = {
  home: '/',
  websites: '/websites',
  automations: '/whatsapp-automations',
  geo: '/ai-visibility',
  about: '/about',
  contact: '/contact',
  pricing: '/pricing',
}
