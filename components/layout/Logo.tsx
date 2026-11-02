import Link from 'next/link'
import { routes, site } from '@/config/site'

/** TODO(Victor): swap in the final logo file. This is the existing sunburst mark in brushed platinum. */
export function Logo() {
  return (
    <Link href={routes.home} className="flex items-center gap-2.5" aria-label={`${site.name} home`}>
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden="true">
        <defs>
          <linearGradient id="logo-metal" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="0.5" stopColor="#a8abb1" />
            <stop offset="1" stopColor="#e5e4e2" />
          </linearGradient>
        </defs>
        <g stroke="url(#logo-metal)" strokeWidth="1.8" strokeLinecap="round">
          <path d="M16 8V3M16 24v5M8 16H3M24 16h5M21.66 10.34l3.54-3.54M10.34 21.66l-3.54 3.54M10.34 10.34 6.8 6.8M21.66 21.66l3.54 3.54" />
        </g>
        <circle cx="16" cy="16" r="4.5" fill="url(#logo-metal)" />
      </svg>
      <span className="leading-none">
        <span className="text-metal block font-display text-base font-semibold tracking-wide">PLATINUM</span>
        <span className="block text-[0.6rem] tracking-[0.16em] text-silver">MARKETING AGENCY</span>
      </span>
    </Link>
  )
}
