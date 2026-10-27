import * as THREE from 'three'

export const GOLD = new THREE.Color('#d4af37')
export const PLATINUM = new THREE.Color('#c9ccd1')
export const GRAPHITE = new THREE.Color('#2a2d33')
export const COLD = new THREE.Color('#5b8cff')

/** Fine directional streaks used as a roughness map for brushed metal. */
export function createBrushedTexture(size = 512) {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'rgb(128,128,128)'
  ctx.fillRect(0, 0, size, size)
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * size
    const v = 100 + Math.random() * 70
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.25 + Math.random() * 0.35})`
    ctx.lineWidth = Math.random() * 1.4
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y + (Math.random() - 0.5) * 2)
    ctx.stroke()
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping
  tex.anisotropy = 4
  return tex
}

export function createPlatinumMaterial(brushed: THREE.Texture) {
  return new THREE.MeshPhysicalMaterial({
    color: PLATINUM,
    metalness: 1,
    roughness: 0.42,
    roughnessMap: brushed,
  })
}

export function createGraphiteMaterial() {
  return new THREE.MeshStandardMaterial({ color: GRAPHITE, metalness: 0.95, roughness: 0.38 })
}

export interface PanelUniforms {
  uTime: { value: number }
  uFlicker: { value: number }
  uCold: { value: number }
  uGlow: { value: number }
  uGold: { value: THREE.Color }
  uColdColor: { value: THREE.Color }
}

/**
 * Solar-cell panel material. A MeshPhysicalMaterial with two per-instance
 * attributes injected:
 *   aLit  (0..1)  how switched-on this panel is, drives a gold emissive above
 *                 the bloom threshold so only lit panels glow
 *   aSeed (0..1)  random per panel, used for flicker and ignition shimmer
 * A procedural cell grid is drawn on the panel face from its UVs.
 */
export function createPanelMaterial() {
  const uniforms: PanelUniforms = {
    uTime: { value: 0 },
    uFlicker: { value: 0 },
    uCold: { value: 0 },
    uGlow: { value: 1 },
    uGold: { value: GOLD.clone() },
    uColdColor: { value: COLD.clone() },
  }

  const material = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color('#0a0e18'),
    metalness: 0.55,
    roughness: 0.3,
    clearcoat: 1,
    clearcoatRoughness: 0.12,
  })

  material.onBeforeCompile = (shader) => {
    Object.assign(shader.uniforms, uniforms)
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <common>',
        `#include <common>
        attribute float aLit;
        attribute float aSeed;
        varying float vLit;
        varying float vSeed;
        varying vec2 vCellUv;`,
      )
      .replace(
        '#include <uv_vertex>',
        `#include <uv_vertex>
        vLit = aLit;
        vSeed = aSeed;
        vCellUv = uv;`,
      )

    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        `#include <common>
        uniform float uTime;
        uniform float uFlicker;
        uniform float uCold;
        uniform float uGlow;
        uniform vec3 uGold;
        uniform vec3 uColdColor;
        varying float vLit;
        varying float vSeed;
        varying vec2 vCellUv;
        float cellLines(vec2 uv) {
          vec2 g = abs(fract(uv * vec2(4.0, 3.0)) - 0.5);
          vec2 w = fwidth(uv * vec2(4.0, 3.0)) * 1.2;
          vec2 l = 1.0 - smoothstep(vec2(0.5) - w, vec2(0.5), g);
          float edge = max(step(vCellUv.x, 0.04) + step(0.96, vCellUv.x), step(vCellUv.y, 0.03) + step(0.97, vCellUv.y));
          return clamp(1.0 - min(l.x, l.y) + edge, 0.0, 1.0);
        }`,
      )
      .replace(
        '#include <color_fragment>',
        `#include <color_fragment>
        float lines = cellLines(vCellUv);
        diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.16, 0.17, 0.2), lines * 0.4);`,
      )
      .replace(
        '#include <emissivemap_fragment>',
        `#include <emissivemap_fragment>
        float flick = 1.0;
        if (uFlicker > 0.0) {
          float n = fract(sin(floor(uTime * 14.0 + vSeed * 40.0) * 12.9898 + vSeed * 78.233) * 43758.5453);
          flick = mix(1.0, step(0.45, n) * (0.4 + 0.6 * n), uFlicker);
        }
        float shimmer = 0.85 + 0.15 * sin(uTime * 2.0 + vSeed * 6.2831);
        float cell = (1.0 - lines) * (0.55 + 0.45 * fract(vSeed * 7.31));
        vec3 gold = uGold * vLit * (0.08 + cell) * shimmer * 1.7 * uGlow;
        vec3 cold = uColdColor * uCold * (1.0 - lines) * 0.35 * step(0.6, vSeed + 0.3 * sin(uTime * 3.0 + vSeed * 20.0));
        totalEmissiveRadiance += (gold + cold) * flick;`,
      )
  }

  // Ensure the patched program is cached separately from stock physical materials.
  material.customProgramCacheKey = () => 'platinum-panel-v1'

  return { material, uniforms }
}
