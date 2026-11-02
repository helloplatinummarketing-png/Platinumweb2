import { CanvasTexture, SRGBColorSpace } from 'three'
import type { FlowFrom } from '@/content/automations'
import { cssColor } from './sceneState'

const FONT = 'Inter, system-ui, sans-serif'

export function makeTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
  const lines: string[] = []
  let line = ''
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      lines.push(line)
      line = word
    } else {
      line = next
    }
  }
  if (line) lines.push(line)
  return lines
}

/** Draws a chat onto a phone screen canvas. All text comes from the content files. */
export function drawChat(canvas: HTMLCanvasElement, name: string, flow: { from: FlowFrom; text: string }[]) {
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height
  const accent = cssColor('--accent')
  ctx.fillStyle = '#07080b'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#0f1116'
  ctx.fillRect(0, 0, w, 120)
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.arc(62, 72, 28, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#e5e4e2'
  ctx.font = `600 32px ${FONT}`
  ctx.textAlign = 'left'
  ctx.fillText(name, 108, 83)

  let y = 160
  for (const item of flow) {
    if (item.from === 'event') {
      ctx.font = `500 25px ${FONT}`
      const lines = wrapLines(ctx, item.text, w - 120)
      const bh = lines.length * 34 + 24
      ctx.fillStyle = '#171a21'
      ctx.beginPath()
      ctx.roundRect(40, y, w - 80, bh, 16)
      ctx.fill()
      ctx.fillStyle = '#9ea3ad'
      ctx.textAlign = 'center'
      lines.forEach((l, i) => ctx.fillText(l, w / 2, y + 38 + i * 34))
      ctx.textAlign = 'left'
      y += bh + 22
      continue
    }
    const mine = item.from === 'customer'
    ctx.font = `400 29px ${FONT}`
    const lines = wrapLines(ctx, item.text, w - 170)
    const width = Math.max(...lines.map((l) => ctx.measureText(l).width)) + 48
    const bh = lines.length * 39 + 30
    const x = mine ? 32 : w - 32 - width
    ctx.fillStyle = mine ? '#22262f' : '#0f5c3a'
    ctx.beginPath()
    ctx.roundRect(x, y, width, bh, 20)
    ctx.fill()
    ctx.fillStyle = '#f4f3f1'
    lines.forEach((l, i) => ctx.fillText(l, x + 24, y + 44 + i * 39))
    y += bh + 20
  }
}

/** A floating labelled bubble for the WhatsApp hero. */
export function drawBubble(label: string, text: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 220
  const ctx = canvas.getContext('2d')!
  ctx.font = `500 38px ${FONT}`
  const lines = wrapLines(ctx, text, 560).slice(0, 2)
  ctx.fillStyle = '#0f5c3a'
  ctx.strokeStyle = cssColor('--accent')
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(4, 4, 632, 212, 34)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = cssColor('--accent')
  ctx.font = `600 28px ${FONT}`
  ctx.fillText(label, 36, 58)
  ctx.fillStyle = '#ffffff'
  ctx.font = `500 38px ${FONT}`
  lines.forEach((l, i) => ctx.fillText(l, 36, 118 + i * 50))
  return makeTexture(canvas)
}

/** A generic example website for the browser and phone on the Websites page. */
export function drawSite(canvas: HTMLCanvasElement, compact: boolean) {
  const ctx = canvas.getContext('2d')!
  const w = canvas.width
  const h = canvas.height
  const accent = cssColor('--accent')
  ctx.fillStyle = '#0f1116'
  ctx.fillRect(0, 0, w, h)
  const glow = ctx.createRadialGradient(w * 0.8, h * 0.2, 0, w * 0.8, h * 0.2, w * 0.8)
  glow.addColorStop(0, 'rgba(43,214,123,0.34)')
  glow.addColorStop(1, 'rgba(43,214,123,0)')
  ctx.fillStyle = glow
  ctx.fillRect(0, 0, w, h)

  const m = w * 0.07
  ctx.fillStyle = '#e5e4e2'
  ctx.font = `600 ${w * 0.04}px ${FONT}`
  ctx.fillText('Your Business', m, h * 0.1)

  ctx.font = `600 ${compact ? w * 0.105 : w * 0.07}px ${FONT}`
  const headlineLeading = compact ? w * 0.125 : w * 0.085
  ;['More', 'Customers', 'Start Here'].forEach((l, i) => ctx.fillText(l, m, h * (compact ? 0.26 : 0.3) + i * headlineLeading))

  const by = compact ? h * 0.46 : h * 0.62
  ctx.fillStyle = accent
  ctx.beginPath()
  ctx.roundRect(m, by, compact ? w * 0.5 : w * 0.22, compact ? h * 0.06 : h * 0.1, 999)
  ctx.fill()
  ctx.fillStyle = '#07080b'
  ctx.font = `600 ${compact ? w * 0.05 : w * 0.024}px ${FONT}`
  ctx.fillText('Book Now', m + (compact ? w * 0.11 : w * 0.05), by + (compact ? h * 0.04 : h * 0.062))

  const cards = compact ? 2 : 3
  const top = compact ? h * 0.58 : h * 0.78
  const gap = w * 0.025
  const cw = compact ? w - m * 2 : (w - m * 2 - gap * 2) / 3
  const ch = compact ? h * 0.15 : h * 0.16
  for (let i = 0; i < cards; i++) {
    const x = compact ? m : m + i * (cw + gap)
    const y = compact ? top + i * (ch + gap) : top
    ctx.fillStyle = '#1a1d24'
    ctx.beginPath()
    ctx.roundRect(x, y, cw, ch, 14)
    ctx.fill()
    ctx.fillStyle = '#9ea3ad'
    ctx.fillRect(x + cw * 0.08, y + ch * 0.3, cw * 0.5, ch * 0.09)
    ctx.fillRect(x + cw * 0.08, y + ch * 0.55, cw * 0.72, ch * 0.09)
  }
}
