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
    return canvas.getContext('webgl2') !== null;
  } catch {
    return false;
  }
}

export function detectTier(): DeviceTier {
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
