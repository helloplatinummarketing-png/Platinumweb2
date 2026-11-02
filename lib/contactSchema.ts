import { z } from 'zod'
import { needOptions } from '@/content/contact'

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  business: z.string().trim().min(2).max(160),
  phone: z.string().trim().regex(/^[+\d][\d\s()-]{6,24}$/),
  // Many customers prefer the phone, so email is optional. If given, it must be valid.
  email: z.union([z.literal(''), z.email().max(200)]),
  need: z.enum(needOptions),
  // Honeypot: hidden from people, so only bots fill it in.
  website: z.string().max(200).optional(),
})

export type ContactSubmission = z.infer<typeof contactSchema>
