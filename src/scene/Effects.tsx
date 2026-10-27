import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

interface EffectsProps {
  /** 'high' = desktop; 'low' = phones or a struggling GPU. */
  quality?: 'high' | 'low'
}

/**
 * Bloom is thresholded high so only the gold emissive panels and core glow;
 * metals and haze stay crisp. Tone mapping runs last in the chain.
 *
 * Depth of field was cut in the performance pass: its bokeh shaders took
 * seconds to compile on a cold cache with integrated GPUs. To bring it back on
 * desktop, add `<DepthOfField focusDistance={8} focusRange={7} bokehScale={2} />`
 * first in the 'high' chain and point its `target` at sceneState.camera.target.
 */
export function Effects({ quality = 'high' }: EffectsProps) {
  const high = quality === 'high'
  return (
    <EffectComposer multisampling={0}>
      <Bloom
        mipmapBlur
        luminanceThreshold={high ? 0.95 : 1}
        luminanceSmoothing={0.15}
        intensity={high ? 1.1 : 0.6}
        radius={high ? 0.75 : 0.6}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={high ? 0.35 : 0} />
      <Vignette offset={0.25} darkness={0.75} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
