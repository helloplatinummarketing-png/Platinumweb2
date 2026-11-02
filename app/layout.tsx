import type { Metadata, Viewport } from 'next'
import { Inter, Space_Grotesk } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { site } from '@/config/site'
import { nav } from '@/content/navigation'
import { CookieBanner } from '@/components/layout/CookieBanner'
import { FloatingActions } from '@/components/layout/FloatingActions'
import { Footer } from '@/components/layout/Footer'
import { Header } from '@/components/layout/Header'
import { SmoothScroll } from '@/components/layout/SmoothScroll'
import { JsonLd, localBusinessSchema } from '@/components/seo/JsonLd'
import './globals.css'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const body = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: {
    type: 'website',
    locale: 'en_KE',
    siteName: site.name,
    url: site.url,
  },
  twitter: { card: 'summary_large_image', images: ['/opengraph-image'] },
}

export const viewport: Viewport = {
  themeColor: '#07080b',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-KE" className={`${display.variable} ${body.variable}`}>
      <body>
        <JsonLd data={localBusinessSchema()} />
        <a href="#main" className="skip-link">
          {nav.skip}
        </a>
        <SmoothScroll />
        <Header />
        <main id="main" className="relative">
          {children}
        </main>
        <Footer />
        <FloatingActions />
        {site.ga4Id && <CookieBanner gaId={site.ga4Id} />}
        {process.env.VERCEL && <Analytics />}
      </body>
    </html>
  )
}
