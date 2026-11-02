import { ImageResponse } from 'next/og'
import { site } from '@/config/site'
import { home } from '@/content/home'

export const alt = `${site.name}: ${home.hero.title}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

/** The image shown when a page is shared on WhatsApp or social media. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: 80,
        color: '#e5e4e2',
        backgroundColor: '#07080b',
        backgroundImage: 'radial-gradient(circle at 85% 110%, rgba(43,214,123,0.42), transparent 55%)',
      }}
    >
      <div style={{ fontSize: 30, letterSpacing: 4, color: '#9ea3ad' }}>PLATINUM MARKETING AGENCY</div>
      <div style={{ fontSize: 84, lineHeight: 1.05, marginTop: 30, maxWidth: 950, fontWeight: 600 }}>{home.hero.title}</div>
      <div style={{ fontSize: 30, marginTop: 36, color: '#2bd67b' }}>{site.location}</div>
    </div>,
    size,
  )
}
