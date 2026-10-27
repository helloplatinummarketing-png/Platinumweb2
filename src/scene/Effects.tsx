import { Bloom, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'

interface EffectsProps {
  /** Lower bloom on mobile / degraded performance. */
  quality?: 'high' | 'low'
}

/**
 * Bloom is thresholded high so only the gold emissive panels and core glow;
 * metals and haze stay crisp. Tone mapping runs last in the chain.
 */
export function Effects({ quality = 'high' }: EffectsProps) {
  return (
    <EffectComposer multisampling={quality === 'high' ? 4 : 0}>
      <Bloom
        mipmapBlur
        luminanceThreshold={0.95}
        luminanceSmoothing={0.15}
        intensity={quality === 'high' ? 1.1 : 0.7}
        radius={0.75}
      />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      <Vignette offset={0.25} darkness={0.75} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
