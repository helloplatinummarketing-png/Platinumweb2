import { routes } from '@/config/site'

export const nav = {
  items: [
    { label: 'Websites', href: routes.websites },
    { label: 'WhatsApp Automations', href: routes.automations },
    { label: 'AI Visibility', href: routes.geo },
    { label: 'Pricing', href: routes.pricing },
    { label: 'About', href: routes.about },
  ],
  cta: 'Book a Free Call',
  floatingCta: 'Book Free Check',
  whatsapp: 'Chat on WhatsApp',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  skip: 'Skip to content',
}

export const footer = {
  groups: [
    {
      title: 'Services',
      links: [
        { label: 'Websites', href: routes.websites },
        { label: 'WhatsApp Automations', href: routes.automations },
        { label: 'AI Visibility', href: routes.geo },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', href: routes.about },
        { label: 'Pricing', href: routes.pricing },
        { label: 'Contact', href: routes.contact },
      ],
    },
  ],
  contactTitle: 'Get in Touch',
  copyright: '© 2026 Platinum Marketing Agency',
}

export const consent = {
  text: 'We use analytics cookies to see how people use this site. They stay off unless you accept.',
  accept: 'Accept',
  decline: 'Decline',
}
