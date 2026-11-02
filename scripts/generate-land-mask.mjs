// Generates public/textures/land-mask.png, the equirectangular texture the globe samples.
// Source: Natural Earth (public domain), through the world-atlas package.
// White = land, black = sea. Only needs re-running to change the resolution.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { deflateSync } from 'node:zlib'
import { feature } from 'topojson-client'

const WIDTH = 1440
const HEIGHT = 720

const topology = JSON.parse(readFileSync('node_modules/world-atlas/land-50m.json', 'utf8'))
const land = feature(topology, topology.objects.land)

const pixels = new Uint8Array(WIDTH * HEIGHT)

function fillPolygon(rings) {
  for (let y = 0; y < HEIGHT; y++) {
    const lat = 90 - ((y + 0.5) / HEIGHT) * 180
    const crossings = []
    for (const ring of rings) {
      for (let i = 0; i < ring.length - 1; i++) {
        const [x1, y1] = ring[i]
        const [x2, y2] = ring[i + 1]
        if (y1 > lat !== y2 > lat) crossings.push(x1 + ((lat - y1) / (y2 - y1)) * (x2 - x1))
      }
    }
    crossings.sort((a, b) => a - b)
    for (let i = 0; i + 1 < crossings.length; i += 2) {
      const from = Math.max(0, Math.round(((crossings[i] + 180) / 360) * WIDTH))
      const to = Math.min(WIDTH, Math.round(((crossings[i + 1] + 180) / 360) * WIDTH))
      pixels.fill(255, y * WIDTH + from, y * WIDTH + to)
    }
  }
}

for (const f of land.features) {
  const { type, coordinates } = f.geometry
  if (type === 'Polygon') fillPolygon(coordinates)
  else if (type === 'MultiPolygon') coordinates.forEach(fillPolygon)
}

// Minimal 8-bit greyscale PNG encoder, so no image library is needed.
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
function crc32(buffer) {
  let c = 0xffffffff
  for (const byte of buffer) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data) {
  const body = Buffer.concat([Buffer.from(type), data])
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(body))
  return Buffer.concat([length, body, crc])
}

const header = Buffer.alloc(13)
header.writeUInt32BE(WIDTH, 0)
header.writeUInt32BE(HEIGHT, 4)
header[8] = 8 // bit depth
header[9] = 0 // greyscale

const raw = Buffer.alloc((WIDTH + 1) * HEIGHT)
for (let y = 0; y < HEIGHT; y++) raw.set(pixels.subarray(y * WIDTH, (y + 1) * WIDTH), y * (WIDTH + 1) + 1)

const png = Buffer.concat([
  Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
  chunk('IHDR', header),
  chunk('IDAT', deflateSync(raw, { level: 9 })),
  chunk('IEND', Buffer.alloc(0)),
])

mkdirSync('public/textures', { recursive: true })
writeFileSync('public/textures/land-mask.png', png)
const landShare = pixels.reduce((n, v) => n + (v ? 1 : 0), 0) / pixels.length
console.log(`land-mask.png: ${WIDTH}x${HEIGHT}, ${(png.length / 1024).toFixed(1)} kB, ${(landShare * 100).toFixed(1)}% land`)
