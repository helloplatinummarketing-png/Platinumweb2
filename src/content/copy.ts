/**
 * ALL site copy lives here. Edit text freely; the scene and layout read from it.
 * Links that go off-site are collected in `links` at the top.
 */

export const links = {
  bookDemo: 'https://cal.com/platinummarketingagency/15min',
  phone: 'tel:07594217753',
  phoneLabel: '07594 217753',
  email: 'mailto:helloplatinummarketing@gmail.com',
  emailLabel: 'helloplatinummarketing@gmail.com',
  site: 'https://platinummarketingagency.co.uk',
  siteLabel: 'platinummarketingagency.co.uk',
  privacy: 'https://platinummarketingagency.co.uk/privacy',
  terms: 'https://platinummarketingagency.co.uk/terms',
}

export const loader = {
  label: 'CORE: KINETIC_V2 / THREAD: STABLE_ACTIVE',
}

export const nav = {
  logo: 'PLATINUM',
  logoSub: 'MARKETING AGENCY',
  items: [
    { label: 'WORK', shot: 'work' },
    { label: 'SERVICES', shot: 'solution' },
    { label: 'PRICING', shot: 'pricing' },
    { label: 'FAQ', shot: 'faq' },
  ],
  cta: 'BOOK FREE DEMO',
}

export const hero = {
  eyebrow: 'PLATINUM MARKETING AGENCY / BRISTOL',
  title: ['WE BUILD.', 'YOU WORK.'],
  sub: 'Premium websites and automation for UK trades businesses — live in 5 days, running 24/7 from day one.',
  primary: 'SEE OUR WORK →',
  secondary: 'BOOK FREE DEMO →',
  events: [
    { tag: 'Lead Captured', text: 'Bristol electrician replied in 47 seconds', petal: 1 },
    { tag: 'Site Live', text: 'Bristol Spark deployed in 4 days', petal: 5 },
    { tag: 'Job Won', text: 'Roofer booked 3 new jobs this week', petal: 9 },
  ],
  hudLeft: 'LOC: BRISTOL_HQ / CRD: 51.4545 N, 2.5879 W',
  hudRight: 'SCROLL ↓',
}

export const stats = [
  { value: 91, prefix: '', suffix: '%', label: 'Customers search online first', petal: 0 },
  { value: 5, prefix: '', suffix: ' Days', label: 'Average site delivery', petal: 2 },
  { value: 24, prefix: '', suffix: '/7', label: 'Automation uptime', petal: 4 },
  { value: 0, prefix: '£', suffix: '', label: 'Cost to book a demo', petal: 7 },
  { value: 30, prefix: '', suffix: ' Days', label: 'Notice to cancel', petal: 11 },
]

export const problem = {
  label: 'THE PROBLEM',
  title: 'Most Trades Businesses Are Invisible Online.',
  body: "While you're on the tools, your customers are searching Google and calling whoever shows up first. That business is getting the job. You're missing work you never knew existed.",
  stats: [
    { value: '3–5', label: 'missed calls every day on the tools' },
    { value: '78%', label: 'of jobs go to whoever responds first' },
    { value: '£2,400', label: 'lost monthly from missed leads' },
  ],
}

export const solution = {
  label: 'THE SOLUTION',
  title: 'One System. Every Lead Captured.',
  stages: [
    {
      when: 'DAYS 1–5',
      title: 'Built to Convert',
      body: 'A premium animated website that looks better than any competitor in your area. Local SEO built in. Live in 5 working days.',
    },
    {
      when: 'DAY 5 ONWARDS',
      title: 'Runs While You Work',
      body: 'Missed calls texted back in 30 seconds. Leads followed up in 60 seconds. Reviews collected after every job. All automatic.',
    },
    {
      when: 'MONTH 1 ONWARDS',
      title: 'Compounds Over Time',
      body: 'More reviews means higher Google ranking. Higher ranking means more calls. More calls means more jobs. All growing in the background.',
    },
  ],
}

export const work = {
  label: 'BUILT BY PLATINUM',
  title: 'See It Working.',
  caseStudy: {
    name: 'BRISTOL SPARK ELECTRICAL',
    subtitle: 'NICEIC Approved Electrician',
    meta: [
      ['Trade', 'Electrician'],
      ['Location', 'Bristol, UK'],
      ['Build', 'Built in 4 days'],
    ],
    tags: ['WEBSITE', 'AUTOMATION', 'LOCAL SEO'],
    cta: 'VIEW LIVE SITE →',
    url: 'https://bristol-spark-electrical.vercel.app/',
    /** Drop a real screenshot here (e.g. '/work/bristol-spark.jpg') to replace the generated preview. */
    screenshot: '/work/bristol-spark.jpg' as string | null,
  },
  next: 'Your business could be next. ↓',
}

export const pricing = {
  label: 'INVESTMENT',
  title: 'Simple Pricing. No Surprises.',
  tiers: [
    {
      badge: 'ENTRY POINT',
      name: 'Visibility Package',
      setup: '£750',
      monthly: '£79/month',
      petals: 3,
      features: [
        'Premium animated website',
        'Local SEO setup',
        'Google Business Profile optimised',
        'Contact form + instant notifications',
        'Hosting and maintenance',
        'Live in 5 working days',
      ],
      cta: 'GET STARTED →',
      highlight: false,
    },
    {
      badge: 'BEST FOR LEADS',
      name: 'Lead Machine',
      setup: '£1,200',
      monthly: '£247/month',
      petals: 6,
      features: [
        'Everything in Visibility',
        'AI chatbot on website',
        'Missed call text-back (30 seconds)',
        'Instant lead response (60 seconds)',
        'Review collection automation',
        'Lead tracking dashboard',
      ],
      cta: 'GET STARTED →',
      highlight: true,
    },
    {
      badge: 'QUICK WIN',
      name: 'Reputation Builder',
      setup: '£400',
      monthly: '£79/month',
      petals: 9,
      features: [
        'Automated review requests after every job',
        'Direct Google review link',
        '5-day follow-up reminder',
        'Review tracking dashboard',
        'Monthly report',
      ],
      cta: 'GET STARTED →',
      highlight: false,
    },
    {
      badge: 'MOST COMPLETE',
      name: 'Full System',
      setup: '£2,000',
      monthly: '£497/month',
      petals: 12,
      features: [
        'Everything in Lead Machine',
        'Appointment reminders (48hr + 2hr)',
        'No-show recovery',
        'Quote follow-up (Day 3, 7, 14)',
        'Invoice chase sequence',
        'Repeat business follow-up',
        'AI voice caller for quotes',
        'Monthly performance report',
        'Direct WhatsApp access to Platinum',
      ],
      cta: 'BOOK FREE DEMO →',
      highlight: false,
    },
  ],
  note: "Not sure which package? Book a free 15-minute call and we'll tell you exactly what your business needs.",
  noteCta: 'Book free call →',
}

export const process = {
  label: 'THE PROCESS',
  title: 'From First Call to First Client — 5 Days.',
  steps: [
    {
      n: '01',
      title: 'Book a Free Demo',
      body: "15 minutes. We look at your online presence and tell you exactly what's costing you jobs.",
      petal: 1,
    },
    { n: '02', title: 'We Build It', body: 'Your website and automation built, tested, and live in 5 working days.', petal: 3 },
    { n: '03', title: 'You Grow', body: 'Leads captured automatically while you focus on the work.', petal: 5 },
  ],
}

export const whyUs = {
  label: 'WHY US',
  title: 'Built Different.',
  points: [
    {
      title: 'BRISTOL BASED',
      body: "We're local. We understand your market, your competition, and your customers.",
      petal: 0,
    },
    {
      title: 'AI POWERED',
      body: 'We use the latest AI tools to build faster and smarter than any agency.',
      petal: 3,
    },
    {
      title: 'LIVE IN 5 DAYS',
      body: 'Not weeks. Not months. 5 working days from brief to live website.',
      petal: 6,
    },
    {
      title: 'NO CONTRACTS',
      body: "Month to month. If we're not delivering results, you walk away. Simple.",
      petal: 9,
    },
  ],
}

export const faq = {
  label: 'FAQ',
  title: 'Common Questions.',
  items: [
    {
      q: 'How quickly will my website be live?',
      a: 'Most websites are live within 5 working days of receiving your content and approval.',
    },
    {
      q: 'Do I need to sign a long-term contract?',
      // TODO: confirm
      a: "No. Every plan is month to month with 30 days' notice. If we're not delivering, you walk away.",
    },
    {
      q: 'What do I need to provide?',
      // TODO: confirm
      a: 'Your logo, a few photos of your work and the services and areas you cover. We write the copy and handle everything else.',
    },
    {
      q: 'Will my website show up on Google?',
      // TODO: confirm
      a: 'Yes. Every site launches with local SEO and an optimised Google Business Profile so you show up when people nearby search for your trade.',
    },
    {
      q: 'What happens if something breaks?',
      // TODO: confirm
      a: "Hosting and maintenance are included. If anything goes wrong, we fix it — usually before you've noticed.",
    },
    {
      q: 'Can I see examples of your work?',
      // TODO: confirm
      a: 'Yes. Have a look at Bristol Spark Electrical above, or book a demo and we will walk you through more live builds.',
    },
    {
      q: 'How does the automation actually work?',
      // TODO: confirm
      a: 'When a call is missed, a lead comes in or a job is finished, the system sends the right text or email automatically — replies in seconds, review requests after every job, follow-ups on quotes.',
    },
    {
      q: 'Do you work outside Bristol?',
      // TODO: confirm
      a: "Yes. We're based in Bristol but build for trades businesses right across the UK.",
    },
  ],
}

export const finalCta = {
  label: 'GET STARTED',
  title: 'Ready to Stop Losing Jobs Online?',
  body: 'Book a free 15-minute demo. No obligation. No hard sell. Just straight advice on what your business is missing and how to fix it.',
  cta: 'BOOK FREE DEMO TODAY',
  call: 'or call',
  closing: 'We Build, You Work.',
}

export const footer = {
  location: 'BRISTOL, UK',
  columns: [
    {
      title: 'SERVICES',
      links: [
        { label: 'Visibility Package', shot: 'pricing' },
        { label: 'Lead Machine', shot: 'pricing' },
        { label: 'Reputation Builder', shot: 'pricing' },
        { label: 'Full System', shot: 'pricing' },
      ],
    },
    {
      title: 'COMPANY',
      links: [
        { label: 'Our Work', shot: 'work' },
        { label: 'How It Works', shot: 'process' },
        { label: 'FAQ', shot: 'faq' },
        { label: 'Contact', shot: 'cta' },
      ],
    },
  ],
  contactTitle: 'GET IN TOUCH',
  copyright: '© 2026 Platinum Marketing Agency',
}

/** The 12 parts of the system, one per petal (tooltip text on hover). */
export const petals = [
  'Premium website',
  'Local SEO',
  'Google Business Profile',
  'Instant notifications',
  'AI chatbot',
  'Missed call text-back',
  'Instant lead response',
  'Review collection',
  'Appointment reminders',
  'Quote follow-up',
  'Invoice chase',
  'AI voice caller',
]
