import type { FaqItem } from '@/content/types'

/** Native details and summary, so it works with a keyboard and without JavaScript. */
export function Faq({ title, items }: { title: string; items: FaqItem[] }) {
  return (
    <section className="relative py-20 sm:py-28">
      <div className="wrap">
        <h2 className="section-heading text-metal">{title}</h2>
        <div className="mt-10 max-w-3xl divide-y divide-border-strong border-y border-border-strong">
          {items.map((item) => (
            <details key={item.q} className="group py-2">
              <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-display text-lg font-medium sm:text-xl">
                {item.q}
                <svg viewBox="0 0 24 24" className="size-5 shrink-0 text-accent transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </summary>
              <p className="pb-4 text-silver sm:text-lg">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
