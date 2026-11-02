import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  Group,
  InstancedMesh,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PointLight,
  Points,
  Shape,
  ShapeGeometry,
  ShaderMaterial,
  SphereGeometry,
  TorusGeometry,
  Vector2,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { GOLD, GOLD_HOT, PLATINUM, glowSprite, lerp, seeded, smooth, type Act, type Quality } from './shared.ts'

/** Sunset dome. Follows the camera, and fades to black as the camera climbs into the night. */
export function createSky() {
  const material = new ShaderMaterial({
    side: BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { uLevel: { value: 1 }, uTime: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vDir;
      uniform float uLevel;
      uniform float uTime;
      float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }
      float fbm(vec2 p) {
        float v = 0.0, a = 0.5;
        for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 11.0; a *= 0.5; }
        return v;
      }
      void main() {
        vec3 d = normalize(vDir);
        float h = d.y;
        vec3 sunDir = normalize(vec3(0.0, 0.035, -1.0));
        vec3 col = mix(vec3(0.62, 0.22, 0.06), vec3(0.13, 0.045, 0.05), smoothstep(-0.02, 0.17, h));
        col = mix(col, vec3(0.008, 0.012, 0.035), smoothstep(0.1, 0.5, h));
        float a = max(dot(d, sunDir), 0.0);
        col += vec3(1.0, 0.42, 0.1) * pow(a, 42.0) * 0.55;
        col += vec3(2.2, 1.25, 0.45) * smoothstep(0.9986, 0.9993, a);
        vec2 uv = d.xz / (max(h, 0.02) + 0.22);
        float c = fbm(uv * vec2(1.1, 2.6) + vec2(uTime * 0.012, 0.0));
        c = smoothstep(0.46, 0.8, c) * smoothstep(-0.01, 0.1, h);
        vec3 lit = mix(vec3(0.015, 0.012, 0.03), vec3(0.62, 0.22, 0.07), pow(a, 5.0));
        col = mix(col, lit, c * 0.9);
        gl_FragColor = vec4(col * uLevel, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  })
  const mesh = new Mesh(new SphereGeometry(400, 32, 20), material)
  mesh.renderOrder = -10
  mesh.frustumCulled = false
  return { mesh, material }
}

function ridgeHeight(seed: number, x: number) {
  return (
    Math.sin(x * 0.041 + seed) * 0.55 +
    Math.sin(x * 0.097 + seed * 2.3) * 0.28 +
    Math.sin(x * 0.23 + seed * 4.1) * 0.12 +
    Math.sin(x * 0.61 + seed * 7.7) * 0.05
  )
}

function createRidge(seed: number, z: number, base: number, amp: number, color: number) {
  const span = 240
  const steps = 240
  const positions = new Float32Array((steps + 1) * 6)
  const index: number[] = []
  for (let i = 0; i <= steps; i++) {
    const x = -span / 2 + (span * i) / steps
    positions.set([x, base + ridgeHeight(seed, x) * amp, 0, x, base - 40, 0], i * 6)
    if (i < steps) {
      const a = i * 2
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setIndex(index)
  const mesh = new Mesh(geometry, new MeshBasicMaterial({ color, fog: false }))
  mesh.position.z = z
  return mesh
}

/** Flat-topped acacia silhouette. */
function acaciaGeometry() {
  const s = new Shape()
  s.moveTo(-0.07, 0)
  s.lineTo(-0.05, 0.55)
  s.lineTo(-0.62, 1.12)
  s.lineTo(-0.56, 1.16)
  s.lineTo(-1.5, 1.2)
  s.bezierCurveTo(-1.35, 1.58, -0.55, 1.64, 0, 1.6)
  s.bezierCurveTo(0.6, 1.66, 1.45, 1.58, 1.6, 1.2)
  s.lineTo(0.6, 1.14)
  s.lineTo(0.05, 0.6)
  s.lineTo(0.08, 0)
  s.closePath()
  return new ShapeGeometry(s, 10)
}

function createAcacias(seed: number, ridgeSeed: number, z: number, base: number, amp: number, color: number, count: number, size: number) {
  const random = seeded(seed)
  const mesh = new InstancedMesh(acaciaGeometry(), new MeshBasicMaterial({ color, fog: false }), count)
  const dummy = new Object3D()
  for (let i = 0; i < count; i++) {
    const x = (random() - 0.5) * 110
    const s = size * (0.7 + random() * 0.6)
    dummy.position.set(x, base + ridgeHeight(ridgeSeed, x) * amp - 0.05, z + 0.01)
    dummy.scale.set(s * (random() < 0.5 ? -1 : 1), s, 1)
    dummy.updateMatrix()
    mesh.setMatrixAt(i, dummy.matrix)
  }
  return mesh
}

interface Segment {
  angle: number
  radius: number
  length: number
  width: number
  long: boolean
}

/** The Platinum sunburst logo, built as a machine. */
function createCore(q: Quality) {
  const root = new Group()
  root.position.y = 2.75

  const segments: Segment[] = []
  for (let k = 0; k < 8; k++) {
    const long = k % 2 === 0
    const count = long ? 4 : 3
    let radius = 1.3
    for (let i = 0; i < count; i++) {
      const length = (long ? 0.66 : 0.52) - i * 0.02
      segments.push({ angle: (k * Math.PI) / 4, radius: radius + length / 2, length, width: (long ? 0.48 : 0.36) - i * 0.03, long })
      radius += length + 0.08
    }
  }

  const panels = new InstancedMesh(
    new RoundedBoxGeometry(1, 1, 1, 2, 0.06),
    new MeshStandardMaterial({ metalness: 1, roughness: 0.28 }),
    segments.length,
  )
  const seams = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 1, 0.02), new MeshBasicMaterial({ toneMapped: false }), segments.length * 2)
  const platinum = new Color(PLATINUM)
  const gold = new Color(GOLD).lerp(new Color(0xffffff), 0.12)
  segments.forEach((seg, i) => panels.setColorAt(i, seg.long ? gold : platinum))
  seams.setColorAt(0, new Color(0xffffff))
  root.add(panels, seams)

  const heart = new Mesh(
    new SphereGeometry(1.02, q.mobile ? 32 : 64, q.mobile ? 24 : 48),
    new ShaderMaterial({
      uniforms: { uCharge: { value: 1 }, uTime: { value: 0 } },
      vertexShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vN = normalize(normalMatrix * normal); vV = normalize(-mv.xyz); vP = position;
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        varying vec3 vN; varying vec3 vV; varying vec3 vP;
        uniform float uCharge; uniform float uTime;
        void main() {
          float f = pow(max(dot(normalize(vN), normalize(vV)), 0.0), 1.6);
          float bands = 0.5 + 0.5 * sin(vP.y * 18.0 + sin(vP.x * 9.0 + uTime) * 1.5 + uTime * 0.8);
          vec3 c = mix(vec3(0.5, 0.2, 0.03), vec3(2.6, 1.7, 0.65), f);
          c += vec3(0.5, 0.28, 0.06) * bands * f;
          gl_FragColor = vec4(c * (0.08 + uCharge * 0.92), 1.0);
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }`,
    }),
  )
  root.add(heart)

  const metal = new MeshStandardMaterial({ color: PLATINUM, metalness: 1, roughness: 0.22 })
  const ringA = new Mesh(new TorusGeometry(1.2, 0.035, 12, 96), metal)
  const ringB = new Mesh(new TorusGeometry(1.2, 0.022, 10, 96), metal)
  const halo = new Mesh(
    new TorusGeometry(4.15, 0.012, 8, 160),
    new MeshBasicMaterial({ color: new Color(GOLD_HOT).multiplyScalar(1.6), toneMapped: false, transparent: true, opacity: 0.8 }),
  )
  root.add(ringA, ringB, halo)

  const glowA = glowSprite(GOLD_HOT, 4.6, 0.5)
  const glowB = glowSprite(0xfff1c8, 2.5, 0.4)
  root.add(glowA, glowB)

  const light = new PointLight(GOLD_HOT, 40, 16, 1.6)
  light.position.z = 1.2
  root.add(light)

  const dummy = new Object3D()
  const seamColor = new Color()
  const hot = new Color(GOLD_HOT).multiplyScalar(1.5)
  const off = new Color(0x241a08)
  const heartMat = heart.material as ShaderMaterial

  function update(t: number, unfold: number, charge: number, pointer: Vector2) {
    root.rotation.y = lerp(root.rotation.y, pointer.x * 0.28 + Math.sin(t * 0.25) * 0.08, 0.05)
    root.rotation.x = lerp(root.rotation.x, -pointer.y * 0.16, 0.05)
    root.rotation.z = t * 0.035

    segments.forEach((seg, i) => {
      const stretch = lerp(0.72, 1, smooth(0, 1, unfold))
      const radius = seg.radius * stretch + Math.sin(t * 1.1 + seg.angle * 2 + seg.radius) * 0.015
      const c = Math.cos(seg.angle)
      const s = Math.sin(seg.angle)
      dummy.position.set(c * radius, s * radius, 0)
      dummy.rotation.set(0, 0, seg.angle)
      dummy.scale.set(seg.length, seg.width, 0.22)
      dummy.updateMatrix()
      panels.setMatrixAt(i, dummy.matrix)

      // Lights run outwards from the heart, and drop out one by one as the charge falls.
      const lit = smooth(seg.radius / 5.2 - 0.05, seg.radius / 5.2 + 0.25, charge)
      const flicker = charge < 0.95 ? 0.75 + 0.25 * Math.sin(t * 14 + i * 3.1) : 1
      seamColor.copy(off).lerp(hot, lit * flicker)
      for (const side of [0, 1]) {
        dummy.position.set(c * radius, s * radius, 0)
        const offset = (side ? 1 : -1) * seg.width * 0.3
        dummy.position.x += -s * offset
        dummy.position.y += c * offset
        dummy.position.z = 0.12
        dummy.scale.set(seg.length * 0.84, 0.035, 0.015)
        dummy.updateMatrix()
        seams.setMatrixAt(i * 2 + side, dummy.matrix)
        seams.setColorAt(i * 2 + side, seamColor)
      }
    })
    panels.instanceMatrix.needsUpdate = true
    seams.instanceMatrix.needsUpdate = true
    seams.instanceColor!.needsUpdate = true

    ringA.rotation.set(t * 0.4, t * 0.3, 0)
    ringB.rotation.set(-t * 0.3, t * 0.5, 1)
    heartMat.uniforms.uCharge.value = charge
    heartMat.uniforms.uTime.value = t
    glowA.material.opacity = 0.05 + charge * 0.45
    glowB.material.opacity = 0.03 + charge * 0.37
    ;(halo.material as MeshBasicMaterial).opacity = charge * 0.8
    light.intensity = 2 + charge * 12
  }

  return { root, update }
}

/** Customer enquiries leaving the machine for someone else. */
function createSignals(q: Quality) {
  const count = q.mobile ? 180 : 420
  const random = seeded(77)
  const dirs = new Float32Array(count * 3)
  const seeds = new Float32Array(count)
  for (let i = 0; i < count; i++) {
    const a = random() * Math.PI * 2
    const u = random() * 1.6 - 0.8
    const r = Math.sqrt(1 - u * u)
    dirs.set([Math.cos(a) * r, u, Math.sin(a) * r], i * 3)
    seeds[i] = random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(dirs, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1))
  const material = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uAmount: { value: 0 }, uPixel: { value: Math.min(devicePixelRatio, 2) } },
    vertexShader: /* glsl */ `
      attribute float aSeed; uniform float uTime; uniform float uPixel; varying float vA;
      void main() {
        float life = fract(uTime * (0.05 + aSeed * 0.07) + aSeed * 13.0);
        vec3 p = position * (1.3 + life * 24.0);
        vA = smoothstep(0.0, 0.08, life) * (1.0 - life);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = uPixel * (10.0 + aSeed * 22.0) / -mv.z * 6.0;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uAmount; varying float vA;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.0, d);
        gl_FragColor = vec4(vec3(1.7, 1.15, 0.45) * a * a, a * vA * uAmount);
        #include <colorspace_fragment>
      }`,
  })
  const points = new Points(geometry, material)
  points.frustumCulled = false
  points.position.y = 2.75
  return { points, material }
}

export function createHomeland(q: Quality) {
  const group = new Group()

  const layers = [
    { seed: 1.3, z: -70, base: 3.2, amp: 8, color: 0x7a3f1c },
    { seed: 2.9, z: -48, base: 0.9, amp: 5.5, color: 0x45200f },
    { seed: 4.7, z: -28, base: -0.4, amp: 2.8, color: 0x1e0f0a },
    { seed: 6.1, z: -12, base: -1.3, amp: 1.1, color: 0x070405 },
  ]
  for (const l of layers) group.add(createRidge(l.seed, l.z, l.base, l.amp, l.color))
  group.add(
    createAcacias(5, layers[2].seed, layers[2].z, layers[2].base, layers[2].amp, layers[2].color, q.mobile ? 10 : 22, 1.05),
    createAcacias(9, layers[3].seed, layers[3].z, layers[3].base, layers[3].amp, layers[3].color, q.mobile ? 5 : 9, 1.25),
  )

  const core = createCore(q)
  const signals = createSignals(q)
  group.add(core.root, signals.points)
  // On phones the hero text fills the lower half, so the camera looks lower to lift the machine.
  return { group, core, signals, lift: q.mobile ? 2.1 : 0 }
}

export type Homeland = ReturnType<typeof createHomeland>

export function riseAct(home: Homeland): Act {
  return {
    group: home.group,
    sky: () => 1,
    pose(p, out) {
      out.pos.set(0, 1.5, lerp(16, 13.5, p))
      out.target.set(0, lerp(2.1, 2.4, p) - home.lift, 0)
    },
    update(p, t, _dt, pointer) {
      home.core.update(t, smooth(0, 0.7, p + 0.55), 1, pointer)
      home.signals.material.uniforms.uAmount.value = 0
    },
  }
}

export function lostAct(home: Homeland): Act {
  return {
    group: home.group,
    sky: (p) => 1 - smooth(0.05, 0.85, p),
    pose(p, out) {
      const a = lerp(0, 0.62, p)
      const r = lerp(13.5, 13, p)
      out.pos.set(Math.sin(a) * r, lerp(1.5, 16, smooth(0.2, 1, p)), Math.cos(a) * r)
      out.target.set(0, lerp(2.4 - home.lift, 7, smooth(0, 1, p)), lerp(0, -18, smooth(0.45, 1, p)))
    },
    update(p, t, _dt, pointer) {
      home.core.update(t, 1 - p * 0.3, 1 - smooth(0, 0.65, p) * 0.94, pointer)
      const m = home.signals.material
      m.uniforms.uTime.value = t
      m.uniforms.uAmount.value = smooth(0, 0.2, p)
    },
  }
}
