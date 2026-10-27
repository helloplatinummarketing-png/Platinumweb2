import { useState } from 'react'
import { Scene } from './scene/Scene'
import { sceneState, type SceneState } from './scene/state'

// Start the preview mid-ignition so materials and bloom are visible straight away.
Object.assign(sceneState, { unfold: 0.9, litCount: 4, charge: 0.4 })

type NumericKey = { [K in keyof SceneState]: SceneState[K] extends number ? K : never }[keyof SceneState]

const CONTROLS: { key: NumericKey; min: number; max: number; step: number }[] = [
  { key: 'assemble', min: 0, max: 1, step: 0.01 },
  { key: 'unfold', min: 0, max: 1, step: 0.01 },
  { key: 'litCount', min: 0, max: 12, step: 0.05 },
  { key: 'charge', min: 0, max: 1, step: 0.01 },
  { key: 'scatter', min: 0, max: 1, step: 0.01 },
  { key: 'flicker', min: 0, max: 1, step: 0.01 },
  { key: 'cold', min: 0, max: 1, step: 0.01 },
  { key: 'hubSpin', min: 0, max: 4, step: 0.05 },
]

/** Step 2 review panel: drives the shared scene state by hand. Removed once the timeline lands. */
function CorePreviewPanel() {
  const [values, setValues] = useState(() => Object.fromEntries(CONTROLS.map((c) => [c.key, sceneState[c.key]])))
  return (
    <div className="fixed top-4 right-4 z-10 w-64 space-y-2 border border-white/10 bg-white/5 p-4 font-mono text-[10px] tracking-widest text-slate-300 uppercase backdrop-blur-md">
      <div className="mb-3 text-gold">Platinum Core / Preview</div>
      {CONTROLS.map(({ key, min, max, step }) => (
        <label key={key} className="block">
          <span className="flex justify-between">
            {key}
            <span className="text-ink">{Number(values[key]).toFixed(2)}</span>
          </span>
          <input
            className="w-full accent-[#d4af37]"
            type="range"
            min={min}
            max={max}
            step={step}
            value={values[key]}
            onChange={(e) => {
              const v = Number(e.target.value)
              sceneState[key] = v
              setValues((prev) => ({ ...prev, [key]: v }))
            }}
          />
        </label>
      ))}
    </div>
  )
}

export default function App() {
  return (
    <>
      <div className="fixed inset-0">
        <Scene />
      </div>
      <CorePreviewPanel />
    </>
  )
}
