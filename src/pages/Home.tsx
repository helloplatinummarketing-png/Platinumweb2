import { home } from '../content/copy.ts'
import { paths } from '../content/site.ts'
import { Icon } from '../ui/Icon.tsx'
import { Button, FinalCta } from '../ui/parts.tsx'

function Hero() {
  const { hero, services, scroll } = home
  return (
    <div data-act="rise" className="act-rise">
      <section className="hero-pin">
        <div className="wrap flex min-h-[100svh] flex-col justify-end pt-24 pb-6">
          <div className="grid items-end gap-6 lg:grid-cols-[3fr_1.4fr]">
            <h1 className="display">{hero.title}</h1>
            <div>
              <p className="text-lg text-ink">{hero.sub}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                <Button href={paths.contact}>{hero.primary}</Button>
                <Button href="#services" variant="ghost">
                  {hero.secondary}
                </Button>
              </div>
            </div>
          </div>
          <div className="mono mt-8 hidden items-center justify-between border-t border-white/20 pt-4 sm:flex">
            {services.cards.map((card) => (
              <a key={card.href} href={paths[card.href]} className="flex items-center gap-2 text-platinum hover:text-gold">
                <span className="size-1.5 bg-gold" />
                {card.label}
              </a>
            ))}
            <span className="scroll-cue text-platinum">{scroll}</span>
          </div>
        </div>
      </section>
    </div>
  )
}

function Problem() {
  const { problem } = home
  return (
    <section data-act="lost">
      <div className="beat">
        <h2 className="statement reveal wrap text-center">{problem.title}</h2>
      </div>
      {problem.points.map((point) => (
        <div key={point.title} className="beat">
          <div className="reveal wrap text-center">
            <span className="icon-tile">
              <Icon name={point.icon} />
            </span>
            <h3 className="statement mt-5">{point.title}</h3>
            <p className="lede mx-auto mt-4 max-w-xl">{point.body}</p>
          </div>
        </div>
      ))}
      <div className="transit" />
    </section>
  )
}

function Modules() {
  const { services, modules } = home
  return (
    <div id="services">
      <h2 className="sr-only">{services.title}</h2>
      {modules.map((module) => {
        const card = services.cards.find((c) => c.href === module.card)!
        const side = module.align === 'side'
        return (
          <section key={module.act} id={module.act} data-act={module.act} data-rail={module.act}>
            {module.lines.map((line) => (
              <div key={line} className={`beat ${side ? 'beat-side' : ''}`}>
                <div className={`wrap ${side ? '' : 'text-center'}`}>
                  <p className={`statement reveal ${side ? 'max-w-[34rem]' : 'mx-auto max-w-4xl'}`}>{line}</p>
                </div>
              </div>
            ))}
            <div className={`beat ${side ? 'beat-side' : ''}`}>
              <div className={`wrap ${side ? '' : 'text-center'}`}>
                <div className={`reveal max-w-[40rem] ${side ? '' : 'mx-auto'}`}>
                  <p className="mono text-gold">
                    {module.tag} / {card.label}
                  </p>
                  <h3 className="statement mt-3">{card.title}</h3>
                  <p className="lede mt-4">{card.body}</p>
                  <dl className={`mono mt-6 grid grid-cols-3 gap-3 border-y border-white/20 py-4 ${side ? 'text-left' : ''}`}>
                    {module.facts.map((fact) => (
                      <div key={fact.label}>
                        <dd className="text-base font-semibold text-ink normal-case sm:text-lg">{fact.value}</dd>
                        <dt className="mt-1 text-[0.625rem] leading-snug text-platinum">{fact.label}</dt>
                      </div>
                    ))}
                  </dl>
                  <div className="mt-6">
                    <Button href={paths[card.href]} variant="ghost">
                      {services.more}: {card.label}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="transit" />
          </section>
        )
      })}
    </div>
  )
}

function Rail() {
  const { services, modules, railTitle } = home
  return (
    <nav className="rail mono" aria-label={railTitle}>
      <p className="mb-3 tracking-[0.25em] text-ink">{railTitle}:</p>
      {modules.map((module) => {
        const card = services.cards.find((c) => c.href === module.card)!
        return (
          <a key={module.act} href={`#${module.act}`} data-rail-link={module.act}>
            {card.label}
          </a>
        )
      })}
    </nav>
  )
}

function Finale() {
  const { how, proof, finalButton } = home
  return (
    <div data-act="gate">
      <section className="beat">
        <div className="wrap reveal">
          <h2 className="statement mb-8">{how.title}</h2>
          <ol className="grid gap-5 md:grid-cols-3">
            {how.steps.map((step, i) => (
              <li key={step.title} className="card">
                <span className="step-number">{i + 1}</span>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="beat">
        <div className="wrap reveal">
          <h2 className="statement mb-8">{proof.title}</h2>
          <ul className="grid gap-5 md:grid-cols-3">
            {proof.testimonials.map((t, i) => (
              <li key={i} className="card">
                <blockquote>{t.quote}</blockquote>
                <p className="mt-4 text-sm font-semibold">{t.name}</p>
                <p className="text-sm text-muted">{t.business}</p>
              </li>
            ))}
          </ul>
          <dl className="mt-8 grid gap-6 text-center sm:grid-cols-3">
            {proof.stats.map((stat) => (
              <div key={stat.label}>
                <dd className="text-4xl font-light tracking-tight text-gold">{stat.value}</dd>
                <dt className="mono mt-1 text-platinum">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>
      <FinalCta button={finalButton} tall />
    </div>
  )
}

export function Home() {
  return (
    <>
      <Rail />
      <Hero />
      <Problem />
      <Modules />
      <Finale />
    </>
  )
}
