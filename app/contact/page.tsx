import type { Metadata } from 'next'
import { routes, site, whatsappHref } from '@/config/site'
import { contact } from '@/content/contact'
import { ContactForm } from '@/components/contact/ContactForm'
import { MapEmbed } from '@/components/contact/MapEmbed'
import { ParticleBackdrop } from '@/components/sections/Backdrops'

export const metadata: Metadata = {
  title: { absolute: `${contact.meta.title} | Platinum Marketing Agency` },
  description: contact.meta.description,
  alternates: { canonical: routes.contact },
  openGraph: { title: contact.meta.title, description: contact.meta.description, url: routes.contact, images: ['/opengraph-image'] },
}

export default function ContactPage() {
  return (
    <>
      <section className="relative overflow-hidden pt-32 pb-14 sm:pt-40 sm:pb-20">
        <ParticleBackdrop count={2200} opacity={0.75} />
        <div className="wrap relative">
          <h1 className="display-hero text-metal max-w-5xl">{contact.title}</h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl">{contact.sub}</p>
        </div>
      </section>

      <section className="relative z-10 pb-20 sm:pb-28">
        <div className="wrap grid items-start gap-5 lg:grid-cols-2">
          <ContactForm />
          <div className="space-y-5">
            <div className="panel">
              <h2 className="font-display text-2xl font-medium">{contact.bookingTitle}</h2>
              {site.calendlyUrl ? (
                <iframe src={site.calendlyUrl} title={contact.bookingFrameTitle} loading="lazy" className="mt-4 h-[640px] w-full rounded-xl border-0" />
              ) : (
                <p className="mt-3 rounded-xl border border-dashed border-border-strong p-6 text-silver">{contact.bookingPlaceholder}</p>
              )}
            </div>
            <div className="panel">
              <h2 className="font-display text-2xl font-medium">{contact.directTitle}</h2>
              <a href={whatsappHref()} target="_blank" rel="noopener" className="btn btn-primary mt-5 w-full">
                {contact.whatsapp}
              </a>
              <ul className="mt-5 space-y-3">
                <li>
                  <a href={`mailto:${site.email}`} className="font-semibold wrap-anywhere underline underline-offset-4">
                    {site.email}
                  </a>
                </li>
                <li>
                  {site.phoneE164 ? (
                    <a href={`tel:${site.phoneE164}`} className="font-semibold underline underline-offset-4">
                      {site.phoneDisplay}
                    </a>
                  ) : (
                    <span className="font-semibold">{site.phoneDisplay}</span>
                  )}
                </li>
                <li>
                  {site.location}
                  <span className="block text-sm text-silver">{contact.remote}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <MapEmbed src={site.mapEmbedUrl} title={contact.mapTitle} />
    </>
  )
}
