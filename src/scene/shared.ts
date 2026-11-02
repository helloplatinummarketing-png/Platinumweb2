import { AdditiveBlending, CanvasTexture, Group, SRGBColorSpace, Sprite, SpriteMaterial, Vector2, Vector3 } from 'three'

export const GOLD = 0xd4af37
export const GOLD_HOT = 0xffc861
export const PLATINUM = 0xc9ccd1

export interface Quality {
  mobile: boolean
}

export interface Pose {
  pos: Vector3
  target: Vector3
}

/** One chapter of the film. `p` runs 0 to 1 while its section is on screen. */
export interface Act {
  group: Group
  pose(p: number, out: Pose): void
  update(p: number, t: number, dt: number, pointer: Vector2): void
  /** 1 = full sunset sky, 0 = night. */
  sky?(p: number): number
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}

/** Small seeded generator, so the world is identical on every visit. */
export function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

let glow: CanvasTexture | null = null

export function glowTexture() {
  if (glow) return glow
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.2, 'rgba(255,255,255,0.45)')
  g.addColorStop(0.5, 'rgba(255,255,255,0.1)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  glow = new CanvasTexture(canvas)
  return glow
}

export function glowSprite(color: number, scale: number, opacity = 1) {
  const sprite = new Sprite(
    new SpriteMaterial({ map: glowTexture(), color, opacity, blending: AdditiveBlending, depthWrite: false, transparent: true }),
  )
  sprite.scale.setScalar(scale)
  return sprite
}

export function canvasTexture(canvas: HTMLCanvasElement) {
  const texture = new CanvasTexture(canvas)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  return texture
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.roundRect(x, y, w, h, r)
}

/** Draws wrapped text and returns the y position below it. */
export function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) {
  let line = ''
  let cursor = y
  for (const word of text.split(' ')) {
    const next = line ? `${line} ${word}` : word
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursor)
      cursor += lineHeight
      line = word
    } else {
      line = next
    }
  }
  ctx.fillText(line, x, cursor)
  return cursor + lineHeight
}
