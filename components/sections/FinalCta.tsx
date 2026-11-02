import Link from 'next/link'
import { routes } from '@/config/site'

/** Dark closing section, with the globe's glow bleeding up from the bottom edge. */
export function FinalCta({ title, body, button }: { title: string; body?: string; button: string }) {
  return (
    <section className="relative z-10 overflow-hidden bg-bg">
      <div className="final-glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="wrap relative flex min-h-[80svh] flex-col items-center justify-center py-24 text-center">
        <h2 className="display-hero text-metal max-w-4xl">{title}</h2>
        {body && <p className="mt-6 max-w-2xl text-lg sm:text-xl">{body}</p>}
        <Link href={routes.contact} className="btn btn-primary mt-9">
          {button}
        </Link>
      </div>
    </section>
  )
}
