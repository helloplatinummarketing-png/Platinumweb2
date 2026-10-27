import { stats } from '../../content/copy'
import { Anchored } from '../Anchored'
import { ShotSection } from '../ShotSection'

export function Stats() {
  return (
    <ShotSection id="stats" labelledBy="stats-title">
      <h2 id="stats-title" className="sr-only">
        Platinum in numbers
      </h2>
      <ul className="grid h-full grid-cols-2 content-end gap-x-6 gap-y-8 px-6 pb-28 md:block md:p-0">
        {stats.map((s) => (
          <li key={s.label}>
            <Anchored to={`petal:${s.petal}`}>
              <p className="headline text-4xl md:text-6xl">
                {s.prefix}
                <span data-count={s.value}>{s.value}</span>
                {s.suffix}
              </p>
              <p className="micro mt-2 text-slate-400">{s.label}</p>
            </Anchored>
          </li>
        ))}
      </ul>
    </ShotSection>
  )
}
