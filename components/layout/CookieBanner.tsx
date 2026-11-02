'use client'

import { useEffect, useState } from 'react'
import { consent } from '@/content/navigation'

const KEY = 'platinum-analytics-consent'

function loadGa(id: string) {
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`
  document.head.append(script)
  const w = window as unknown as { dataLayer: unknown[] }
  w.dataLayer = w.dataLayer || []
  // gtag reads the arguments object itself, so this can't take an array.
  function gtag(..._args: unknown[]) {
    void _args
    // eslint-disable-next-line prefer-rest-params
    w.dataLayer.push(arguments)
  }
  gtag('js', new Date())
  gtag('config', id)
}

function read() {
  try {
    return localStorage.getItem(KEY)
  } catch {
    return null
  }
}

/** Non-essential cookies stay off unless the visitor accepts. */
export function CookieBanner({ gaId }: { gaId: string }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const choice = read()
    if (choice === 'accepted') loadGa(gaId)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after mount
    if (!choice) setVisible(true)
  }, [gaId])

  function choose(value: 'accepted' | 'declined') {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      // Private browsing: the choice just isn't remembered.
    }
    setVisible(false)
    if (value === 'accepted') loadGa(gaId)
  }

  if (!visible) return null
  return (
    <div role="region" aria-label="Cookies" className="fixed inset-x-4 bottom-20 z-50 mx-auto flex max-w-xl flex-wrap items-center justify-between gap-3 rounded-2xl border border-border-strong bg-surface p-4 text-sm lg:bottom-6">
      <p>{consent.text}</p>
      <div className="flex gap-2">
        <button type="button" className="btn btn-ghost !min-h-11" onClick={() => choose('declined')}>
          {consent.decline}
        </button>
        <button type="button" className="btn btn-primary !min-h-11" onClick={() => choose('accepted')}>
          {consent.accept}
        </button>
      </div>
    </div>
  )
}
