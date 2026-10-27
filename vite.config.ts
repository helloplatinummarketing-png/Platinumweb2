import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// Leaf libraries only (they depend on nothing but each other). React-based
// packages such as @react-three/fiber stay with the lazy Scene chunk, because
// splitting them away from React breaks chunk initialisation order.
const VENDOR_GROUPS: [string, RegExp][] = [
  ['three', /node_modules[/\\]three[/\\]/],
  ['fx', /node_modules[/\\]postprocessing[/\\]/],
  ['motion', /node_modules[/\\](gsap|lenis)[/\\]/],
]

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: 'es2022',
    // three.js core alone is ~700 kB minified. It is split into its own chunk and
    // only loaded after first paint (the scene is lazy), so this is expected.
    chunkSizeWarningLimit: 800,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: VENDOR_GROUPS.map(([name, test]) => ({ name, test })),
        },
      },
    },
  },
})
