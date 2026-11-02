import { extname } from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'

// Serves the same pages in dev that scripts/prerender.mjs writes at build time.
function staticPages(): Plugin {
  return {
    name: 'static-pages',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url ?? '/').split(/[?#]/)[0].replace(/(.)\/$/, '$1')
        if (extname(path) || path.startsWith('/@') || path.startsWith('/node_modules')) return next()
        try {
          const { renderPage, routes } = await server.ssrLoadModule('/src/render.tsx')
          const html = renderPage(path, { scripts: ['/src/client.ts'], styles: [] })
          res.statusCode = routes.includes(path) ? 200 : 404
          res.setHeader('Content-Type', 'text/html')
          res.end(await server.transformIndexHtml(path, html))
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), staticPages()],
  appType: 'mpa',
  build: isSsrBuild
    ? { copyPublicDir: false, emptyOutDir: true }
    : {
        target: 'es2022',
        manifest: true,
        rolldownOptions: { input: 'src/client.ts' },
      },
}))
