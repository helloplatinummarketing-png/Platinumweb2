# Platinum Marketing Agency — Kenya website

The marketing site for Kenyan service businesses: Websites, WhatsApp Automations and
AI Visibility (GEO). All page copy and prices come from [`BRIEF.md`](BRIEF.md).

Next.js (App Router) · TypeScript · Tailwind CSS · three.js with React Three Fiber and
drei · GSAP ScrollTrigger · Lenis · zod · Resend.

## Run it

```bash
npm install
cp .env.example .env.local   # only needed to test the contact form
npm run dev                  # http://localhost:3000
npm run build && npm start   # production build
npm run lint
```

## Edit the content

Nothing here requires touching a component.

| What | Where |
| --- | --- |
| Domain, email, phone, WhatsApp number and message, Calendly, map, GA4 | `config/site.ts` |
| Stats bar numbers | `config/stats.ts` |
| Home page copy, trust badge, example dashboard, testimonials | `content/home.ts` |
| Service copy, prices, FAQs | `content/websites.ts`, `content/automations.ts`, `content/geo.ts` |
| About copy, team, values | `content/about.ts` |
| Contact copy and dropdown options | `content/contact.ts` |
| Pricing page copy and bundle banner | `content/pricing.ts` |
| Navigation and footer | `content/navigation.ts` |
| Colours | The variables at the top of `app/globals.css`. The 3D reads most of these too |

Some 3D materials hard-code the palette and need changing by hand if the colours change:
`ServiceObjects.tsx`, `ServiceStage.tsx`, `PhoneBody.tsx`, `DevicePairCanvas.tsx`,
`NairobiMapCanvas.tsx` and the bubble and site drawings in `screens.ts`.

## Placeholders to replace

Search the code for `TODO(Victor)` to find all of these.

| Item | File | Until it's replaced |
| --- | --- | --- |
| Domain: `.co.ke` or `.com` | `config/site.ts` | Canonical URLs, schema and sitemap use `.co.ke` |
| Public email address | `config/site.ts` | Uses the existing Gmail address |
| Kenya phone number | `config/site.ts` | Shows `+254 7XX XXX XXX`, with no link |
| WhatsApp Business number | `config/site.ts` | **WhatsApp buttons don't work.** The number is invalid on purpose |
| Prefilled WhatsApp message | `config/site.ts` | Uses a suggested message |
| Calendly URL | `config/site.ts` | Contact page shows a marked placeholder |
| GA4 ID (optional) | `config/site.ts` | No Google Analytics and no cookie banner |
| Stats bar numbers | `config/stats.ts` | Show "X" with a Placeholder tag. Real numbers count up on scroll |
| Google rating | `content/home.ts` | Shows "★ 5.0 · Google Reviews" with a Placeholder tag |
| Testimonials | `content/home.ts` | Three marked placeholder cards. Also delete the tag in `Testimonials.tsx` |
| Example dashboard numbers | `content/home.ts` | Illustrative only. The panel says it's an example |
| Team photos and bios | `content/about.ts` | Placeholder image and "One-line bio goes here." |
| Final logo | `components/layout/Logo.tsx`, `app/icon.svg` | The existing sunburst mark, in brushed platinum |

## Contact form

The form posts to `app/api/contact/route.ts`, which validates with zod and ignores anything
that fills in the hidden honeypot field. It reports success if at least one destination
receives the enquiry. Set these in `.env.local` and in Vercel:

| Variable | Purpose |
| --- | --- |
| `RESEND_API_KEY` | Resend API key |
| `CONTACT_TO_EMAIL` | Where enquiries go |
| `CONTACT_FROM_EMAIL` | Sender. Must be on a domain verified in Resend |
| `GOOGLE_SHEETS_WEBHOOK_URL` | Optional: also posts each enquiry as JSON to this URL |

**With none of these set, the form shows an error and no enquiry is delivered.**

## Deploy to Vercel

1. Import the repository in Vercel. It detects Next.js, so no build settings are needed.
2. Add the environment variables above, for Production and Preview.
3. Set the final domain in `config/site.ts` and add it in Vercel under Domains.
4. In Vercel, turn on Web Analytics if you want it. The tracking code only loads on Vercel.

Every branch gets a preview URL, and pushes to the production branch (`main`) go live.

## How the 3D works

- **One globe component:** `components/three/Globe.tsx`. `GlobeHost.tsx` keeps a single instance
  fixed behind the home page, and one scroll timeline drives it through `globeControls.ts`.
  About uses the same component in a calm mode.
- **Scroll state:** timelines write to plain objects (`globeControls`, `morphState`, `sceneState`)
  and render loops read them, so scrolling doesn't re-render React.
- **Shared canvas:** the home service cards use one canvas with drei `<View>`s (`ServiceStage.tsx`).
- **Loading:** every canvas is lazy-loaded with `next/dynamic` and mounts after first paint
  (`useDeviceProfile.ts`). Canvases pause while off-screen.
- **Pinned sections need a parent element.** GSAP wraps a pinned element in its own spacer. Without
  a stable parent `<div>` around the pinned section, React crashes when leaving the page.
- **Land mask:** `npm run landmask` regenerates `public/textures/land-mask.png` from public-domain
  Natural Earth data. It only needs re-running to change the resolution.

### Device fallbacks (`components/three/device.ts`)

| Condition | What the visitor gets |
| --- | --- |
| Phones, or 4 or fewer CPU cores, or 4 GB of memory or less | 3D starts on first touch or scroll, or after 5 seconds. About 60% fewer particles, no bloom, resolution capped at 1.5x |
| Frame rate drops on the home globe | Bloom turns off and resolution falls to 1x |
| `prefers-reduced-motion` | No pinning, morphing or smooth scroll. Static end states and normal text |
| No WebGL, software graphics, data saver or 2G | No 3D. Gradient posters and all the normal text |

For testing, add `?forcewebgl` to allow software graphics, or `?nowebgl` to turn the 3D off.
