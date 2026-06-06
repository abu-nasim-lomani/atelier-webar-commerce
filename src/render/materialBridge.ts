/**
 * Material bridge — the imperative seam between commerce (via app) and the
 * sofa's render material.
 *
 * Framework-free singleton (like `renderController`): an sRGB hex string in,
 * a linear-space `THREE.Color` out + a "pending apply" flag that the render
 * loop drains. Calling `setFinishHex()` requests a frame via the controller,
 * so the next demand-driven render picks up the change (no continuous loop).
 *
 * The render layer NEVER imports commerce/state; the app layer pushes here.
 */
import * as THREE from 'three';
import { hexToLinear } from '@/tokens';
import { renderController } from './controller';

let target: THREE.Color | null = null;
let pending = false;

function applyHexToTarget(hex: string): void {
  const lin = hexToLinear(hex);
  if (target === null) target = new THREE.Color();
  target.setRGB(lin.r, lin.g, lin.b, THREE.LinearSRGBColorSpace);
}

export const materialBridge = {
  /** App-layer call: set the active finish colour and request a frame. */
  setFinishHex(hex: string): void {
    applyHexToTarget(hex);
    pending = true;
    renderController.requestFrame();
  },
  /**
   * Reset to the model's natural look (no tint): a white multiplier so the
   * baseColour texture shows as authored. The default finish renders this way.
   */
  setNatural(): void {
    if (target === null) target = new THREE.Color();
    target.setRGB(1, 1, 1, THREE.LinearSRGBColorSpace);
    pending = true;
    renderController.requestFrame();
  },
  /** Render-side: returns the colour if it's been updated since last consume. */
  consume(): THREE.Color | null {
    if (!pending) return null;
    pending = false;
    return target;
  },
};
