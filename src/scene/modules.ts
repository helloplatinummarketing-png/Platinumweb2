import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  CircleGeometry,
  Color,
  DoubleSide,
  DynamicDrawUsage,
  ExtrudeGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Object3D,
  PlaneGeometry,
  Points,
  RingGeometry,
  Shape,
  ShaderMaterial,
  TorusGeometry,
  Vector2,
  Vector3,
} from 'three'
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js'
import { automations } from '../content/copy.ts'
import { GOLD, GOLD_HOT, PLATINUM, canvasTexture, clamp01, glowSprite, lerp, roundRect, seeded, smooth, wrapText, type Act, type Quality } from './shared.ts'

const FONT = '"Inter Tight Variable", system-ui, sans-serif'
export const STATIONS = { websites: -70, whatsapp: -130, ai: -190, gate: -250 }
const HIGH = 16

/* ---------- Module 01: websites ---------- */

const SITES = [
  { name: 'Dental Clinic', line: 'Book your check-up', a: '#123a52', b: '#2f8fa3', accent: '#7fe0e8' },
  { name: 'Hair Salon', line: 'Book your next visit', a: '#4a1c3c', b: '#b0487a', accent: '#ffb3d1' },
  { name: 'Auto Garage', line: 'Get your car sorted', a: '#26282e', b: '#6c7079', accent: '#ffb547' },
  { name: 'Restaurant', line: 'Order for delivery', a: '#47210f', b: '#b5561f', accent: '#ffd08a' },
  { name: 'Safari Lodge', line: 'Reserve your stay', a: '#183a26', b: '#4f8f53', accent: '#d6e88a' },
  { name: 'Real Estate', line: 'Find your next home', a: '#1b2450', b: '#4a5bb0', accent: '#bcc7ff' },
]

function drawSite(site: (typeof SITES)[number]) {
  const canvas = document.createElement('canvas')
  canvas.width = 640
  canvas.height = 400
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#f7f6f2'
  ctx.fillRect(0, 0, 640, 400)
  ctx.fillStyle = '#e4e3de'
  ctx.fillRect(0, 0, 640, 26)
  for (const [i, c] of ['#d46a5f', '#d9b64f', '#6bb56b'].entries()) {
    ctx.fillStyle = c
    ctx.beginPath()
    ctx.arc(16 + i * 16, 13, 4.5, 0, Math.PI * 2)
    ctx.fill()
  }
  const g = ctx.createLinearGradient(0, 26, 640, 260)
  g.addColorStop(0, site.a)
  g.addColorStop(1, site.b)
  ctx.fillStyle = g
  ctx.fillRect(0, 26, 640, 234)
  ctx.fillStyle = '#fff'
  ctx.font = `600 19px ${FONT}`
  ctx.fillText(site.name, 28, 62)
  ctx.font = `600 44px ${FONT}`
  ctx.fillText(site.line, 28, 150)
  ctx.fillStyle = site.accent
  roundRect(ctx, 28, 182, 158, 44, 8)
  ctx.fill()
  ctx.fillStyle = '#111'
  ctx.font = `600 18px ${FONT}`
  ctx.fillText('Book Now', 66, 210)
  for (let i = 0; i < 3; i++) {
    const x = 28 + i * 200
    ctx.fillStyle = '#fff'
    roundRect(ctx, x, 278, 184, 100, 8)
    ctx.fill()
    ctx.fillStyle = site.b
    ctx.fillRect(x + 16, 296, 44, 8)
    ctx.fillStyle = '#c9c8c2'
    ctx.fillRect(x + 16, 318, 150, 7)
    ctx.fillRect(x + 16, 334, 118, 7)
  }
  return canvasTexture(canvas)
}

export function websitesAct(q: Quality): Act {
  const group = new Group()
  const z0 = STATIONS.websites
  const random = seeded(21)
  const textures = SITES.map(drawSite)
  const plane = new PlaneGeometry(3.2, 2)
  const frameGeo = new RoundedBoxGeometry(3.3, 2.1, 0.08, 2, 0.04)
  const frameMat = new MeshStandardMaterial({ color: PLATINUM, metalness: 1, roughness: 0.3 })
  const count = q.mobile ? 10 : 18
  const panels: { node: Group; base: Vector3; phase: number }[] = []
  for (let i = 0; i < count; i++) {
    const node = new Group()
    node.add(new Mesh(frameGeo, frameMat))
    const screen = new Mesh(plane, new MeshBasicMaterial({ map: textures[i % textures.length], toneMapped: false, color: 0xd8d8d8 }))
    screen.position.z = 0.045
    node.add(screen)
    const a = (i / count) * Math.PI * 2 * 2.3 + random() * 0.5
    const radius = (q.mobile ? 3.4 : 5.2) + random() * 2.6
    const base = new Vector3(Math.cos(a) * radius * 1.25, Math.sin(a) * radius * 0.72, 12 - (i / count) * 34)
    // Keep a clear corridor down the middle for the headline.
    const corridor = q.mobile ? 2.6 : 5.4
    if (Math.abs(base.x) < corridor) base.x = (base.x < 0 ? -1 : 1) * (corridor + random() * 1.5)
    node.position.copy(base)
    node.rotation.y = -Math.sign(base.x) * 0.32
    node.scale.setScalar(0.85 + random() * 0.35)
    group.add(node)
    panels.push({ node, base, phase: random() * 10 })
  }
  group.position.set(0, HIGH, z0)
  const glow = glowSprite(GOLD_HOT, 26, 0.09)
  glow.position.z = -24
  group.add(glow)

  return {
    group,
    pose(p, out) {
      const z = lerp(22, 2, p)
      out.pos.set(Math.sin(p * 2.4) * 0.8, HIGH + Math.cos(p * 2) * 0.35, z0 + z)
      out.target.set(0, HIGH, z0 + z - 12)
    },
    update(_p, t) {
      for (const panel of panels) {
        panel.node.position.y = panel.base.y + Math.sin(t * 0.5 + panel.phase) * 0.22
        panel.node.rotation.x = Math.sin(t * 0.3 + panel.phase) * 0.05
      }
    },
  }
}

/* ---------- Module 02: WhatsApp ---------- */

function bubbleGeometry() {
  const s = new Shape()
  const w = 1.1
  const h = 0.62
  const r = 0.16
  s.moveTo(-w / 2 + r, -h / 2)
  s.lineTo(w / 2 - r, -h / 2)
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r)
  s.lineTo(w / 2, h / 2 - r)
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2)
  s.lineTo(-w / 2 + r, h / 2)
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r)
  s.lineTo(-w / 2, -h / 2 - 0.16)
  s.lineTo(-w / 2 + r + 0.05, -h / 2)
  s.closePath()
  return new ExtrudeGeometry(s, { depth: 0.09, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 2, curveSegments: 6 })
}

export function whatsappAct(q: Quality): Act {
  const group = new Group()
  const z0 = STATIONS.whatsapp
  group.position.set(0, HIGH, z0)
  const phoneAt = q.mobile ? new Vector3(0, 1.55, 0) : new Vector3(3.3, 0, 0)

  const phone = new Group()
  phone.position.copy(phoneAt)
  group.add(phone)
  phone.add(
    new Mesh(new RoundedBoxGeometry(2.55, 5.1, 0.2, 3, 0.09), new MeshStandardMaterial({ color: 0xa6abb5, metalness: 1, roughness: 0.3 })),
  )

  const canvas = document.createElement('canvas')
  canvas.width = 480
  canvas.height = 980
  const ctx = canvas.getContext('2d')!
  const texture = canvasTexture(canvas)
  const screen = new Mesh(new PlaneGeometry(2.35, 4.8), new MeshBasicMaterial({ map: texture, toneMapped: false }))
  screen.position.z = 0.105
  phone.add(screen)
  const { chat } = automations

  let drawnStage = -1
  function drawScreen(stage: number) {
    if (stage === drawnStage) return
    drawnStage = stage
    ctx.fillStyle = '#0b141a'
    ctx.fillRect(0, 0, 480, 980)
    ctx.fillStyle = '#1f2c34'
    ctx.fillRect(0, 0, 480, 110)
    ctx.fillStyle = '#25d366'
    ctx.beginPath()
    ctx.arc(58, 62, 28, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#e9edef'
    ctx.font = `600 30px ${FONT}`
    ctx.fillText('Your Business', 102, 72)
    if (stage >= 1) {
      ctx.fillStyle = '#1f2c34'
      roundRect(ctx, 110, 150, 260, 58, 14)
      ctx.fill()
      ctx.fillStyle = '#f15c6d'
      ctx.font = `500 25px ${FONT}`
      ctx.textAlign = 'center'
      ctx.fillText(chat.missed, 240, 188)
      ctx.textAlign = 'left'
    }
    if (stage >= 2) {
      ctx.fillStyle = '#005c4b'
      roundRect(ctx, 66, 240, 382, 150, 18)
      ctx.fill()
      ctx.fillStyle = '#e9edef'
      ctx.font = `400 29px ${FONT}`
      const y = wrapText(ctx, chat.message, 88, 286, 340, 38)
      ctx.fillStyle = '#9bb5ac'
      ctx.font = `400 19px ${FONT}`
      ctx.fillText(chat.time, 88, y)
    }
    if (stage >= 3) {
      ctx.fillStyle = '#1f2c34'
      roundRect(ctx, 32, 420, 330, 76, 18)
      ctx.fill()
      ctx.fillStyle = '#e9edef'
      ctx.font = `400 29px ${FONT}`
      ctx.fillText(chat.reply, 54, 468)
    }
    texture.needsUpdate = true
  }
  drawScreen(0)

  const count = q.mobile ? 26 : 52
  const bubbles = new InstancedMesh(bubbleGeometry(), new MeshStandardMaterial({ metalness: 0.15, roughness: 0.35 }), count)
  bubbles.instanceMatrix.setUsage(DynamicDrawUsage)
  const random = seeded(55)
  const green = new Color(0x25d366)
  const white = new Color(0xeef7ee)
  const seeds = Array.from({ length: count }, (_, i) => {
    bubbles.setColorAt(i, random() < 0.3 ? white : green)
    return { offset: random(), radius: 1.2 + random() * 3.2, angle: random() * Math.PI * 2, speed: 0.04 + random() * 0.04, size: 0.42 + random() * 0.5 }
  })
  group.add(bubbles)

  const rings = [0, 1, 2].map(() => {
    const m = new Mesh(new RingGeometry(0.992, 1, 96), new MeshBasicMaterial({ color: 0x25d366, transparent: true, side: DoubleSide, depthWrite: false, blending: AdditiveBlending, toneMapped: false }))
    m.position.copy(phoneAt)
    m.position.z = -0.3
    group.add(m)
    return m
  })
  const glow = glowSprite(0x25d366, 13, 0.22)
  glow.position.copy(phoneAt)
  glow.position.z = -1
  group.add(glow)

  const dummy = new Object3D()
  return {
    group,
    pose(p, out) {
      const a = lerp(-0.34, 0.2, p)
      const r = q.mobile ? 9 : lerp(12.5, 10, p)
      out.pos.set(phoneAt.x * 0.45 + Math.sin(a) * r, HIGH + lerp(0.7, -0.2, p), z0 + Math.cos(a) * r)
      out.target.set(phoneAt.x * 0.45, HIGH + (q.mobile ? 0.7 : 0), z0)
    },
    update(p, t, _dt, pointer) {
      drawScreen(p < 0.1 ? 0 : p < 0.3 ? 1 : p < 0.55 ? 2 : 3)
      phone.rotation.y = lerp(phone.rotation.y, (q.mobile ? 0 : -0.3) + pointer.x * 0.12 + Math.sin(t * 0.5) * 0.04, 0.06)
      phone.rotation.x = lerp(phone.rotation.x, -pointer.y * 0.07, 0.06)
      phone.position.y = phoneAt.y + Math.sin(t * 0.8) * 0.07

      // Enquiries spiral in from everywhere and land on the phone.
      seeds.forEach((s, i) => {
        const life = (t * s.speed + s.offset) % 1
        const inward = 1 - life
        const angle = s.angle + life * 2.5
        // They orbit outside the phone and vanish behind it, so its messages stay readable.
        const radius = s.radius * inward * 1.9 + 2.3
        dummy.position.set(
          phoneAt.x + Math.cos(angle) * radius * 1.3,
          phoneAt.y + Math.sin(angle) * radius * 0.95,
          inward * inward * 6 - 0.9,
        )
        // Mirror any bubble that would drift behind the text column back to the phone's side.
        if (q.mobile) dummy.position.y = Math.max(dummy.position.y, 2 * -0.6 - dummy.position.y)
        else dummy.position.x = Math.abs(dummy.position.x - 0.4) + 0.4
        dummy.rotation.set(Math.sin(t + i) * 0.25, Math.cos(t * 0.7 + i) * 0.35, 0)
        dummy.scale.setScalar(s.size * smooth(0, 0.12, life) * smooth(1, 0.82, life) * smooth(0, 0.08, p + 0.03))
        dummy.updateMatrix()
        bubbles.setMatrixAt(i, dummy.matrix)
      })
      bubbles.instanceMatrix.needsUpdate = true

      rings.forEach((ring, i) => {
        const life = (t * 0.28 + i / 3) % 1
        ring.scale.setScalar(1.6 + life * 4.2)
        ;(ring.material as MeshBasicMaterial).opacity = (1 - life) * 0.45
      })
    },
  }
}

/* ---------- Module 03: AI visibility ---------- */

export function aiAct(q: Quality): Act {
  const group = new Group()
  const z0 = STATIONS.ai
  group.position.set(0, HIGH, z0)
  const orb = new Group()
  group.add(orb)

  const count = q.mobile ? 420 : 900
  const R = 4.2
  const positions = new Float32Array(count * 3)
  const scales = new Float32Array(count)
  const random = seeded(131)
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - ((i + 0.5) / count) * 2
    const r = Math.sqrt(1 - y * y)
    const a = i * golden
    const rr = R * (0.97 + random() * 0.06)
    positions.set([Math.cos(a) * r * rr, y * rr, Math.sin(a) * r * rr], i * 3)
    scales[i] = 0.5 + random()
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aScale', new BufferAttribute(scales, 1))
  const nodeMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uDim: { value: 1 }, uPixel: { value: Math.min(devicePixelRatio, 2) } },
    vertexShader: /* glsl */ `
      attribute float aScale; uniform float uPixel; varying float vDepth;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vDepth = normalize(normalMatrix * position).z;
        gl_PointSize = uPixel * aScale * 62.0 / -mv.z;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      uniform float uDim; varying float vDepth;
      void main() {
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.1, d);
        float front = 0.2 + 0.8 * smoothstep(-0.6, 0.7, vDepth);
        gl_FragColor = vec4(vec3(0.72, 0.8, 0.95) * a * front * uDim, a);
        #include <colorspace_fragment>
      }`,
  })
  orb.add(new Points(geometry, nodeMat))

  // Short links between neighbouring businesses make it read as a network.
  const links: number[] = []
  for (let i = 0; i < count; i++) {
    const j = i + 21
    if (j < count && i % 2 === 0) {
      links.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2], positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2])
    }
  }
  const linkGeo = new BufferGeometry()
  linkGeo.setAttribute('position', new BufferAttribute(new Float32Array(links), 3))
  const linkMat = new LineBasicMaterial({ color: 0x7c8db0, transparent: true, opacity: 0.16, blending: AdditiveBlending, depthWrite: false })
  orb.add(new LineSegments(linkGeo, linkMat))

  // The one business AI recommends: yours.
  const you = new Group()
  const youDir = new Vector3(0.28, 0.2, 0.94).normalize()
  you.position.copy(youDir).multiplyScalar(R)
  orb.add(you)
  const youDot = new Mesh(new CircleGeometry(0.1, 24), new MeshBasicMaterial({ color: new Color(GOLD_HOT).multiplyScalar(3), toneMapped: false, transparent: true }))
  const youGlow = glowSprite(GOLD_HOT, 2.4, 0)
  const youRings = [0, 1].map(() => {
    const m = new Mesh(new TorusGeometry(1, 0.003, 6, 96), new MeshBasicMaterial({ color: GOLD_HOT, transparent: true, toneMapped: false, depthWrite: false }))
    you.add(m)
    return m
  })
  you.add(youDot, youGlow)

  const shell = glowSprite(0x3e5a9a, 15, 0.2)
  group.add(shell)

  return {
    group,
    pose(p, out) {
      const z = q.mobile ? lerp(15, 12, p) : lerp(14, 10, p)
      out.pos.set(Math.sin(p * 1.2 - 0.4) * 1.6, HIGH + lerp(0.7, 0, p), z0 + z)
      out.target.set(0, HIGH, z0)
    },
    update(p, t) {
      const found = smooth(0.28, 0.62, p)
      // Spin freely at first, then settle with the gold node facing the camera.
      orb.rotation.y = lerp(t * 0.12 + 1.6, -0.1 + Math.sin(t * 0.2) * 0.05, found)
      orb.rotation.x = lerp(Math.sin(t * 0.08) * 0.2, 0.05, found)
      nodeMat.uniforms.uDim.value = lerp(1, 0.32, found)
      linkMat.opacity = lerp(0.16, 0.05, found)
      youGlow.material.opacity = found * 0.95
      youGlow.scale.setScalar(2.2 + Math.sin(t * 2) * 0.25 + found * 0.9)
      youDot.scale.setScalar(0.4 + found * 1.2)
      youDot.lookAt(youDot.getWorldPosition(new Vector3()).add(youDir))
      youRings.forEach((ring, i) => {
        const life = (t * 0.32 + i * 0.5) % 1
        ring.scale.setScalar(0.3 + life * 2.2)
        ;(ring.material as MeshBasicMaterial).opacity = (1 - life) * found
      })
    },
  }
}

/* ---------- Finale: the gate ---------- */

export function gateAct(q: Quality): Act {
  const group = new Group()
  const z0 = STATIONS.gate
  group.position.set(0, HIGH, z0)
  const R = 4.1
  const random = seeded(301)

  const metal = new MeshStandardMaterial({ color: PLATINUM, metalness: 1, roughness: 0.3 })
  group.add(new Mesh(new TorusGeometry(R + 0.28, 0.16, 16, 128), metal))
  const inner = new Mesh(
    new TorusGeometry(R, 0.022, 10, 160),
    new MeshBasicMaterial({ color: new Color(GOLD_HOT).multiplyScalar(1.8), toneMapped: false }),
  )
  group.add(inner)

  const plates = new Group()
  const blockCount = q.mobile ? 36 : 72
  const blocks = new InstancedMesh(new RoundedBoxGeometry(1, 1, 1, 1, 0.03), new MeshStandardMaterial({ color: 0x30343c, metalness: 1, roughness: 0.42 }), blockCount)
  const seamCount = blockCount
  const seams = new InstancedMesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: new Color(GOLD).multiplyScalar(2.2), toneMapped: false }), seamCount)
  const dummy = new Object3D()
  for (let i = 0; i < blockCount; i++) {
    const a = (i / blockCount) * Math.PI * 2
    const r = R + 0.75 + random() * 0.55
    const w = 0.22 + random() * 0.46
    dummy.position.set(Math.cos(a) * r, Math.sin(a) * r, -0.1)
    dummy.rotation.set(0, 0, a)
    dummy.scale.set(0.45 + random() * 0.55, w, 0.26)
    dummy.updateMatrix()
    blocks.setMatrixAt(i, dummy.matrix)
    dummy.position.z = 0.04
    dummy.scale.set(0.2, 0.03, 1)
    dummy.updateMatrix()
    seams.setMatrixAt(i, dummy.matrix)
  }
  plates.add(blocks, seams)
  group.add(plates)

  const floorMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    vertexShader: /* glsl */ `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
    fragmentShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        float d = length((vUv - 0.5) * vec2(1.0, 1.7));
        float a = smoothstep(0.42, 0.0, d);
        gl_FragColor = vec4(vec3(1.0, 0.68, 0.26) * a * a * 0.65, a);
        #include <colorspace_fragment>
      }`,
  })
  const floor = new Mesh(new PlaneGeometry(26, 26), floorMat)
  floor.rotation.x = -Math.PI / 2
  floor.position.y = -R - 0.55
  group.add(floor)

  const haze = glowSprite(GOLD_HOT, 11, 0.1)
  haze.position.z = -0.5
  group.add(haze)

  // Lightning: camera-facing ribbons rebuilt a few times a second.
  const arcs = q.mobile ? 6 : 10
  const steps = 22
  const vertsPerArc = (steps + 1) * 2
  const positions = new Float32Array(arcs * vertsPerArc * 3)
  const index: number[] = []
  for (let a = 0; a < arcs; a++) {
    for (let s = 0; s < steps; s++) {
      const o = a * vertsPerArc + s * 2
      index.push(o, o + 1, o + 2, o + 1, o + 3, o + 2)
    }
  }
  const arcGeo = new BufferGeometry()
  arcGeo.setAttribute('position', new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage))
  arcGeo.setIndex(index)
  const arcMesh = new Mesh(
    arcGeo,
    new MeshBasicMaterial({ color: new Color(0xffd27a).multiplyScalar(1.5), toneMapped: false, transparent: true, blending: AdditiveBlending, depthWrite: false, side: DoubleSide }),
  )
  arcMesh.frustumCulled = false
  group.add(arcMesh)

  const focus = new Vector2()
  let nextArc = 0

  function rebuildArcs(pointer: Vector2) {
    focus.set(pointer.x * R * 0.72, pointer.y * R * 0.72)
    for (let a = 0; a < arcs; a++) {
      const start = (a / arcs) * Math.PI * 2 + random() * 0.4
      const sx = Math.cos(start) * R
      const sy = Math.sin(start) * R
      const ex = focus.x + (random() - 0.5) * 0.7
      const ey = focus.y + (random() - 0.5) * 0.7
      let jx = 0
      let jy = 0
      for (let s = 0; s <= steps; s++) {
        const f = s / steps
        jx = jx * 0.72 + (random() - 0.5) * 0.52
        jy = jy * 0.72 + (random() - 0.5) * 0.52
        const fade = Math.sin(f * Math.PI)
        const x = lerp(sx, ex, f) + jx * fade
        const y = lerp(sy, ey, f) + jy * fade
        const w = lerp(0.02, 0.005, f)
        const o = (a * vertsPerArc + s * 2) * 3
        positions[o] = x - w
        positions[o + 1] = y + w
        positions[o + 2] = 0
        positions[o + 3] = x + w
        positions[o + 4] = y - w
        positions[o + 5] = 0
      }
    }
    arcGeo.attributes.position.needsUpdate = true
  }

  return {
    group,
    pose(p, out) {
      const z = q.mobile ? lerp(46, 19, smooth(0.15, 1, p)) : lerp(44, 12.5, smooth(0.15, 1, p))
      out.pos.set(0, HIGH + lerp(1.6, -0.2, p), z0 + z)
      out.target.set(0, HIGH - 0.1, z0)
    },
    update(p, t, _dt, pointer) {
      plates.rotation.z = t * 0.05
      if (t > nextArc) {
        rebuildArcs(pointer)
        nextArc = t + 0.075
      }
      const power = clamp01(0.35 + p)
      ;(arcMesh.material as MeshBasicMaterial).opacity = power * (0.7 + Math.random() * 0.3)
      haze.material.opacity = 0.04 + power * 0.07 + Math.random() * 0.01
    },
  }
}
