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

/**
 * Async WebXR immersive-AR support probe (deferred from F1; consumed by F3).
 *
 * `navigator.xr.isSessionSupported('immersive-ar')` is the only honest signal
 * that the device can run the in-browser custom session (ARCore on Android
 * Chrome). SSR-safe and defensive — any absence or rejection means "no", so the
 * launcher falls back to Scene Viewer (F1) / Room Preview (F2), never promising
 * a session the device can't deliver.
 */
export async function isImmersiveArSupported(): Promise<boolean> {
  if (typeof navigator === 'undefined') return false;
  const xr = navigator.xr;
  if (xr === undefined) return false;
  try {
    return await xr.isSessionSupported('immersive-ar');
  } catch {
    return false;
  }
}
