import { cta, notFound } from '../content/copy.ts'
import { paths } from '../content/site.ts'
import { Button, PageHero } from '../ui/parts.tsx'

export function NotFound() {
  return (
    <PageHero act="gate" title={notFound.title} sub={notFound.body}>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href={paths.home}>{notFound.home}</Button>
        <Button href={paths.contact} variant="ghost">
          {cta.book}
        </Button>
      </div>
    </PageHero>
  )
}
