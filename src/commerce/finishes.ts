/**
 * Finishes — the configurator's vocabulary.
 *
 * Locked discipline: 2–4 curated finishes (never a fabric library); each
 * finish has a one-word story ("Oak — warm, honest"). Colours are pulled
 * from the palette token — never a raw hex here.
 *
 * The runtime material colour for the 3D placeholder (and the real GLB
 * later) is derived from `sRGBHex` via `linearColor()` in the render layer.
 */
import { palette } from '@/tokens';

export interface Finish {
  readonly id: string;
  readonly label: string;
  /** One-word story (premium framing, not an SKU code). */
  readonly story: string;
  /** sRGB hex used for swatch UI and the render-side material colour. */
  readonly sRGBHex: string;
}

export const finishes: readonly Finish[] = [
  { id: 'oak-natural', label: 'Oak natural', story: 'Warm',  sRGBHex: palette.clay },
  { id: 'walnut',      label: 'Walnut',      story: 'Deep',  sRGBHex: palette.umber },
  { id: 'linen-bone',  label: 'Linen bone',  story: 'Soft',  sRGBHex: palette.linen },
  { id: 'charcoal',    label: 'Charcoal',    story: 'Quiet', sRGBHex: palette.espresso },
];

/** Resolve a finish by id; null when not found (callers fall back to default). */
export function findFinishById(id: string): Finish | null {
  return finishes.find((f) => f.id === id) ?? null;
}
