/**
 * Camera rig — the cinematic default framing. Framework-free, no animation.
 *
 * A slightly long lens (calm, premium, low distortion) composed around the
 * future product-anchor at the origin with deliberate negative space above.
 * `framingForAspect` is the responsive seam (portrait pulls back gently) —
 * later cinematic phases animate from these resting values, never in B1.
 */

export type Vec3 = readonly [number, number, number];

export const CAMERA = {
  fov: 32,
  near: 0.1,
  far: 100,
  position: [0, 1.15, 4.6] as Vec3,
  target: [0, 0.5, 0] as Vec3,
} as const;

export interface Framing {
  readonly fov: number;
  readonly position: Vec3;
}

export function framingForAspect(aspect: number): Framing {
  if (aspect < 1) {
    // Portrait (phone, primary target): step back, widen a touch.
    return { fov: CAMERA.fov + 4, position: [0, 1.2, 5.3] };
  }
  return { fov: CAMERA.fov, position: CAMERA.position };
}

/**
 * Scroll dolly — a deliberately tiny recession as the hero scrolls away
 * (locked: cinematic, never parallax-abuse). progress 0 = resting framing.
 */
export const DOLLY_OFFSET = { y: 0.16, z: 0.5 } as const;

export function dollyPosition(progress: number): Vec3 {
  const [x, y, z] = CAMERA.position;
  return [x, y + DOLLY_OFFSET.y * progress, z + DOLLY_OFFSET.z * progress];
}
