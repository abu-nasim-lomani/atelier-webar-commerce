/**
 * Renderer colour/tone configuration — the highest-ROI "premium" lever.
 *
 * ACES Filmic tone mapping + correct sRGB output + a calm neutral exposure.
 * No post-processing (thermal trap, low ROI). Framework-free; `three` is
 * permitted in the render layer.
 */
import * as THREE from 'three';

export const RENDERER = {
  toneMapping: THREE.ACESFilmicToneMapping,
  exposure: 1,
  outputColorSpace: THREE.SRGBColorSpace,
} as const;
