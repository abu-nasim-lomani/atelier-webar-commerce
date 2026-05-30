/**
 * Hero asset identity & true-scale dimensions — single source of truth.
 *
 * Consumed by BOTH the offline manifest (assets-pipeline) and the runtime
 * placeholder (src/render) so the placeholder is dimensionally identical to
 * what the real GLB must be, and the swap later changes nothing here.
 *
 * Metres. Matches the real hero GLB ("Mid Century Modern Sofa"): the model is
 * uniformly scaled at runtime so its width is `width`, and these depth/height
 * values are that model's true proportions at that width — so the dimensions
 * shown to the buyer match what is rendered.
 */
export const HERO_SOFA = {
  id: 'hero-sofa',
  dimensionsMeters: { width: 2.05, depth: 0.95, height: 0.88 },
} as const;
