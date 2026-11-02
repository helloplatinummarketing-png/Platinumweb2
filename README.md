# Platinum Marketing Agency — Kenya website

The marketing site for Kenyan service businesses: websites, WhatsApp automations
and AI visibility. Built from the Kenya website brief (1 Nov 2026).

Vite · TypeScript · React (build time only) · three.js · Tailwind v4.

Pages are pre-rendered to static HTML, so search engines and AI tools can read
every page without running JavaScript, and the text appears before any 3D loads.
No React runs in the browser.

## The 3D stage

A fixed canvas plays a scroll-driven film behind the page. Everything is generated
in code, with no model files, and loads as one lazy chunk of about 160 kB (gzipped).

Any element with `data-act="name"` is a chapter (`src/scene/stage.ts`). The acts are
`rise` and `lost` (`homeland.ts`), then `websites`, `whatsapp`, `ai` and `gate`
(`modules.ts`). The home page plays them all. Inner pages play one behind their hero.
On the home page, a `.transit` spacer at the end of a chapter is the empty scroll
where the camera flies to the next act.

Visitors get the still version (`public/poster.jpg` and normal sections) with
reduced motion, data saver, 2G, under 3 GB of memory, under 4 CPU cores, no WebGL or
a software GPU. If the frame rate stays low, a watchdog lowers quality and then
switches to the still version.

| Add to the URL | What it does                                                    |
| -------------- | --------------------------------------------------------------- |
| `?motion`      | Skips the device checks, e.g. with Windows animations turned off |
| `?forcewebgl`  | Also allows software GPUs and turns off the frame-rate watchdog |
| `?reduced`     | Forces the still version                                        |
| `?nowebgl`     | Forces the still version                                        |

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + static site in dist/
npm run preview    # serve dist/
npm run lint       # oxlint
```

### Deploy

The Vercel project `platinum6/platinum-3d` is connected to
[`helloplatinummarketing-png/Platinumweb2`](https://github.com/helloplatinummarketing-png/Platinumweb2).
Every push to `main` deploys to production; pushes to other branches get preview
URLs. No environment variables are needed.

## Edit the site

| What                                         | Where                 |
| -------------------------------------------- | --------------------- |
| Headlines, body text, prices, FAQs, team     | `src/content/copy.ts` |
| Domain, phone, WhatsApp, booking, form, analytics | `src/content/site.ts` |
| Colours and shared styles                    | `src/styles/index.css` |
| Page layouts                                 | `src/pages/*`         |
| Meta tags and schema markup                  | `src/render.tsx`      |

## To do before launch

Add these in `src/content/site.ts`. The site shows a fallback until each is set.

- `url`: confirm .co.ke or .com
- `phone` and `phoneE164`: Kenya phone number
- `whatsapp`: WhatsApp Business number. Until then, the floating button opens the contact form
- `bookingUrl`: Calendly or similar. It embeds on the contact page
- `formEndpoint`: Google Apps Script or a form service. Until then, the form opens the visitor's email app
- `gaId`: Google Analytics ID. Setting it also turns on the cookie banner

Add or replace this content:

- The real Platinum logo. The header currently uses `public/favicon.svg` and a text wordmark
- Testimonials and stats in `home.proof` in `copy.ts`. These are placeholders
- Team photos and bios in `about.team` in `copy.ts`. Bios are drafts
- `public/og-image.jpg`, the image shown when the site is shared on social media or WhatsApp. The current one is a text-only stand-in without the logo
