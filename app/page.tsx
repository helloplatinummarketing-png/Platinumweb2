import type { Metadata } from 'next'
import { home } from '@/content/home'
import { GlobeHost } from '@/components/three/GlobeHost'
import { Hero } from '@/components/home/Hero'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Problem } from '@/components/home/Problem'
import { Services } from '@/components/home/Services'
import { Stats } from '@/components/home/Stats'
import { Testimonials } from '@/components/home/Testimonials'
import { FinalCta } from '@/components/sections/FinalCta'

export const metadata: Metadata = {
  title: { absolute: `${home.meta.title} | Platinum Marketing Agency` },
  description: home.meta.description,
  alternates: { canonical: '/' },
  openGraph: { title: home.meta.title, description: home.meta.description, url: '/', images: ['/opengraph-image'] },
}

export default function HomePage() {
  return (
    <>
      <GlobeHost />
      <Hero />
      <Problem />
      <Services />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <FinalCta {...home.finalCta} />
    </>
  )
}
