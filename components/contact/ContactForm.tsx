'use client'

import { useState, type FormEvent } from 'react'
import { contact, needOptions } from '@/content/contact'

type Status = 'idle' | 'sending' | 'sent' | 'failed' | 'invalid'

export function ContactForm() {
  const { form, formTitle } = contact
  const [status, setStatus] = useState<Status>('idle')
  const [badFields, setBadFields] = useState<string[]>([])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const element = event.currentTarget
    setStatus('sending')
    setBadFields([])
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(element))),
      })
      if (response.ok) {
        element.reset()
        setStatus('sent')
        return
      }
      const result = (await response.json().catch(() => ({}))) as { fields?: string[] }
      if (response.status === 400 && result.fields) {
        setBadFields(result.fields)
        setStatus('invalid')
        return
      }
      setStatus('failed')
    } catch {
      setStatus('failed')
    }
  }

  const fieldProps = (name: string) => ({
    name,
    id: `contact-${name}`,
    'aria-invalid': badFields.includes(name) || undefined,
    className: 'form-field',
  })

  const message = { sent: form.sent, failed: form.failed, invalid: form.fixFields, sending: form.sending, idle: '' }[status]

  return (
    <form onSubmit={submit} className="panel space-y-4" noValidate={false}>
      <h2 className="font-display text-2xl font-medium">{formTitle}</h2>
      <div>
        <label htmlFor="contact-name" className="form-label">{form.name}</label>
        <input {...fieldProps('name')} required minLength={2} autoComplete="name" />
      </div>
      <div>
        <label htmlFor="contact-business" className="form-label">{form.business}</label>
        <input {...fieldProps('business')} required minLength={2} autoComplete="organization" />
      </div>
      <div>
        <label htmlFor="contact-phone" className="form-label">{form.phone}</label>
        <input {...fieldProps('phone')} type="tel" required autoComplete="tel" />
      </div>
      <div>
        <label htmlFor="contact-email" className="form-label">{form.email}</label>
        <input {...fieldProps('email')} type="email" autoComplete="email" />
      </div>
      <div>
        <label htmlFor="contact-need" className="form-label">{form.need}</label>
        <select {...fieldProps('need')} required defaultValue="">
          <option value="" disabled>
            {form.needPrompt}
          </option>
          {needOptions.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </div>
      {/* Honeypot: off-screen and skipped by keyboard and screen readers, so only bots fill it in. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <button type="submit" className="btn btn-primary w-full disabled:opacity-60" disabled={status === 'sending'}>
        {status === 'sending' ? form.sending : form.submit}
      </button>
      <p role="status" className={`min-h-6 text-sm ${status === 'sent' ? 'text-accent' : 'text-platinum'}`}>
        {message}
      </p>
    </form>
  )
}
