/**
 * Device profiling — conservative, no benchmarking.
 *
 * Framework-free. Reads cheap, stable signals only (no timed GPU probes, no
 * heuristics that can flip frame-to-frame). Defaults to the middle tier; only
 * demotes to `low` on clear constraint, only promotes to `premium` on clear
 * headroom. SSR-safe.
 */

export type DeviceTier = 'low' | 'balanced' | 'premium';

/** Non-standard signals only — `hardwareConcurrency` is already on Navigator. */
interface NavigatorSignals {
  readonly deviceMemory?: number;
  readonly connection?: {
    readonly saveData?: boolean;
    readonly effectiveType?: string;
  };
}

function hasWebGL2(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('webgl2');
    if (ctx === null) return false;
    // Release the probe context immediately. WebGL contexts are a scarce
    // resource (~16 per page); a leaked probe per call floods the limit and
    // evicts the real render canvas ("Too many active WebGL contexts").
    ctx.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

// Device signals don't change within a session, and the WebGL2 probe is not
// free — compute the tier once and reuse it. `detectTier()` is called from
// render bodies (RenderCanvas / RoomPreviewCanvas), which can re-run many times
// per second during interaction; without this memo each call leaked a context.
let cachedTier: DeviceTier | null = null;

function computeTier(): DeviceTier {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return 'balanced';
  }

  const nav = navigator as Navigator & NavigatorSignals;
  const memory = nav.deviceMemory ?? 4;
  const cores = nav.hardwareConcurrency;
  const saveData = nav.connection?.saveData ?? false;
  const slowNet =
    nav.connection?.effectiveType === 'slow-2g' ||
    nav.connection?.effectiveType === '2g';

  if (!hasWebGL2() || memory <= 2 || saveData || slowNet) {
    return 'low';
  }
  if (memory >= 8 && cores >= 8) {
    return 'premium';
  }
  return 'balanced';
}

export function detectTier(): DeviceTier {
  // Don't cache the SSR fallback — recompute on the client so the real signals
  // (and the WebGL2 probe) decide once hydrated.
  if (typeof window === 'undefined') return 'balanced';
  cachedTier ??= computeTier();
  return cachedTier;
}
