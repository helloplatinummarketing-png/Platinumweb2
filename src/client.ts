/**
 * The first JavaScript visitors download. The site still reads and navigates
 * without it. The 3D stage is a separate chunk, loaded only on capable devices.
 */
import '@fontsource-variable/inter-tight/wght.css'
import './styles/index.css'

const CONSENT_KEY = 'platinum-analytics-consent'

function initStage() {
  const root = document.documentElement
  const canvas = document.querySelector<HTMLCanvasElement>('[data-stage]')
  if (!root.classList.contains('stage')) return
  if (!canvas || !document.querySelector('[data-act]')) {
    root.classList.remove('stage')
    return
  }

  root.classList.add('reveal-on')
  const reveals = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) entry.target.classList.toggle('in', entry.isIntersecting)
    },
    { rootMargin: '-12% 0px -12% 0px' },
  )
  document.querySelectorAll('.reveal').forEach((el) => reveals.observe(el))

  const rail = document.querySelector('.rail')
  if (rail) {
    const chapters = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const link = rail.querySelector(`[data-rail-link="${(entry.target as HTMLElement).dataset.rail}"]`)
          link?.setAttribute('aria-current', String(entry.isIntersecting))
        }
        rail.classList.toggle('on', !!rail.querySelector('[aria-current="true"]'))
      },
      { rootMargin: '-50% 0px -50% 0px' },
    )
    document.querySelectorAll('[data-rail]').forEach((el) => chapters.observe(el))
  }

  import('./scene/stage.ts')
    .then(({ start }) => start(canvas))
    .catch((error: unknown) => {
      // No WebGL, or a device that can't run it: show the normal page instead.
      console.info('3D stage off:', error)
      root.classList.remove('stage', 'reveal-on')
    })
}

initStage()

// Close the mobile menu when tapping elsewhere or following a link on the same page.
const menu = document.querySelector<HTMLDetailsElement>('[data-menu]')
document.addEventListener('click', (event) => {
  if (!menu?.open) return
  const target = event.target as Element
  if (!menu.contains(target) || target.closest('a')) menu.open = false
})

function initContactForm(form: HTMLFormElement) {
  const status = form.querySelector<HTMLElement>('[data-form-status]')!
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!
  const { endpoint, email, sending, sent, failed, opened } = form.dataset

  form.addEventListener('submit', async (event) => {
    event.preventDefault()
    const data = new FormData(form)

    // No form service connected yet: hand the details to the visitor's email app.
    if (!endpoint) {
      const lines = [...data.entries()].map(([key, value]) => `${key}: ${String(value)}`)
      const subject = encodeURIComponent(`Free AI Visibility Check: ${String(data.get('business'))}`)
      window.location.href = `mailto:${email}?subject=${subject}&body=${encodeURIComponent(lines.join('\n'))}`
      status.textContent = opened ?? ''
      return
    }

    button.disabled = true
    status.textContent = sending ?? ''
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new URLSearchParams(data as unknown as Record<string, string>),
      })
      if (!res.ok) throw new Error(String(res.status))
      form.reset()
      status.textContent = sent ?? ''
    } catch {
      status.textContent = failed ?? ''
    } finally {
      button.disabled = false
    }
  })
}

const contactForm = document.querySelector<HTMLFormElement>('[data-contact-form]')
if (contactForm) initContactForm(contactForm)

function readConsent() {
  try {
    return localStorage.getItem(CONSENT_KEY)
  } catch {
    return null
  }
}

function loadAnalytics(id: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.append(script)
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  // gtag reads the arguments object itself, so this can't be an array.
  function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', id)
}

function initConsent(id: string) {
  const choice = readConsent()
  if (choice === 'accepted') loadAnalytics(id)
  if (choice) return

  const banner = document.querySelector<HTMLElement>('[data-consent]')
  if (!banner) return
  banner.hidden = false
  banner.addEventListener('click', (event) => {
    const value = (event.target as Element).closest<HTMLElement>('[data-consent-choice]')?.dataset.consentChoice
    if (!value) return
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // Private browsing: the choice just won't be remembered.
    }
    banner.hidden = true
    if (value === 'accepted') loadAnalytics(id)
  })
}

const gaId = document.body.dataset.ga
if (gaId) initConsent(gaId)
