import { contact } from '../content/copy.ts'
import { site } from '../content/site.ts'
import { Icon } from '../ui/Icon.tsx'
import { whatsappHref } from '../ui/Layout.tsx'
import { PageHero, Section } from '../ui/parts.tsx'

function ContactForm() {
  const { form } = contact
  return (
    <form
      id="details"
      data-contact-form
      data-endpoint={site.formEndpoint ?? undefined}
      data-email={site.email}
      data-sending={form.sending}
      data-sent={form.sent}
      data-failed={form.failed}
      data-opened={form.opened}
      action={site.formEndpoint ?? `mailto:${site.email}`}
      method="post"
      className="card scroll-mt-24 space-y-4"
    >
      <h2 className="text-xl font-semibold">{contact.formTitle}</h2>
      <label className="field">
        {form.name}
        <input name="name" required autoComplete="name" />
      </label>
      <label className="field">
        {form.business}
        <input name="business" required autoComplete="organization" />
      </label>
      <label className="field">
        {form.phone}
        <input name="phone" type="tel" required autoComplete="tel" />
      </label>
      <label className="field">
        {form.email}
        <input name="email" type="email" autoComplete="email" />
      </label>
      <label className="field">
        {form.need}
        <select name="need" required defaultValue="">
          <option value="" disabled>
            {form.needPrompt}
          </option>
          {form.needs.map((need) => (
            <option key={need}>{need}</option>
          ))}
        </select>
      </label>
      <button type="submit" className="btn btn-primary w-full">
        {form.submit}
      </button>
      <p data-form-status role="status" className="text-sm" />
    </form>
  )
}

function Booking() {
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{contact.bookingTitle}</h2>
      {site.bookingUrl ? (
        <iframe src={site.bookingUrl} title={contact.bookingTitle} loading="lazy" className="mt-4 h-[640px] w-full rounded-lg border-0" />
      ) : (
        <p className="mt-3 text-muted">{contact.bookingPending}</p>
      )}
    </div>
  )
}

function Direct() {
  const whatsapp = whatsappHref()
  return (
    <div className="card">
      <h2 className="text-xl font-semibold">{contact.directTitle}</h2>
      <ul className="mt-4 space-y-3">
        <li className="flex items-center gap-3">
          <Icon name="whatsapp" className="size-5 shrink-0 text-whatsapp-soft" />
          {whatsapp ? (
            <a href={whatsapp} target="_blank" rel="noopener" className="font-semibold underline">
              {contact.whatsapp}
            </a>
          ) : (
            <span className="text-muted">{contact.whatsappPending}</span>
          )}
        </li>
        <li className="flex items-center gap-3">
          <Icon name="phone" className="size-5 shrink-0 text-gold-soft" />
          {site.phone && site.phoneE164 ? (
            <a href={`tel:${site.phoneE164}`} className="font-semibold underline">
              {site.phone}
            </a>
          ) : (
            <span className="text-muted">{contact.phonePending}</span>
          )}
        </li>
        <li className="flex items-center gap-3">
          <Icon name="mail" className="size-5 shrink-0 text-gold-soft" />
          <a href={`mailto:${site.email}`} className="min-w-0 text-sm font-semibold wrap-anywhere underline">
            {site.email}
          </a>
        </li>
        <li className="flex gap-3">
          <Icon name="pin" className="size-5 shrink-0 text-gold-soft" />
          <span>
            {site.location}
            <span className="block text-sm text-muted">{contact.remote}</span>
          </span>
        </li>
      </ul>
    </div>
  )
}

export function Contact() {
  return (
    <>
      <PageHero act="gate" title={contact.title} sub={contact.sub} />
      <Section tone="tint">
        <div className="grid items-start gap-5 lg:grid-cols-2">
          <ContactForm />
          <div className="space-y-5">
            <Booking />
            <Direct />
          </div>
        </div>
      </Section>
      <iframe src={site.mapEmbed} title={contact.mapTitle} loading="lazy" className="block h-72 w-full border-0" />
    </>
  )
}
