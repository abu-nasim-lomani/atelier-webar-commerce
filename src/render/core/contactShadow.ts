/**
 * Contact-shadow texture — a soft radial ALPHA mask, generated once.
 *
 * Grayscale falloff only (the warm tint comes from a token-coloured material,
 * never a hex here). Memoised module-level: created on first use, reused for
 * the app lifetime. Framework-free; `three` is permitted in the render layer.
 *
 * This is the cheap, calm grounding shadow — no real-time shadow mapping
 * (locked: thermal trap on mid-range Android, low ROI).
 */
import * as THREE from 'three';

const SIZE = 256;

let cached: THREE.CanvasTexture | null = null;

export function getContactShadowTexture(): THREE.CanvasTexture | null {
  if (cached !== null) return cached;
  if (typeof document === 'undefined') return null;

  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (ctx === null) return null;

  const c = SIZE / 2;
  const gradient = ctx.createRadialGradient(c, c, 0, c, c, c);
  // Dense, soft core fading fully to transparent — premium, not a hard blob.
  gradient.addColorStop(0, 'rgba(255, 255, 255, 0.85)');
  gradient.addColorStop(0.55, 'rgba(255, 255, 255, 0.35)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cached = texture;
  return cached;
}
