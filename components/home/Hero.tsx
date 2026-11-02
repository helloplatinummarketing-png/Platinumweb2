import Link from 'next/link'
import { routes } from '@/config/site'
import { home } from '@/content/home'
import { LiveDashboard } from './LiveDashboard'

export function Hero() {
  const { hero, trustBadge } = home
  return (
    <section id="hero" className="relative z-10 overflow-hidden">
      {/* Keeps the text readable over the globe's brightest particles. */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[85svh] bg-[radial-gradient(ellipse_90%_40%_at_50%_30%,rgb(7_8_11/0.62),transparent_100%)] sm:bg-[radial-gradient(ellipse_75%_52%_at_50%_34%,rgb(7_8_11/0.8),rgb(7_8_11/0.42)_65%,transparent_100%)]" aria-hidden="true" />
      <div className="wrap relative flex flex-col items-center pt-28 text-center sm:pt-32">
        <h1 className="display-hero text-metal max-w-5xl">{hero.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-platinum sm:text-xl">{hero.sub}</p>
        <div className="mt-8 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row">
          <Link href={routes.contact} className="btn btn-primary">
            {hero.primary}
          </Link>
          <a href="#services" className="btn btn-ghost">
            {hero.secondary}
          </a>
        </div>
        <p className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border-strong bg-bg/70 px-4 py-1.5 text-sm">
          {trustBadge.text}
          {trustBadge.placeholder && (
            <span className="rounded-full bg-surface px-2 py-0.5 text-xs text-silver">{trustBadge.placeholderLabel}</span>
          )}
        </p>
      </div>
      <div className="wrap relative mt-12 sm:mt-16">
        <LiveDashboard />
      </div>
    </section>
  )
}
