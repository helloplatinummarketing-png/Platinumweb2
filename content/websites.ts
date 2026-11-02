import type { FaqItem, PriceLabels, Tier } from './types'

/** Websites page copy and prices, word for word from BRIEF.md. */
export const websites = {
  meta: {
    title: 'Websites for Kenyan Businesses',
    description: 'Not just something that looks nice — a website that gets found, captures leads, and pays for itself.',
  },
  serviceName: 'Website Design',
  hero: {
    title: 'A Website That Actually Works For Your Business',
    sub: 'Not just something that looks nice — a website that gets found, captures leads, and pays for itself.',
  },
  includedTitle: 'What You Get',
  included: [
    { icon: 'phone', text: 'Mobile-friendly design (most Kenyans browse on phones)' },
    { icon: 'bolt', text: 'Fast loading (optimised for Kenyan internet speeds)' },
    { icon: 'search', text: 'Google-optimised (shows up when people search)' },
    { icon: 'spark', text: 'AI-optimised (shows up when people ask ChatGPT, Gemini, etc.)' },
    { icon: 'chat', text: 'Contact forms and WhatsApp click-to-chat' },
    { icon: 'pin', text: 'Google Maps integration' },
    { icon: 'camera', text: 'Professional photos and content' },
  ],
  pricingTitle: 'Pricing',
  priceLabels: { setup: 'One-off Price', monthly: 'Monthly Maintenance' } satisfies PriceLabels,
  tiers: [
    { name: 'Starter', includes: '5-page website, mobile-ready, contact form, Google Maps, basic SEO', setup: 80000, monthly: 5000 },
    { name: 'Growth', includes: '8-12 pages, blog, advanced SEO, WhatsApp integration, Google Business Profile setup', setup: 150000, monthly: 10000 },
    { name: 'Premium', includes: '15+ pages, custom design, animations, multilingual (English/Swahili), booking system, M-Pesa integration', setup: 250000, setupFrom: true, monthly: 15000 },
  ] satisfies Tier[],
  note: 'All prices are in Kenyan Shillings. Setup is a one-off payment. Monthly maintenance covers hosting, security updates, content changes, and ongoing support.',
  faqTitle: 'FAQ',
  faq: [
    { q: 'How long does it take to build?', a: 'Starter: 1-2 weeks. Growth: 2-3 weeks. Premium: 3-5 weeks.' },
    { q: 'Do I need to provide content?', a: "We handle everything. We'll ask you some questions about your business and take it from there. If you have photos, great. If not, we'll sort it." },
    { q: 'Can I update it myself?', a: "Yes, we'll show you how. Or we handle it for you on the monthly plan." },
    { q: 'What if I already have a website?', a: "We'll audit it for free and tell you honestly if it needs rebuilding or just optimising." },
  ] satisfies FaqItem[],
  button: 'Get Started',
}
