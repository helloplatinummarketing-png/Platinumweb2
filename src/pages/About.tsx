import { about, cta } from '../content/copy.ts'
import { FinalCta, PageHero, Section } from '../ui/parts.tsx'

function initials(name: string) {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
}

export function About() {
  return (
    <>
      <PageHero act="rise" title={about.title} />
      <Section>
        <div className="max-w-3xl space-y-5 text-lg">
          {about.story.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </Section>
      <Section title={about.teamTitle} tone="tint">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {about.team.map((person) => (
            <li key={person.name} className="card">
              {/* Placeholder until team photos are supplied. */}
              <div className="flex size-20 items-center justify-center rounded-full border border-gold/50 bg-navy text-xl font-semibold text-gold" aria-hidden="true">
                {initials(person.name)}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{person.name}</h3>
              <p className="eyebrow mt-1">{person.role}</p>
              <p className="mt-3 text-sm text-muted">{person.bio}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section title={about.valuesTitle}>
        <ul className="grid gap-8 md:grid-cols-3">
          {about.values.map((value) => (
            <li key={value.title} className="border-t-2 border-gold pt-4">
              <h3 className="text-lg font-semibold">{value.title}</h3>
              <p className="mt-2 text-muted">{value.body}</p>
            </li>
          ))}
        </ul>
      </Section>
      <FinalCta button={cta.book} />
    </>
  )
}
