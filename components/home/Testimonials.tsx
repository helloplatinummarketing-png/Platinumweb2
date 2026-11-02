import { home } from '@/content/home'

function Card({ item, tag }: { item: (typeof home.testimonials.items)[number]; tag: string }) {
  return (
    <li className="panel w-[19rem] shrink-0 sm:w-[24rem]">
      <span className="rounded-full border border-border-strong px-2 py-0.5 text-xs text-silver">{tag}</span>
      <blockquote className="mt-4 font-display text-xl leading-snug">{item.quote}</blockquote>
      <p className="mt-5 text-sm font-semibold">{item.name}</p>
      <p className="text-sm text-silver">{item.business}</p>
    </li>
  )
}

/** A slow horizontal drift that pauses on hover. The second copy makes the loop seamless. */
export function Testimonials() {
  const { testimonials } = home
  return (
    <section className="relative z-10 overflow-hidden bg-bg py-20 sm:py-32">
      <div className="wrap">
        <h2 className="section-heading text-metal">{testimonials.title}</h2>
      </div>
      <div className="drift mt-10 sm:mt-14">
        <ul className="drift-track">
          {testimonials.items.map((item, i) => (
            <Card key={i} item={item} tag={testimonials.placeholder} />
          ))}
        </ul>
        <ul className="drift-track" aria-hidden="true">
          {testimonials.items.map((item, i) => (
            <Card key={i} item={item} tag={testimonials.placeholder} />
          ))}
        </ul>
      </div>
    </section>
  )
}
