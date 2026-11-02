export interface Tier {
  name: string
  includes: string
  setup: number
  /** True when the setup price is a starting price, e.g. KSh 250,000+. */
  setupFrom?: boolean
  monthly: number
}

export interface PriceLabels {
  setup: string
  monthly: string
}

export interface FaqItem {
  q: string
  a: string
}

/** Shared closing copy for the service pages, from the home page CTA in BRIEF.md. */
export const closingCta = {
  title: 'Ready to Get More Customers?',
  body: "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing.",
}
