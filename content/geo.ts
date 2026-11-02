import type { PriceLabels, Tier } from './types'

/** AI Visibility page copy and prices, word for word from BRIEF.md. */
export const geo = {
  meta: {
    title: 'AI Visibility (GEO) for Kenyan Businesses',
    description: "More people are asking ChatGPT, Google AI, and Siri 'Who's the best [business] near me?' We make sure they hear your name.",
  },
  serviceName: 'AI Visibility (GEO)',
  hero: {
    title: 'When Customers Ask AI, Your Business Should Be the Answer',
    sub: "More people are asking ChatGPT, Google AI, and Siri 'Who's the best [business] near me?' We make sure they hear your name.",
  },
  tryIt: {
    prompt: "Try it yourself. Open ChatGPT right now and ask: 'Who is the best [your trade] in [your area]?'",
    consequence: "If your name doesn't come up — but your competitor's does — you're losing customers to AI every single day. And it's only going to get worse.",
    competitorPin: 'Your competitor',
    youPin: 'You',
    afterLabel: 'After GEO',
    mockLabel: 'Illustration, not real search results',
  },
  listTitle: 'What We Do',
  list: [
    { title: 'AI Visibility Audit', body: 'We test your business across every major AI platform — ChatGPT, Google Gemini, Claude, Perplexity, Siri. We find out if AI recommends you, who it recommends instead, and exactly why.' },
    { title: 'Google Business Profile Optimisation', body: 'Your Google Business Profile is the #1 thing AI looks at. We complete every field, write a proper description, add photos, and make it easy for AI to read.' },
    { title: 'Directory Listings', body: 'We list your business on every relevant online directory — with your name, address, and phone number exactly the same everywhere. Consistency = AI trusts you.' },
    { title: 'Review Generation', body: 'AI heavily favours businesses with lots of recent, positive reviews. Our WhatsApp automation system collects Google reviews from your customers on autopilot.' },
    { title: 'Website AI Optimisation', body: 'We add FAQ pages to your website that match exactly how people ask AI questions. We add invisible code (schema markup) that helps AI read your site like a menu.' },
    { title: 'Monthly Monitoring & Reporting', body: "Every month, we re-test your AI visibility. You get a simple report: your score, which AI platforms recommend you, how many new reviews you got, and what we're working on next." },
  ],
  pricingTitle: 'Pricing',
  priceLabels: { setup: 'Setup (one-off)', monthly: 'Monthly' } satisfies PriceLabels,
  tiers: [
    { name: 'AI Starter', includes: 'AI Audit + Google Business Profile Optimisation + 10 Directory Listings + Monthly Monitoring', setup: 25000, monthly: 10000 },
    { name: 'AI Growth', includes: 'Everything in Starter + Full Directory Blitz + Automated Review Collection + FAQ Pages', setup: 40000, monthly: 18000 },
    { name: 'AI Full System', includes: 'Everything in Growth + Schema Markup + Full Website AI Optimisation + Competitor Tracking', setup: 60000, monthly: 28000 },
  ] satisfies Tier[],
  button: 'Get Your Free AI Visibility Check',
}
