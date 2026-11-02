import type { Metadata } from 'next'
import { home } from '@/content/home'
import { GlobeHost } from '@/components/three/GlobeHost'
import { Hero } from '@/components/home/Hero'

export const metadata: Metadata = {
  title: { absolute: `${home.meta.title} | Platinum Marketing Agency` },
  description: home.meta.description,
  alternates: { canonical: '/' },
  openGraph: { title: home.meta.title, description: home.meta.description, url: '/' },
}

export default function HomePage() {
  return (
    <>
      <GlobeHost />
      <Hero />
      {/* TODO(milestone 3): problem, services, stats, how it works, testimonials, final CTA. Keeps the #services link working. */}
      <div id="services" className="relative z-10" />
    </>
  )
}
