import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const config = [
  ...nextVitals,
  ...nextTs,
  {
    // R3F frame loops deliberately mutate three.js objects outside React's render.
    files: ['components/three/**'],
    rules: { 'react-hooks/immutability': 'off' },
  },
  { ignores: ['.next/**', 'scripts/**'] },
]

export default config
