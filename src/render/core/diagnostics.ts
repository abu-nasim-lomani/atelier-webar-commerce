/**
 * Render diagnostics — minimal, opt-in, no UI.
 *
 * Only sampled on frames that actually render (demand mode → near-zero when
 * idle). Logging is gated behind localStorage `atelier:render-debug` = "1" and
 * throttled. Framework-free.
 */

const SMOOTHING = 0.1;
const LOG_INTERVAL_MS = 1000;

let emaFps = 0;
let lastLog = 0;

function debugEnabled(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem('atelier:render-debug') === '1';
  } catch {
    return false;
  }
}

export function sampleFrame(delta: number): void {
  if (delta <= 0) return;
  const fps = 1 / delta;
  emaFps = emaFps === 0 ? fps : emaFps * (1 - SMOOTHING) + fps * SMOOTHING;

  if (!debugEnabled()) return;
  const now = typeof performance === 'undefined' ? Date.now() : performance.now();
  if (now - lastLog < LOG_INTERVAL_MS) return;
  lastLog = now;
  console.debug(`[render] ~${emaFps.toFixed(1)} fps`);
}

export function getFps(): number {
  return emaFps;
}
