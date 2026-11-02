/**
 * The 3D film behind the page. Loaded lazily by client.ts, and only on devices
 * that can run it. All geometry is generated in code, so there are no model files.
 *
 * Any element with data-act="name" is a chapter: scrolling through it plays that
 * act, and the last part of the chapter flies the camera to the next one.
 */
import {
  ACESFilmicToneMapping,
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DirectionalLight,
  Fog,
  Group,
  HemisphereLight,
  Mesh,
  PerspectiveCamera,
  PMREMGenerator,
  Points,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { createHomeland, createSky, lostAct, riseAct } from './homeland.ts'
import { aiAct, gateAct, whatsappAct, websitesAct } from './modules.ts'
import { clamp01, lerp, seeded, smooth, type Act, type Pose, type Quality } from './shared.ts'

const FORCED = /[?&]forcewebgl/.test(location.search)
const SOFTWARE_GPU = /swiftshader|llvmpipe|software|basic render/i

/** Slight colour fringing, vignette and film grain: the finishing lens. */
const LensShader = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
  vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233)) + uTime) * 43758.5453); }
    void main() {
      vec2 c = vUv - 0.5;
      float d = dot(c, c);
      vec2 shift = c * d * 0.012;
      vec3 col = vec3(texture2D(tDiffuse, vUv + shift).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - shift).b);
      col *= 1.0 - smoothstep(0.18, 0.75, d) * 0.65;
      col += (hash(vUv) - 0.5) * 0.012;
      gl_FragColor = vec4(col, 1.0);
    }`,
}

function createStars(q: Quality) {
  const count = q.mobile ? 1300 : 3200
  const random = seeded(9)
  const positions = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    positions.set([(random() - 0.5) * 190, -40 + random() * 130, 40 - random() * 370], i * 3)
    seeds[i] = random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uFade: { value: 1 }, uPixel: { value: Math.min(devicePixelRatio, 2) } },
    vertexShader: /* glsl */ `
      attribute float aSeed; uniform float uTime; uniform float uPixel; varying float vA; varying float vS;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vS = aSeed;
        vA = (0.55 + 0.45 * sin(uTime * (0.6 + aSeed * 2.0) + aSeed * 40.0)) * smoothstep(120.0, 40.0, -mv.z);
        gl_PointSize = uPixel * clamp((0.5 + aSeed * aSeed * 3.0) * 34.0 / -mv.z, 0.8, 7.0);
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uFade; varying float vA; varying float vS;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.05, d) * vA * uFade;
        vec3 c = mix(vec3(0.75, 0.85, 1.0), vec3(1.0, 0.86, 0.6), step(0.72, vS));
        gl_FragColor = vec4(c * 1.4 * a, a);
        #include <colorspace_fragment>
      }`,
  })
  const points = new Points(geometry, material)
  points.frustumCulled = false
  return { points, material }
}

/** Soft reflections for the metal, generated once instead of downloading an HDR. */
function createEnvironment(renderer: WebGLRenderer) {
  const room = new Scene()
  room.add(
    new Mesh(
      new SphereGeometry(30, 24, 16),
      new ShaderMaterial({
        side: BackSide,
        vertexShader: /* glsl */ `varying vec3 vP; void main() { vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: /* glsl */ `
          varying vec3 vP;
          void main() {
            vec3 d = normalize(vP);
            vec3 c = mix(vec3(0.03, 0.035, 0.06), vec3(0.22, 0.24, 0.3), smoothstep(-0.2, 0.9, d.y));
            c += vec3(2.8, 1.6, 0.65) * smoothstep(0.25, 1.0, -d.z) * smoothstep(0.55, -0.1, abs(d.y));
            c += vec3(1.8, 1.9, 2.1) * smoothstep(0.82, 0.98, dot(d, normalize(vec3(0.5, 0.75, 0.6))));
            gl_FragColor = vec4(c, 1.0);
          }`,
      }),
    ),
  )
  const pmrem = new PMREMGenerator(renderer)
  const target = pmrem.fromScene(room, 0.04)
  pmrem.dispose()
  return target.texture
}

interface Chapter {
  element: HTMLElement
  act: Act
  top: number
  height: number
}

export async function start(canvas: HTMLCanvasElement) {
  const mobile = window.innerWidth < 768 || matchMedia('(pointer: coarse)').matches
  const q: Quality = { mobile }

  const renderer = new WebGLRenderer({ canvas, antialias: mobile, powerPreference: 'high-performance', stencil: false })
  const gl = renderer.getContext()
  const debug = gl.getExtension('WEBGL_debug_renderer_info')
  const gpu = debug ? String(gl.getParameter(debug.UNMASKED_RENDERER_WEBGL)) : ''
  if (SOFTWARE_GPU.test(gpu) && !FORCED) throw new Error(`Software GPU: ${gpu}`)

  await Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 800))])

  let pixelRatio = Math.min(devicePixelRatio, mobile ? 1.5 : 1.75)
  renderer.setPixelRatio(pixelRatio)
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1

  const scene = new Scene()
  scene.background = new Color(0x000000)
  const fog = new Fog(0x000000, 24, 62)
  scene.fog = fog
  scene.environment = createEnvironment(renderer)
  scene.environmentIntensity = 0.9
  scene.add(new HemisphereLight(0x8fa3c8, 0x120c08, 0.5))
  const key = new DirectionalLight(0xffffff, 1.3)
  key.position.set(3, 6, 8)
  scene.add(key)

  const camera = new PerspectiveCamera(40, 1, 0.1, 900)
  const sky = createSky()
  scene.add(sky.mesh)
  const stars = createStars(q)
  scene.add(stars.points)

  const elements = [...document.querySelectorAll<HTMLElement>('[data-act]')]
  const names = new Set(elements.map((el) => el.dataset.act))
  const needsHome = names.has('rise') || names.has('lost')
  const home = needsHome ? createHomeland(q) : null
  const factories: Record<string, () => Act> = {
    rise: () => riseAct(home!),
    lost: () => lostAct(home!),
    websites: () => websitesAct(q),
    whatsapp: () => whatsappAct(q),
    ai: () => aiAct(q),
    gate: () => gateAct(q),
  }
  const chapters: Chapter[] = elements.map((element) => {
    const act = factories[element.dataset.act!]()
    return { element, act, top: 0, height: 1 }
  })
  const groups = new Set<Group>(chapters.map((c) => c.act.group))
  groups.forEach((g) => {
    g.visible = false
    scene.add(g)
  })

  const solo = chapters.length === 1

  const pointer = new Vector2()
  const smoothPointer = new Vector2()
  if (!mobile) {
    addEventListener('pointermove', (e) => pointer.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)), { passive: true })
  }

  function measure() {
    for (const c of chapters) {
      const box = c.element.getBoundingClientRect()
      c.top = box.top + scrollY
      c.height = box.height
    }
  }
  new ResizeObserver(measure).observe(document.body)

  let composer: EffectComposer | null = null
  let bloom: UnrealBloomPass | null = null
  let lens: ShaderPass | null = null
  function buildComposer() {
    composer = new EffectComposer(renderer)
    composer.addPass(new RenderPass(scene, camera))
    bloom = new UnrealBloomPass(new Vector2(innerWidth / 2, innerHeight / 2), 0.34, 0.6, 0.95)
    composer.addPass(bloom)
    lens = new ShaderPass(LensShader)
    composer.addPass(lens)
    composer.addPass(new OutputPass())
  }
  if (!mobile) buildComposer()

  let fit = 1
  let lastW = 0
  let lastH = 0
  function resize() {
    const w = innerWidth
    const h = innerHeight
    // Phone address bars change the height while scrolling: ignore small changes.
    if (w === lastW && Math.abs(h - lastH) < 120) return
    lastW = w
    lastH = h
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(w, h, false)
    composer?.setPixelRatio(pixelRatio)
    composer?.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    // Narrow screens pull the camera back to fit, so the fog has to move back with it.
    fit = Math.max(1, 0.95 / camera.aspect)
    fog.near = 24 * fit
    fog.far = 62 * fit
  }
  addEventListener('resize', () => {
    resize()
    measure()
  })
  resize()
  measure()

  const poseA: Pose = { pos: new Vector3(), target: new Vector3() }
  const poseB: Pose = { pos: new Vector3(), target: new Vector3() }
  const eye = new Vector3()
  const look = new Vector3()
  let scroll = scrollY
  let first = true
  let last = performance.now()
  const started = last

  // Quality watchdog: step down on slow GPUs, and fall back to the still page if needed.
  let frames = 0
  let windowStart = last
  let stage = 0
  function watchdog(now: number) {
    frames++
    if (now - windowStart < 1500) return
    const fps = (frames * 1000) / (now - windowStart)
    frames = 0
    windowStart = now
    if (FORCED || fps >= 28) return
    stage++
    if (stage === 1) {
      composer = null
      pixelRatio = Math.min(pixelRatio, 1)
    } else if (stage === 2) {
      pixelRatio = 0.75
    } else {
      stopped = true
      document.documentElement.classList.remove('stage')
      canvas.remove()
      return
    }
    renderer.setPixelRatio(pixelRatio)
    renderer.setSize(innerWidth, innerHeight, false)
  }

  function chapterAt(y: number) {
    let i = 0
    for (let n = 0; n < chapters.length; n++) if (y >= chapters[n].top - 1) i = n
    return i
  }

  let stopped = false
  function frame(now: number) {
    if (stopped) return
    requestAnimationFrame(frame)
    if (document.hidden) {
      last = now
      return
    }
    const dt = Math.min((now - last) / 1000, 0.1)
    last = now
    const t = (now - started) / 1000

    scroll = first ? scrollY : lerp(scroll, scrollY, 1 - Math.exp(-dt * 7))
    const i = chapterAt(scroll)
    const chapter = chapters[i]
    const next = chapters[i + 1]

    const raw = clamp01((scroll - chapter.top) / Math.max(1, chapter.height - innerHeight))

    if (solo) {
      // Single-scene pages: the scene plays behind the hero, then dims behind the content.
      const leaving = clamp01(scroll / Math.max(1, chapter.height))
      canvas.style.opacity = String(lerp(1, 0.16, smooth(0.1, 0.9, leaving)))
      if (leaving >= 1 && !first) return
    } else if (!next && scroll > chapter.top + chapter.height) {
      if (!first) return
    }

    // The flight to the next act takes the last 0.85 screens of the chapter, which
    // is an empty stretch (.transit in the page), so text always matches its scene.
    const range = Math.max(1, chapter.height - innerHeight)
    const blendStart = clamp01(1 - (innerHeight * 0.85) / range)
    const p = next && blendStart > 0.05 ? clamp01(raw / blendStart) : raw
    const blend = next ? smooth(blendStart, 1, raw) : 0
    const actP = solo ? 0.72 + raw * 0.28 : p

    chapter.act.pose(actP, poseA)
    poseA.pos.sub(poseA.target).multiplyScalar(fit).add(poseA.target)
    let skyLevel = chapter.act.sky?.(actP) ?? 0
    if (next && blend > 0) {
      next.act.pose(0, poseB)
      poseB.pos.sub(poseB.target).multiplyScalar(fit).add(poseB.target)
      poseA.pos.lerp(poseB.pos, blend)
      poseA.target.lerp(poseB.target, blend)
      skyLevel = lerp(skyLevel, next.act.sky?.(0) ?? 0, blend)
    }

    smoothPointer.lerp(pointer, 1 - Math.exp(-dt * 3))
    const follow = first ? 1 : 1 - Math.exp(-dt * 10)
    eye.lerp(poseA.pos, follow)
    look.lerp(poseA.target, follow)
    camera.position.copy(eye)
    camera.position.x += smoothPointer.x * 0.35
    camera.position.y += smoothPointer.y * 0.2
    camera.lookAt(look)

    groups.forEach((g) => (g.visible = false))
    const showNext = next && blend > 0
    chapter.act.group.visible = true
    if (showNext) next.act.group.visible = true
    chapter.act.update(actP, t, dt, smoothPointer)
    if (showNext && next.act.group !== chapter.act.group) next.act.update(0, t, dt, smoothPointer)

    sky.material.uniforms.uLevel.value = skyLevel
    sky.material.uniforms.uTime.value = t
    sky.mesh.visible = skyLevel > 0.002
    sky.mesh.position.copy(camera.position)
    if (home) home.group.visible = home.group.visible && skyLevel > 0.002
    stars.material.uniforms.uTime.value = t
    stars.material.uniforms.uFade.value = lerp(1, 0.18, smooth(0.2, 0.95, skyLevel))

    if (composer && lens) {
      lens.uniforms.uTime.value = t % 10
      composer.render(dt)
    } else {
      renderer.render(scene, camera)
    }

    if (first) {
      first = false
      document.documentElement.dataset.stageReady = ''
      windowStart = now
      frames = 0
    } else {
      watchdog(now)
    }
  }

  // Compile shaders up front so the first scroll doesn't hitch.
  groups.forEach((g) => (g.visible = true))
  await renderer.compileAsync(scene, camera)
  requestAnimationFrame(frame)
}

