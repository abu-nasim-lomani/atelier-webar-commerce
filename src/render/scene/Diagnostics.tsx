/**
 * Diagnostics — frame sampler, no UI.
 *
 * `useFrame` runs ONLY on frames that actually render. Under `frameloop=
 * "demand"` that is near-zero when idle, so this never forces continuous
 * rendering. It must never invalidate (that would create a render loop).
 *
 * R3F hook only — no `react` import.
 */
import { useFrame } from '@react-three/fiber';
import { sampleFrame } from '../core/diagnostics';

export function Diagnostics(): null {
  useFrame((_, delta) => {
    sampleFrame(delta);
  });
  return null;
}
