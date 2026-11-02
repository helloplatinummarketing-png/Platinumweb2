/**
 * ALL site copy lives here, taken from the Kenya website brief (1 Nov 2026).
 * Edit text freely; the pages read from it. Business details are in `site.ts`.
 */
import type { IconName } from '../ui/Icon.tsx'

export interface Tier {
  name: string
  includes: string
  setup: number
  /** True when the setup price is a starting price, e.g. KSh 250,000+. */
  setupFrom?: boolean
  monthly: number
}

export interface FaqItem {
  q: string
  a: string
}

export const cta = {
  book: 'Book a Free Call',
  check: 'Get Your Free AI Check',
  finalTitle: 'Ready to Get More Customers?',
  finalBody:
    "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing.",
}

export const home = {
  meta: {
    title: 'Websites, WhatsApp Automation & AI Visibility in Kenya | Platinum Marketing Agency',
    description:
      'We build websites, automate your WhatsApp, and make sure AI recommends you — so customers find you first. Book a free AI Visibility Check.',
  },
  hero: {
    title: 'Your Business Deserves More Customers',
    sub: 'We build websites, automate your WhatsApp, and make sure AI recommends you — so customers find you first.',
    primary: 'Get a Free AI Visibility Check',
    secondary: 'See Our Services',
  },
  problem: {
    title: "Your Competitors Are Getting the Customers You're Missing",
    points: [
      {
        icon: 'search',
        title: "Customers can't find you online",
        body: "No website, or a website that doesn't show up anywhere.",
      },
      {
        icon: 'phone',
        title: "You're missing calls and enquiries",
        body: 'Leads come in, nobody responds fast enough, they go to someone else.',
      },
      {
        icon: 'spark',
        title: "AI doesn't know you exist",
        body: "When customers ask ChatGPT or Google AI for recommendations, your name doesn't come up.",
      },
    ] satisfies { icon: IconName; title: string; body: string }[],
  },
  services: {
    title: 'What We Do',
    cards: [
      {
        icon: 'monitor',
        label: 'Websites',
        title: 'Professional websites that actually bring you customers',
        body: 'We build fast, mobile-friendly websites designed to show up on Google and AI search. Not just a digital business card — a lead-generating machine.',
        href: 'websites',
      },
      {
        icon: 'whatsapp',
        label: 'WhatsApp Automations',
        title: 'Never miss a customer again',
        body: 'Automated WhatsApp replies to missed calls, instant responses to enquiries, appointment reminders, review collection, quote follow-ups, and payment chasing — all running 24/7 without you lifting a finger.',
        href: 'automations',
      },
      {
        icon: 'spark',
        label: 'AI Visibility (GEO)',
        title: 'Get recommended by AI',
        body: "When customers ask ChatGPT, Google AI, or Siri 'Who's the best [your trade] in [your area]?' — we make sure your business is the answer.",
        href: 'geo',
      },
    ] as const,
    more: 'Learn More',
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
  proof: {
    title: 'What Our Clients Say',
    // PLACEHOLDER: replace with real client feedback and numbers.
    testimonials: [
      { quote: 'Client testimonial goes here.', name: 'Client name', business: 'Business, Area' },
      { quote: 'Client testimonial goes here.', name: 'Client name', business: 'Business, Area' },
      { quote: 'Client testimonial goes here.', name: 'Client name', business: 'Business, Area' },
    ],
    stats: [
      { value: 'X', label: 'Businesses Served' },
      { value: 'X', label: 'Leads Captured' },
      { value: 'X', label: 'Google Reviews Generated' },
    ],
  },
  finalButton: 'Book Your Free Check',
  /** The scroll journey. Lines and facts all come from the service pages in the brief. */
  railTitle: 'Our Services',
  scroll: 'Scroll to explore',
  modules: [
    {
      act: 'websites',
      card: 'websites',
      tag: 'Module 01',
      align: 'center',
      lines: ['Not just something that looks nice.', 'A website that gets found, captures leads, and pays for itself.'],
      facts: [
        { label: 'Starter website', value: 'KSh 80,000' },
        { label: 'Build time from', value: '1-2 weeks' },
        { label: 'Maintenance from', value: 'KSh 5,000/mo' },
      ],
    },
    {
      act: 'whatsapp',
      card: 'automations',
      tag: 'Module 02',
      align: 'side',
      lines: ["Customer calls, you can't answer.", 'Within 30 seconds, they get a personalised WhatsApp message.', "They reply, you don't lose them."],
      facts: [
        { label: 'Missed call reply', value: '30 sec' },
        { label: 'New lead reply', value: '60 sec' },
        { label: 'Running', value: '24/7' },
      ],
    },
    {
      act: 'ai',
      card: 'geo',
      tag: 'Module 03',
      align: 'center',
      lines: ["'Who's the best [your trade] in [your area]?'", "If your name doesn't come up, you're losing customers to AI.", 'We make sure they hear your name.'],
      facts: [
        { label: 'AI platforms tested', value: '5' },
        { label: 'Re-tested', value: 'Monthly' },
        { label: 'AI Starter setup', value: 'KSh 25,000' },
      ],
    },
  ] as const,
}

export const websites = {
  meta: {
    title: 'Website Design for Kenyan Businesses | From KSh 80,000 | Platinum',
    description:
      'Fast, mobile-friendly websites that get found on Google and AI search, capture leads, and pay for themselves. Packages from KSh 80,000.',
  },
  serviceName: 'Website Design',
  hero: {
    title: 'A Website That Actually Works For Your Business',
    sub: 'Not just something that looks nice — a website that gets found, captures leads, and pays for itself.',
  },
  includedTitle: 'What You Get',
  included: [
    'Mobile-friendly design (most Kenyans browse on phones)',
    'Fast loading (optimised for Kenyan internet speeds)',
    'Google-optimised (shows up when people search)',
    'AI-optimised (shows up when people ask ChatGPT, Gemini, etc.)',
    'Contact forms and WhatsApp click-to-chat',
    'Google Maps integration',
    'Professional photos and content',
  ],
  pricingTitle: 'Website Packages',
  setupLabel: 'One-off price',
  tiers: [
    {
      name: 'Starter',
      includes: '5-page website, mobile-ready, contact form, Google Maps, basic SEO',
      setup: 80000,
      monthly: 5000,
    },
    {
      name: 'Growth',
      includes: '8-12 pages, blog, advanced SEO, WhatsApp integration, Google Business Profile setup',
      setup: 150000,
      monthly: 10000,
    },
    {
      name: 'Premium',
      includes: '15+ pages, custom design, animations, multilingual (English/Swahili), booking system, M-Pesa integration',
      setup: 250000,
      setupFrom: true,
      monthly: 15000,
    },
  ] satisfies Tier[],
  note: 'All prices are in Kenyan Shillings. Setup is a one-off payment. Monthly maintenance covers hosting, security updates, content changes, and ongoing support.',
  faq: [
    {
      q: 'How long does it take to build?',
      a: 'Starter: 1-2 weeks. Growth: 2-3 weeks. Premium: 3-5 weeks.',
    },
    {
      q: 'Do I need to provide content?',
      a: "We handle everything. We'll ask you some questions about your business and take it from there. If you have photos, great. If not, we'll sort it.",
    },
    {
      q: 'Can I update it myself?',
      a: "Yes, we'll show you how. Or we handle it for you on the monthly plan.",
    },
    {
      q: 'What if I already have a website?',
      a: "We'll audit it for free and tell you honestly if it needs rebuilding or just optimising.",
    },
  ] satisfies FaqItem[],
  finalButton: 'Get Started',
}

export const automations = {
  meta: {
    title: 'WhatsApp Automation for Kenyan Businesses | Platinum Marketing Agency',
    description:
      'Missed calls answered, leads followed up, reviews collected, appointments confirmed and invoices chased with M-Pesa. All through WhatsApp. All automatic.',
  },
  serviceName: 'WhatsApp Automation',
  hero: {
    title: 'Your Business, Running on Autopilot',
    sub: 'Missed calls answered. Leads followed up. Reviews collected. Appointments confirmed. Invoices chased. All through WhatsApp. All automatic.',
  },
  problem: [
    'Right now, every missed call is a lost customer. Every slow reply is money walking away. Every forgotten follow-up is a deal you should have closed.',
    'What if your WhatsApp could handle all of that — instantly, 24/7, without you or your staff doing anything?',
  ],
  listTitle: 'What Each Automation Does',
  list: [
    {
      title: 'Missed Call WhatsApp-Back',
      body: "Customer calls, you can't answer. Within 30 seconds, they get a personalised WhatsApp message: 'Hi, sorry I missed your call. How can I help?' They reply, you don't lose them.",
    },
    {
      title: 'Instant Lead Response',
      body: "Someone enquires through your website, Facebook, or Google. Within 60 seconds, they get a WhatsApp message AND an email. Before they've even finished looking at your competitor.",
    },
    {
      title: 'Review Collection',
      body: 'After every job, your customer gets a friendly WhatsApp asking for a Google review. No awkward conversations. Your reviews grow on autopilot.',
    },
    {
      title: 'Appointment Reminders',
      body: 'Customer books an appointment. They get a WhatsApp reminder 48 hours before and 2 hours before. They confirm with a simple YES reply. No-shows drop.',
    },
    {
      title: 'No-Show Recovery',
      body: "Someone doesn't show up? Within 30 minutes, they get a WhatsApp with a rebooking link. Most rebook on the spot.",
    },
    {
      title: 'Quote Follow-Up',
      body: 'You send a quote. On day 3, day 7, and day 14, the customer gets a follow-up WhatsApp — each one different, each one nudging them to say yes. Stops the moment they reply.',
    },
    {
      title: 'Invoice & Payment Chase (with M-Pesa)',
      body: 'Invoice overdue? Day 3: polite WhatsApp reminder. Day 7: firmer follow-up. Day 14: urgent chase. Includes M-Pesa payment link so they can pay right from WhatsApp.',
    },
  ],
  pricingTitle: 'Automation Packages',
  setupLabel: 'Setup (one-off)',
  tiers: [
    {
      name: 'Starter',
      includes: 'Missed Call WhatsApp-Back, Instant Lead Response, Review Collection',
      setup: 30000,
      monthly: 15000,
    },
    {
      name: 'Growth',
      includes: 'Everything in Starter + Appointment Reminders, No-Show Recovery, Quote Follow-Up, Repeat Business Follow-Up',
      setup: 50000,
      monthly: 25000,
    },
    {
      name: 'Full System',
      includes: 'Everything in Growth + Invoice/Payment Chase with M-Pesa + GEO + Monthly Reporting',
      setup: 80000,
      monthly: 40000,
    },
  ] satisfies Tier[],
  note: 'Tool costs (WhatsApp Business API, automation platform) are approximately KSh 6,000-7,000/month on top — paid by you directly, we set it all up.',
  faq: [
    {
      q: 'Do I need a special WhatsApp number?',
      a: 'We set you up with the WhatsApp Business API. You can use your existing business number.',
    },
    {
      q: 'Will it sound robotic?',
      a: "No. Every message is written by AI to sound natural and personal. Customers won't know it's automated.",
    },
    {
      q: 'What if a customer needs a real person?',
      a: 'The system hands over to you or your staff the moment a customer needs human help. You see everything in one inbox.',
    },
    {
      q: "Can I see what's being sent?",
      a: 'Yes. Every message is logged. You get a dashboard showing every lead, every reply, every follow-up.',
    },
  ] satisfies FaqItem[],
  finalButton: 'Get Started',
  chat: {
    label: 'Example conversation',
    missed: 'Missed call',
    message: 'Hi, sorry I missed your call. How can I help?',
    reply: 'Hi! I need to book in.',
    time: 'Within 30 seconds',
  },
}

export const geo = {
  meta: {
    title: 'AI Visibility (GEO) for Kenyan Businesses | Platinum Marketing Agency',
    description:
      'When customers ask ChatGPT, Google AI, or Siri who the best business near them is, make sure they hear your name. Get a free AI Visibility Check.',
  },
  serviceName: 'AI Visibility (GEO)',
  hero: {
    title: 'When Customers Ask AI, Your Business Should Be the Answer',
    sub: "More people are asking ChatGPT, Google AI, and Siri 'Who's the best [business] near me?' We make sure they hear your name.",
  },
  problem: [
    "Try it yourself. Open ChatGPT right now and ask: 'Who is the best [your trade] in [your area]?'",
    "If your name doesn't come up — but your competitor's does — you're losing customers to AI every single day. And it's only going to get worse.",
  ],
  listTitle: 'What We Do',
  list: [
    {
      title: 'AI Visibility Audit',
      body: 'We test your business across every major AI platform — ChatGPT, Google Gemini, Claude, Perplexity, Siri. We find out if AI recommends you, who it recommends instead, and exactly why.',
    },
    {
      title: 'Google Business Profile Optimisation',
      body: 'Your Google Business Profile is the #1 thing AI looks at. We complete every field, write a proper description, add photos, and make it easy for AI to read.',
    },
    {
      title: 'Directory Listings',
      body: 'We list your business on every relevant online directory — with your name, address, and phone number exactly the same everywhere. Consistency = AI trusts you.',
    },
    {
      title: 'Review Generation',
      body: 'AI heavily favours businesses with lots of recent, positive reviews. Our WhatsApp automation system collects Google reviews from your customers on autopilot.',
    },
    {
      title: 'Website AI Optimisation',
      body: 'We add FAQ pages to your website that match exactly how people ask AI questions. We add invisible code (schema markup) that helps AI read your site like a menu.',
    },
    {
      title: 'Monthly Monitoring & Reporting',
      body: "Every month, we re-test your AI visibility. You get a simple report: your score, which AI platforms recommend you, how many new reviews you got, and what we're working on next.",
    },
  ],
  pricingTitle: 'AI Visibility Packages',
  setupLabel: 'Setup (one-off)',
  tiers: [
    {
      name: 'AI Starter',
      includes: 'AI Audit + Google Business Profile Optimisation + 10 Directory Listings + Monthly Monitoring',
      setup: 25000,
      monthly: 10000,
    },
    {
      name: 'AI Growth',
      includes: 'Everything in Starter + Full Directory Blitz + Automated Review Collection + FAQ Pages',
      setup: 40000,
      monthly: 18000,
    },
    {
      name: 'AI Full System',
      includes: 'Everything in Growth + Schema Markup + Full Website AI Optimisation + Competitor Tracking',
      setup: 60000,
      monthly: 28000,
    },
  ] satisfies Tier[],
  finalButton: 'Get Your Free AI Visibility Check',
}

export const about = {
  meta: {
    title: 'About Us | Platinum Marketing Agency, Nairobi',
    description:
      'We help Kenyan service businesses win online with websites that get found, WhatsApp automations that capture every lead, and AI visibility.',
  },
  title: 'We Help Kenyan Businesses Win Online',
  story: [
    'Platinum Marketing Agency was built on a simple idea: most businesses lose customers they should be keeping. Missed calls go unreturned. Enquiries get forgotten. Quotes don\'t get followed up. And now, AI is recommending your competitors instead of you.',
    'We fix all of that.',
    'We build websites that get found. We set up WhatsApp automations that capture every lead. And we make sure that when customers ask AI who to call — your name comes up first.',
    'We work exclusively with Kenyan service businesses — dentists, salons, restaurants, garages, clinics, real estate agents, hotels, and more. We understand the market, we speak the language, and we deliver results you can measure.',
  ],
  teamTitle: 'Meet the Team',
  // DRAFT: bios written from each role in the brief. Team to confirm and supply photos.
  team: [
    { name: 'Victor Odhiambo', role: 'Founder & Strategy', bio: 'Sets the direction and makes sure our work brings clients more customers.' },
    { name: 'Austin', role: 'Operations Lead & Developer', bio: 'Keeps projects moving and builds the systems behind them.' },
    { name: 'Samara', role: 'Developer & Social Media', bio: 'Builds client websites and looks after social media.' },
    { name: 'Ann', role: 'Lead Generation & Client Communications', bio: 'Finds businesses we can help and keeps clients in the loop.' },
  ],
  valuesTitle: 'What We Stand For',
  values: [
    { title: 'Results, not reports', body: 'We care about leads and revenue, not vanity metrics.' },
    { title: 'Simple systems that work', body: "We don't over-engineer. If it works, it ships." },
    { title: 'Your business, our mission', body: 'We succeed when you succeed. Simple as that.' },
  ],
}

export const contact = {
  meta: {
    title: 'Book a Free AI Visibility Check | Platinum Marketing Agency',
    description:
      "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing. No charge, no commitment.",
  },
  title: "Let's Talk About Your Business",
  sub: "Book a free 10-minute AI Visibility Check. We'll show you exactly how your business shows up on AI — and what you're missing. No charge, no commitment.",
  bookingTitle: 'Pick a time',
  bookingPending: 'The online booking calendar is coming soon. For now, send us your details and we will get back to you to arrange your free check.',
  formTitle: 'Send us your details',
  form: {
    name: 'Name',
    business: 'Business Name',
    phone: 'Phone',
    email: 'Email',
    need: 'What do you need help with?',
    needPrompt: 'Choose one',
    needs: ['Website', 'WhatsApp Automations', 'AI Visibility', 'All of the above', 'Not sure'],
    submit: 'Send',
    sending: 'Sending…',
    sent: "Thanks. We've got your details and will be in touch soon.",
    failed: 'That did not send. Please try again, or email us directly.',
    opened: 'Your email app should now be open with your details filled in. Press send to reach us.',
  },
  directTitle: 'Or reach us directly',
  whatsapp: 'Chat on WhatsApp',
  whatsappPending: 'WhatsApp number coming soon',
  phonePending: 'Kenya number coming soon',
  remote: 'No physical office needed — we work remotely.',
  mapTitle: 'Map showing Nairobi, Kenya',
}

export const pricing = {
  meta: {
    title: 'Pricing | Websites, WhatsApp Automation & AI Visibility | Platinum',
    description:
      'Simple, transparent pricing in Kenyan Shillings for websites, WhatsApp automations and AI visibility. No hidden fees. No long contracts. Cancel anytime.',
  },
  title: 'Simple, Transparent Pricing',
  sub: 'No hidden fees. No long contracts. Cancel anytime.',
  bundle: 'Get a website + any automation package together and save KSh 10,000-20,000 on setup.',
  finalTitle: 'Not sure which package?',
  finalBody: "Book a free call and we'll help you figure it out.",
}

export const notFound = {
  meta: {
    title: 'Page Not Found | Platinum Marketing Agency',
    description: 'We could not find that page.',
  },
  title: 'We could not find that page',
  body: 'It may have moved. Head back to the home page, or book a free call.',
  home: 'Back to Home',
}

export const nav = {
  items: [
    { label: 'Websites', href: 'websites' },
    { label: 'WhatsApp Automations', href: 'automations' },
    { label: 'AI Visibility', href: 'geo' },
    { label: 'Pricing', href: 'pricing' },
    { label: 'About', href: 'about' },
  ] as const,
  menu: 'Menu',
  skip: 'Skip to content',
}

export const footer = {
  servicesTitle: 'Services',
  companyTitle: 'Company',
  contactTitle: 'Get in Touch',
  company: [
    { label: 'About', href: 'about' },
    { label: 'Pricing', href: 'pricing' },
    { label: 'Contact', href: 'contact' },
  ] as const,
  copyright: '© 2026 Platinum Marketing Agency',
}

export const consent = {
  text: 'We use analytics cookies to see how people use this site.',
  accept: 'Accept',
  decline: 'Decline',
}
