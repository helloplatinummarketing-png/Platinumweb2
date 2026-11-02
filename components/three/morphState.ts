/** Written by the How It Works scroll timeline and read by the render loop. */
export const morphState = {
  /** 0 = scattered cloud, 1 = structured grid. */
  build: 0,
  /** 0 = still grid, 1 = streaming into the glowing core. */
  stream: 0,
  invalidate: () => {},
}
