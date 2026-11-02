// Writes every page to dist/ as static HTML, plus the 404 page, sitemap and robots.txt.
// Runs after both Vite builds (see "build" in package.json).
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = 'dist'
const { renderPage, routes, siteUrl } = await import(pathToFileURL('node_modules/.ssr/render.js').href)

const manifest = JSON.parse(await readFile(join(DIST, '.vite/manifest.json'), 'utf8'))
const entry = manifest['src/client.ts']
const assets = {
  scripts: [`/${entry.file}`],
  styles: (entry.css ?? []).map((file) => `/${file}`),
}

async function write(file, content) {
  const target = join(DIST, file)
  await mkdir(dirname(target), { recursive: true })
  await writeFile(target, content)
}

for (const route of routes) {
  await write(route === '/' ? 'index.html' : `${route.slice(1)}.html`, renderPage(route, assets))
}
await write('404.html', renderPage('/404', assets))

const urls = routes.map((route) => `  <url><loc>${siteUrl}${route === '/' ? '' : route}</loc></url>`)
await write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
)
await write('robots.txt', `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`)

await rm(join(DIST, '.vite'), { recursive: true })
console.log(`Prerendered ${routes.length} pages + 404`)
