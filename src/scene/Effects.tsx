import { Bloom, DepthOfField, EffectComposer, Noise, ToneMapping, Vignette } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode, type DepthOfFieldEffect } from 'postprocessing'
import { useEffect, useRef } from 'react'
import { sceneState } from './state'

interface EffectsProps {
  /** 'high' = desktop with depth of field; 'low' = phones or a struggling GPU. */
  quality?: 'high' | 'low'
}

/**
 * Bloom is thresholded high so only the gold emissive panels and core glow;
 * metals and haze stay crisp. Depth of field (desktop only) keeps the camera's
 * current target in focus. Tone mapping runs last in the chain.
 */
export function Effects({ quality = 'high' }: EffectsProps) {
  const dof = useRef<DepthOfFieldEffect>(null)

  useEffect(() => {
    // A live reference: the timeline moves this vector, focus follows.
    if (dof.current) dof.current.target = sceneState.camera.target
  }, [quality])

  if (quality === 'low') {
    return (
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur luminanceThreshold={1} luminanceSmoothing={0.15} intensity={0.6} radius={0.6} />
        <Vignette offset={0.25} darkness={0.7} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      </EffectComposer>
    )
  }

  return (
    <EffectComposer multisampling={0}>
      <DepthOfField ref={dof} focusDistance={8} focusRange={7} bokehScale={2.2} resolutionScale={0.5} />
      <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.15} intensity={1.1} radius={0.75} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      <Vignette offset={0.25} darkness={0.75} />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
    </EffectComposer>
  )
}
