import Link from 'next/link'
import { routes } from '@/config/site'

interface PageHeroProps {
  title: string
  sub?: string
  button?: string
  /** The page's 3D element. It sits beside the text on desktop and below it on phones. */
  children?: React.ReactNode
}

export function PageHero({ title, sub, button, children }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden lg:min-h-svh">
      <div className="wrap relative z-10 grid items-center gap-4 pt-24 lg:min-h-svh lg:grid-cols-[1.1fr_1fr] lg:pt-16">
        <div>
          <h1 className="display-page text-metal">{title}</h1>
          {sub && <p className="mt-5 max-w-xl text-lg sm:text-xl">{sub}</p>}
          {button && (
            <Link href={routes.contact} className="btn btn-primary mt-7">
              {button}
            </Link>
          )}
        </div>
        <div className="scene-slot relative h-[52svh] lg:h-[78svh]">{children}</div>
      </div>
    </section>
  )
}
