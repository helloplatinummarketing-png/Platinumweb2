import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { site } from '@/config/site'
import { contactSchema, type ContactSubmission } from '@/lib/contactSchema'

async function sendEmail(data: ContactSubmission) {
  const key = process.env.RESEND_API_KEY
  const to = process.env.CONTACT_TO_EMAIL
  const from = process.env.CONTACT_FROM_EMAIL
  if (!key || !to || !from) return null

  const { error } = await new Resend(key).emails.send({
    from,
    to,
    ...(data.email ? { replyTo: data.email } : {}),
    subject: `New enquiry: ${data.business}`,
    text: [
      `Name: ${data.name}`,
      `Business: ${data.business}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email || 'Not given'}`,
      `Needs help with: ${data.need}`,
      '',
      `Sent from ${site.url}`,
    ].join('\n'),
  })
  if (error) throw new Error(`Resend: ${error.name}`)
  return true
}

async function sendToSheet(data: ContactSubmission) {
  const url = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  if (!url) return null

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: data.name,
      business: data.business,
      phone: data.phone,
      email: data.email,
      need: data.need,
      submittedAt: new Date().toISOString(),
    }),
    signal: AbortSignal.timeout(8000),
  })
  if (!response.ok) throw new Error(`Sheets webhook: ${response.status}`)
  return true
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'invalid', fields: Object.keys(z.flattenError(parsed.error).fieldErrors) }, { status: 400 })
  }

  // A bot filled in the hidden field. Tell it everything went fine and do nothing.
  if (parsed.data.website) return NextResponse.json({ ok: true })

  const results = await Promise.allSettled([sendEmail(parsed.data), sendToSheet(parsed.data)])
  for (const result of results) {
    // Logs the reason only, never the visitor's details.
    if (result.status === 'rejected') console.error('Contact form delivery failed:', String(result.reason))
  }

  // Succeeds if at least one configured destination received it.
  if (results.some((r) => r.status === 'fulfilled' && r.value === true)) return NextResponse.json({ ok: true })

  if (results.every((r) => r.status === 'fulfilled')) console.error('Contact form: no delivery destination is configured.')
  return NextResponse.json({ error: 'delivery' }, { status: 502 })
}
