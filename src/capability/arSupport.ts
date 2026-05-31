/**
 * Platform + AR-support detection (leaf layer; depends only on standard DOM
 * globals). SSR-safe. Conservative — when in doubt, returns `'other'` so the
 * AR layer falls back gracefully instead of promising a feature the device
 * cannot deliver. The full async tier/capability controller (Phase H) consumes
 * this; for Phase F1 we only need the platform discriminator.
 */

export type Platform = 'ios' | 'android' | 'other';

export function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;

  // iPad on iPadOS 13+ reports the desktop Mac UA; the touch-count hint
  // distinguishes it from a real Mac.
  const isIPad = ua.includes('Macintosh') && navigator.maxTouchPoints > 1;
  if (/iPad|iPhone|iPod/.test(ua) || isIPad) return 'ios';

  if (ua.includes('Android')) return 'android';
  return 'other';
}
