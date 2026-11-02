import Link from 'next/link'
import { routes } from '@/config/site'

export default function NotFound() {
  return (
    <section className="wrap flex min-h-[70svh] flex-col items-start justify-center pt-24">
      <h1 className="display-hero text-metal">We could not find that page</h1>
      <Link href={routes.home} className="btn btn-primary mt-8">
        Back to Home
      </Link>
    </section>
  )
}
