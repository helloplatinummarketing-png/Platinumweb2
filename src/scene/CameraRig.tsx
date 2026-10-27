import { OrbitControls } from '@react-three/drei'

/**
 * Step 2 preview rig: free orbit so the core can be inspected.
 * Replaced by the scroll-driven shot rig in step 3.
 */
export function CameraRig() {
  return (
    <OrbitControls
      target={[0, 0.2, 0]}
      enableDamping
      dampingFactor={0.08}
      minDistance={3}
      maxDistance={18}
      maxPolarAngle={Math.PI * 0.55}
      enablePan={false}
    />
  )
}
