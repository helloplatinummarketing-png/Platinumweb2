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
}
