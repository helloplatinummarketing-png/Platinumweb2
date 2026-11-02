import type { FaqItem, PriceLabels, Tier } from './types'

export type FlowFrom = 'event' | 'business' | 'customer'

/** WhatsApp Automations page copy and prices, word for word from BRIEF.md. */
export const automations = {
  meta: {
    title: 'WhatsApp Automations for Kenyan Businesses',
    description: 'Missed calls answered. Leads followed up. Reviews collected. Appointments confirmed. Invoices chased. All through WhatsApp. All automatic.',
  },
  serviceName: 'WhatsApp Automations',
  hero: {
    title: 'Your Business, Running on Autopilot',
    sub: 'Missed calls answered. Leads followed up. Reviews collected. Appointments confirmed. Invoices chased. All through WhatsApp. All automatic.',
    // The phone's opening sequence: a missed call, then auto-reply, booking, review, payment.
    missedCall: 'Missed call',
    bubbles: [
      { label: 'Auto-reply', text: 'Hi, sorry I missed your call. How can I help?' },
      { label: 'Booking', text: 'Appointment confirmed: YES' },
      { label: 'Review', text: '★★★★★ review received' },
      { label: 'Payment', text: 'M-Pesa payment received: KSh 4,500' },
    ],
  },
  problem: [
    'Right now, every missed call is a lost customer. Every slow reply is money walking away. Every forgotten follow-up is a deal you should have closed.',
    'What if your WhatsApp could handle all of that — instantly, 24/7, without you or your staff doing anything?',
  ],
  listTitle: 'What Each Automation Does',
  phoneName: 'Your Business',
  list: [
    {
      title: 'Missed Call WhatsApp-Back',
      body: "Customer calls, you can't answer. Within 30 seconds, they get a personalised WhatsApp message: 'Hi, sorry I missed your call. How can I help?' They reply, you don't lose them.",
      flow: [
        { from: 'event', text: 'Missed call' },
        { from: 'business', text: 'Hi, sorry I missed your call. How can I help?' },
      ],
    },
    {
      title: 'Instant Lead Response',
      body: "Someone enquires through your website, Facebook, or Google. Within 60 seconds, they get a WhatsApp message AND an email. Before they've even finished looking at your competitor.",
      flow: [
        { from: 'event', text: 'Enquiry: website, Facebook, or Google' },
        { from: 'business', text: 'WhatsApp message within 60 seconds' },
        { from: 'event', text: 'Email sent too' },
      ],
    },
    {
      title: 'Review Collection',
      body: 'After every job, your customer gets a friendly WhatsApp asking for a Google review. No awkward conversations. Your reviews grow on autopilot.',
      flow: [
        { from: 'event', text: 'Job finished' },
        { from: 'business', text: 'Friendly WhatsApp asking for a Google review' },
      ],
    },
    {
      title: 'Appointment Reminders',
      body: 'Customer books an appointment. They get a WhatsApp reminder 48 hours before and 2 hours before. They confirm with a simple YES reply. No-shows drop.',
      flow: [
        { from: 'event', text: 'Appointment booked' },
        { from: 'business', text: 'Reminder: 48 hours before' },
        { from: 'business', text: 'Reminder: 2 hours before' },
        { from: 'customer', text: 'YES' },
      ],
    },
    {
      title: 'No-Show Recovery',
      body: "Someone doesn't show up? Within 30 minutes, they get a WhatsApp with a rebooking link. Most rebook on the spot.",
      flow: [
        { from: 'event', text: "Someone doesn't show up" },
        { from: 'business', text: 'Rebooking link, within 30 minutes' },
      ],
    },
    {
      title: 'Quote Follow-Up',
      body: 'You send a quote. On day 3, day 7, and day 14, the customer gets a follow-up WhatsApp — each one different, each one nudging them to say yes. Stops the moment they reply.',
      flow: [
        { from: 'event', text: 'You send a quote' },
        { from: 'business', text: 'Day 3: follow-up' },
        { from: 'business', text: 'Day 7: follow-up' },
        { from: 'business', text: 'Day 14: follow-up' },
        { from: 'event', text: 'Stops the moment they reply' },
      ],
    },
    {
      title: 'Invoice & Payment Chase (with M-Pesa)',
      body: 'Invoice overdue? Day 3: polite WhatsApp reminder. Day 7: firmer follow-up. Day 14: urgent chase. Includes M-Pesa payment link so they can pay right from WhatsApp.',
      flow: [
        { from: 'event', text: 'Invoice overdue' },
        { from: 'business', text: 'Day 3: polite WhatsApp reminder' },
        { from: 'business', text: 'Day 7: firmer follow-up' },
        { from: 'business', text: 'Day 14: urgent chase' },
        { from: 'business', text: 'M-Pesa payment link' },
      ],
    },
  ] as { title: string; body: string; flow: { from: FlowFrom; text: string }[] }[],
  pricingTitle: 'Pricing',
  priceLabels: { setup: 'Setup (one-off)', monthly: 'Monthly' } satisfies PriceLabels,
  tiers: [
    { name: 'Starter', includes: 'Missed Call WhatsApp-Back, Instant Lead Response, Review Collection', setup: 30000, monthly: 15000 },
    { name: 'Growth', includes: 'Everything in Starter + Appointment Reminders, No-Show Recovery, Quote Follow-Up, Repeat Business Follow-Up', setup: 50000, monthly: 25000 },
    { name: 'Full System', includes: 'Everything in Growth + Invoice/Payment Chase with M-Pesa + GEO + Monthly Reporting', setup: 80000, monthly: 40000 },
  ] satisfies Tier[],
  note: 'Tool costs (WhatsApp Business API, automation platform) are approximately KSh 6,000-7,000/month on top — paid by you directly, we set it all up.',
  faqTitle: 'FAQ',
  faq: [
    { q: 'Do I need a special WhatsApp number?', a: 'We set you up with the WhatsApp Business API. You can use your existing business number.' },
    { q: 'Will it sound robotic?', a: "No. Every message is written by AI to sound natural and personal. Customers won't know it's automated." },
    { q: 'What if a customer needs a real person?', a: 'The system hands over to you or your staff the moment a customer needs human help. You see everything in one inbox.' },
    { q: "Can I see what's being sent?", a: 'Yes. Every message is logged. You get a dashboard showing every lead, every reply, every follow-up.' },
  ] satisfies FaqItem[],
  button: 'Get Started',
}
