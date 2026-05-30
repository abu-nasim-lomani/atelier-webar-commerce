/**
 * Token → linear THREE.Color bridge.
 *
 * UI tokens are sRGB; the renderer needs linear-light values for correct PBR.
 * This is the ONLY sanctioned way render code consumes a colour — no raw hex
 * literals in the render layer (lint-enforced).
 */
import * as THREE from 'three';
import { hexToLinear } from '@/tokens';

export function linearColor(hex: string): THREE.Color {
  const lin = hexToLinear(hex);
  const color = new THREE.Color();
  color.setRGB(lin.r, lin.g, lin.b, THREE.LinearSRGBColorSpace);
  return color;
}
