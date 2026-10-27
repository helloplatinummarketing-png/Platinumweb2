# Platinum Core — 3D prototype

A single scroll-driven WebGL experience for platinummarketingagency.co.uk. Every
section is a camera shot of one procedural machine, the "Platinum Core". Its
12 panel-petals light up gold as the system switches on.

Vite · React · TypeScript · three / @react-three/fiber / drei / postprocessing ·
GSAP ScrollTrigger + Lenis · Tailwind v4.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build to dist/
npm run preview    # serve dist/
npm run lint       # oxlint
```

### Test switches (add to the URL)

| Flag        | What it does                                                         |
| ----------- | -------------------------------------------------------------------- |
| `?motion`   | Force the full experience, even if the OS has "reduce motion" on     |
| `?reduced`  | Force the reduced-motion version (still render + normal page)        |
| `?nowebgl`  | Force the no-WebGL version (poster image + normal page)              |
| `?forcewebgl` | Allow software-rendered WebGL (normally those devices get the poster) |

Heads-up: if Windows has **Settings → Accessibility → Visual effects →
Animation effects** turned off, the browser reports `prefers-reduced-motion`
and you'll see the still version. Use `?motion` to preview the full site.

## Edit copy — `src/content/copy.ts`

All text lives here: headings, body copy, stats, pricing tiers, FAQ, footer,
links (booking URL, phone, email) and the 12 petal names in the hover tooltips.
Change the strings and the page updates.

- **Labels pinned to petals:** items with a `petal` field (stats, hero chips, process
  steps, Why Us points) attach to that petal (0–11). Change the number to move
  a label.
- **FAQ answers marked `// TODO: confirm`** were written for this prototype and
  need checking before going live.
- **Case-study screen:** `work.caseStudy.screenshot` points at
  `public/work/bristol-spark.jpg` (a capture of the live site). To update it,
  replace the file. A wide image (around 2.4:1) looks best.

## Tune the shots — `src/timeline/shots.ts`

The storyboard. Each shot defines:

| Field                         | Meaning                                                     |
| ----------------------------- | ----------------------------------------------------------- |
| `camera`, `target`, `fov`     | Camera position, look-at point, lens                         |
| `shift`                       | Slides the core sideways in frame (desktop), e.g. `0.22` = right |
| `unfold`                      | 0 closed bud → 1 fully open                                  |
| `litCount`                    | Petals switched on, out of 12                                |
| `scatter`, `flicker`, `cold`  | "Problem" state: panels drift apart, flicker, blue light    |
| `charge`, `glow`, `hubSpin`   | Core glow, panel brightness, gear speed                      |
| `path`, `screen`, `coreYaw`   | Process light path, case-study screen, core rotation         |
| `pin`, `length`, `mobileLength` | Hold the section on screen for N viewports               |
| `steps`                       | Keyframes played evenly while the shot is pinned             |

Each shot inherits the previous shot's end state, so you only list what changes.
Shot timing is measured from the real DOM sections, so changing copy length
never puts the camera and the text out of sync.

Units: the hub is at the origin, open petal tips reach about 3.6, and the floor
is at y = -1.62.

## How it fits together

```
src/
  content/copy.ts            all copy
  timeline/shots.ts          storyboard (camera + core state per shot)
  timeline/useMasterTimeline one GSAP timeline, scrubbed by ScrollTrigger + Lenis
  scene/state.ts             shared mutable state: the timeline writes, scene + HUD read
  scene/Core.tsx             hub + instanced petals, hover hit-testing, anchors
  scene/Petal.tsx            petal layout data (panels, rails, hinge transform)
  scene/materials.ts         platinum, graphite, solar-cell panel shader
  scene/CameraRig, Lights, Atmosphere, Effects, Screen, LightPath, AnchorProjector
  ui/                        Nav, Hud, Loader, GlassCard, MagneticButton, sections/*
```

Labels track the core through `AnchorProjector`: any element with
`data-anchor="petal:3"` (or `hub` / `screen`) is moved to that point's screen
position every frame. Phones and the static versions show the same labels in
normal flow instead.

## Swap in a Blender model later

The core is procedural so it runs without asset files. Its geometry is kept
separate from its animation, so a `.glb` can replace the geometry while the
timeline, lighting and labels keep working.

1. In Blender, model the **hub** (any number of meshes) and **one petal**, with its
   panels as separate child meshes. Lay the petal out along +X from the hinge
   (hinge at the origin), with +Y as its face normal. Export as
   `public/models/core.glb`.
2. **Hub:** in `Core.tsx`, load it with `useGLTF('/models/core.glb')` and replace
   the `hubGeo` / `pedestalGeo` meshes with the hub nodes. Keep the `<group ref={rootRef}>`
   wrapper so it still tilts and turns.
3. **Panels:** replace `buildPetalPanels()` with a function that reads the petal's
   child meshes and returns `{ matrix, row, width }` for each (`matrix` = the child's
   local matrix, `row` = its distance band from the hinge, `width` = 1 if the
   geometry is already the right size). Pass one panel's geometry to
   `createPanelGeometry()`'s place. The instancing, gold ignition shader,
   scatter and hover all keep working.
4. Keep `petalMatrix()` for how petals open, or replace it with baked
   animation sampled by `sceneState.unfold`.

Keep panels as one `InstancedMesh`. Separate meshes per panel would mean
hundreds of draw calls.

## Performance notes

- 41 draw calls per frame, including post-processing (target < 50).
- The 3D bundle is lazy-loaded after first paint and browser idle. The first
  page load is about 130 kB of gzipped JS, with the poster image shown until the scene is ready.
- Shaders are precompiled asynchronously before the render loop starts. The
  loader's counter waits for that.
- `PerformanceMonitor` drops to DPR 1 and a lighter effect chain on struggling GPUs.
- Phones get 6 petals, no film grain and lighter bloom.
- Depth of field was removed in the performance pass (it was optional in the
  brief). `scene/Effects.tsx` explains how to add it back.

### Measured on the dev machine (Intel HD 520, 2015 integrated GPU, cold cache)

| Lighthouse desktop     | Full 3D | Without WebGL |
| ---------------------- | ------- | ------------- |
| Performance            | ~52     | 77            |
| Accessibility          | 100     | 100           |
| Best practices / SEO   | 100     | 100           |
| LCP                    | 1.6 s   | 1.6 s         |
| Total blocking time    | ~7 s    | 0.13 s        |

On this GPU, every rendered frame blocks the main thread and counts towards
TBT. The ≥ 80 target has **not** been verified on a mid-range laptop. Run
Lighthouse there before signing off.

## To do before launch

- Confirm the FAQ answers marked `// TODO: confirm` in `copy.ts`.
- Upload `public/og-image.jpg` with the site so the Open Graph link resolves.
- Swap the case-study screenshot for an approved one if needed.
