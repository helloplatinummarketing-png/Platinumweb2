import type { Metadata } from 'next'
import Image from 'next/image'
import { routes } from '@/config/site'
import { about } from '@/content/about'
import { closingCta } from '@/content/types'
import { CalmGlobeBackdrop } from '@/components/sections/Backdrops'
import { FinalCta } from '@/components/sections/FinalCta'

export const metadata: Metadata = {
  title: about.meta.title,
  description: about.meta.description,
  alternates: { canonical: routes.about },
  openGraph: { title: about.meta.title, description: about.meta.description, url: routes.about, images: ['/opengraph-image'] },
}

export default function AboutPage() {
  return (
    <>
      <section className="relative flex min-h-[80svh] items-center justify-center overflow-hidden pt-16 text-center">
        <CalmGlobeBackdrop />
        <div className="absolute inset-0 bg-bg/45" aria-hidden="true" />
        <div className="wrap relative">
          <h1 className="display-hero text-metal mx-auto max-w-5xl">{about.title}</h1>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="wrap">
          <div className="max-w-3xl space-y-6 text-lg sm:text-xl">
            {about.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="wrap">
          <h2 className="section-heading text-metal">{about.teamTitle}</h2>
          <ul className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {about.team.map((person) => (
              <li key={person.name} className="panel !p-0 overflow-hidden">
                {/* The placeholder is an SVG, which next/image passes through unoptimised. Real photos go through AVIF/WebP. */}
                <Image
                  src={person.photo}
                  alt={`Placeholder photo for ${person.name}`}
                  width={400}
                  height={400}
                  unoptimized={person.photo.endsWith('.svg')}
                  sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  className="aspect-square w-full object-cover"
                />
                <div className="p-5">
                  <h3 className="font-display text-xl font-medium">{person.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-accent">{person.role}</p>
                  <p className="mt-3 text-silver">
                    {person.bio} <span className="rounded-full border border-border-strong px-2 py-0.5 text-xs">{about.placeholderTag}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="relative py-20 sm:py-28">
        <div className="wrap">
          <h2 className="section-heading text-metal">{about.valuesTitle}</h2>
          <ul className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-3">
            {about.values.map((value) => (
              <li key={value.title} className="panel">
                <h3 className="font-display text-2xl leading-tight font-medium">{value.title}</h3>
                <p className="mt-3 text-silver">{value.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <FinalCta {...closingCta} button={about.button} />
    </>
  )
}
