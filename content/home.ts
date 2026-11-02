import { routes } from '@/config/site'

/** Home page copy, word for word from BRIEF.md unless marked as a placeholder. */
export const home = {
  meta: {
    title: 'Websites, WhatsApp Automation & AI Visibility in Kenya',
    description:
      'We build websites, automate your WhatsApp, and make sure AI recommends you — so customers find you first.',
  },
  hero: {
    title: 'Your Business Deserves More Customers',
    sub: 'We build websites, automate your WhatsApp, and make sure AI recommends you — so customers find you first.',
    primary: 'Get a Free AI Visibility Check',
    secondary: 'See Our Services',
  },
  // TODO(Victor): replace with the real Google rating, then set placeholder to false.
  trustBadge: { text: '★ 5.0 · Google Reviews', placeholder: true, placeholderLabel: 'Placeholder' },
  dashboard: {
    title: 'Live activity',
    exampleLabel: 'Example dashboard, not real client data',
    liveLabel: 'Live',
    feed: [
      'Missed call → WhatsApp reply sent in 28s',
      'New lead from Google → replied in 41s',
      '★★★★★ review received',
      'Appointment confirmed: YES',
      'M-Pesa payment received: KSh 4,500',
    ],
    // TODO(Victor): illustrative numbers for the example dashboard only. Not client results.
    kpis: [
      { label: 'Leads', value: 128 },
      { label: 'Replies', value: 342 },
      { label: 'Reviews', value: 57 },
      { label: 'Bookings', value: 86 },
    ],
  },
  problem: {
    title: "Your Competitors Are Getting the Customers You're Missing",
    points: [
      {
        icon: 'signal',
        title: "Customers can't find you online",
        body: "No website, or a website that doesn't show up anywhere",
      },
      {
        icon: 'phone',
        title: "You're missing calls and enquiries",
        body: 'Leads come in, nobody responds fast enough, they go to someone else',
      },
      {
        icon: 'eye',
        title: "AI doesn't know you exist",
        body: "When customers ask ChatGPT or Google AI for recommendations, your name doesn't come up",
      },
    ],
  },
  services: {
    // The brief gives this section no heading. This one comes from the "See Our Services" button.
    title: 'Our Services',
    more: 'Learn More',
    cards: [
      {
        kind: 'browser',
        label: 'Websites',
        title: 'Professional websites that actually bring you customers',
        body: 'We build fast, mobile-friendly websites designed to show up on Google and AI search. Not just a digital business card — a lead-generating machine.',
        href: routes.websites,
      },
      {
        kind: 'chat',
        label: 'WhatsApp Automations',
        title: 'Never miss a customer again',
        body: 'Automated WhatsApp replies to missed calls, instant responses to enquiries, appointment reminders, review collection, quote follow-ups, and payment chasing — all running 24/7 without you lifting a finger.',
        href: routes.automations,
      },
      {
        kind: 'orb',
        label: 'AI Visibility (GEO)',
        title: 'Get recommended by AI',
        body: "When customers ask ChatGPT, Google AI, or Siri 'Who's the best [your trade] in [your area]?' — we make sure your business is the answer.",
        href: routes.geo,
      },
    ],
  },
  how: {
    title: 'How It Works',
    steps: [
      {
        title: 'We audit your business',
        body: 'Free AI visibility check. We test how your business shows up across AI platforms and online.',
      },
      {
        title: 'We build your systems',
        body: 'Website, automations, AI visibility — whatever you need, we set it up and get it running.',
      },
      {
        title: 'You get more customers',
        body: 'Leads come in automatically. Enquiries get answered instantly. You focus on doing your work.',
      },
    ],
  },
  testimonials: {
    title: 'What Our Clients Say',
    placeholder: 'Placeholder',
    // TODO(Victor): replace with real client feedback, then delete the placeholder tag in Testimonials.tsx.
    items: [
      { quote: 'Client testimonial goes here.', name: 'Client name', business: 'Business, Area' },
      { quote: 'Client testimonial goes here.', name: 'Client name', business: 'Business, Area' },
      { quote: 'Client testimonial goes here.', name: 'Client name', business: 'Business, Area' },
    ],
  },
  finalCta: {
    title: 'Ready to Get More Customers?',
    body: "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing.",
    button: 'Book Your Free Check',
  },
}
