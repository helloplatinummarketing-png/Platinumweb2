/** Contact page copy. The headline, options and location are word for word from BRIEF.md. */
export const needOptions = ['Website', 'WhatsApp Automations', 'AI Visibility', 'All of the above', 'Not sure'] as const

export const contact = {
  meta: {
    title: 'Book a Free AI Visibility Check',
    description: "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing. No charge, no commitment.",
  },
  title: "Let's Talk About Your Business",
  sub: "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing. No charge, no commitment.",
  bookingTitle: 'Book a Time',
  bookingFrameTitle: 'Booking calendar',
  // TODO(Victor): shown until calendlyUrl is set in config/site.ts.
  bookingPlaceholder: 'Booking calendar placeholder. The Calendly link is still to be added.',
  formTitle: 'Send Us Your Details',
  form: {
    name: 'Name',
    business: 'Business Name',
    phone: 'Phone',
    email: 'Email',
    need: 'What do you need help with?',
    needPrompt: 'Choose one',
    submit: 'Send',
    sending: 'Sending…',
    sent: "Thanks. We've got your details and will be in touch soon.",
    failed: 'That did not send. Please try again, or message us on WhatsApp.',
    fixFields: 'Please check the highlighted fields.',
  },
  directTitle: 'Or Reach Us Directly',
  whatsapp: 'Chat on WhatsApp',
  remote: 'No physical office needed — we work remotely.',
  mapTitle: 'Map of Nairobi, Kenya',
}
