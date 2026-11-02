/**
 * Turns each page into a complete HTML document. Used by the dev server
 * (vite.config.ts) and by scripts/prerender.mjs at build time. React only runs
 * here, so visitors download plain HTML, CSS and a small script (client.ts).
 */
import type { ReactNode } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { about, automations, contact, geo, home, notFound, pricing, websites, type FaqItem, type Tier } from './content/copy.ts'
import { paths, site } from './content/site.ts'
import { About } from './pages/About.tsx'
import { Automations } from './pages/Automations.tsx'
import { Contact } from './pages/Contact.tsx'
import { Geo } from './pages/Geo.tsx'
import { Home } from './pages/Home.tsx'
import { NotFound } from './pages/NotFound.tsx'
import { Pricing } from './pages/Pricing.tsx'
import { Websites } from './pages/Websites.tsx'
import { Layout } from './ui/Layout.tsx'

interface Page {
  meta: { title: string; description: string }
  body: ReactNode
  schema?: object[]
}

const business = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  '@id': `${site.url}/#business`,
  name: site.name,
  url: site.url,
  email: site.email,
  ...(site.phoneE164 ? { telephone: site.phoneE164 } : {}),
  image: `${site.url}/og-image.jpg`,
  address: { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
  areaServed: { '@type': 'Country', name: 'Kenya' },
  currenciesAccepted: 'KES',
}

function serviceSchema(name: string, description: string, path: string, tiers: Tier[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name,
    description,
    url: `${site.url}${path}`,
    provider: { '@id': business['@id'] },
    areaServed: { '@type': 'Country', name: 'Kenya' },
    offers: tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.includes,
      priceSpecification: {
        '@type': 'PriceSpecification',
        priceCurrency: 'KES',
        [tier.setupFrom ? 'minPrice' : 'price']: tier.setup,
      },
    })),
  }
}

function faqSchema(items: FaqItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

const pages: Record<string, Page> = {
  [paths.home]: { meta: home.meta, body: <Home /> },
  [paths.websites]: {
    meta: websites.meta,
    body: <Websites />,
    schema: [
      serviceSchema(websites.serviceName, websites.meta.description, paths.websites, websites.tiers),
      faqSchema(websites.faq),
    ],
  },
  [paths.automations]: {
    meta: automations.meta,
    body: <Automations />,
    schema: [
      serviceSchema(automations.serviceName, automations.meta.description, paths.automations, automations.tiers),
      faqSchema(automations.faq),
    ],
  },
  [paths.geo]: {
    meta: geo.meta,
    body: <Geo />,
    schema: [serviceSchema(geo.serviceName, geo.meta.description, paths.geo, geo.tiers)],
  },
  [paths.about]: { meta: about.meta, body: <About /> },
  [paths.contact]: { meta: contact.meta, body: <Contact /> },
  [paths.pricing]: { meta: pricing.meta, body: <Pricing /> },
}

export const routes = Object.keys(pages)
export const siteUrl = site.url

export interface Assets {
  scripts: string[]
  styles: string[]
}

/**
 * Runs before first paint, so the page is laid out correctly from the start.
 * Skips the 3D for reduced motion, data saver, slow connections and low-end devices.
 * URL flags for testing: ?motion or ?forcewebgl turn it on, ?reduced or ?nowebgl turn it off.
 */
const STAGE_CHECK = `(function(){var h=document.documentElement,q=location.search,n=navigator,c=n.connection||{};
if(/[?&](nowebgl|reduced)/.test(q))return;
if(!/[?&](motion|forcewebgl)/.test(q)&&(matchMedia('(prefers-reduced-motion: reduce)').matches||c.saveData||/2g/.test(c.effectiveType||'')||(n.deviceMemory&&n.deviceMemory<3)||(n.hardwareConcurrency&&n.hardwareConcurrency<4)))return;
h.classList.add('stage');try{if(sessionStorage.getItem('platinum-seen'))h.classList.add('seen');sessionStorage.setItem('platinum-seen','1')}catch(e){}})()`

function jsonLd(data: object) {
  // Stops any "</script>" in the copy from ending the tag early.
  return JSON.stringify(data).replace(/</g, '\\u003c')
}

/** Renders a route to a full document. Unknown paths render the 404 page. */
export function renderPage(path: string, assets: Assets) {
  const page = pages[path]
  const { title, description } = page?.meta ?? notFound.meta
  const canonical = `${site.url}${path === '/' ? '' : path}`
  const schema = [business, ...(page?.schema ?? [])]

  const html = renderToStaticMarkup(
    <html lang="en-KE">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#03050a" />
        <script dangerouslySetInnerHTML={{ __html: STAGE_CHECK }} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {page ? <link rel="canonical" href={canonical} /> : <meta name="robots" content="noindex" />}
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_KE" />
        <meta property="og:site_name" content={site.name} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${site.url}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        {assets.styles.map((href) => (
          <link key={href} rel="stylesheet" href={href} />
        ))}
        {schema.map((data, i) => (
          <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(data) }} />
        ))}
        {assets.scripts.map((src) => (
          <script key={src} type="module" src={src} />
        ))}
      </head>
      <body data-ga={site.gaId ?? undefined}>
        <Layout path={path}>{page?.body ?? <NotFound />}</Layout>
      </body>
    </html>,
  )
  return `<!doctype html>${html}`
}
