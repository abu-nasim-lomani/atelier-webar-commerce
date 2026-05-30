/**
 * Stage anchor — the single source for "where is the Hero stage on screen".
 *
 * The scissor/viewport rect is derived from the CANVAS's own measured size
 * (`canvas.width / clientWidth`), NOT from `window` + an assumed devicePixel
 * ratio. That makes the DOM↔WebGL mapping exact and immune to fractional
 * display scaling (Windows 125%/150%) — the bug that pushed the sofa out of
 * the frame. StageView and the gating logic share this so they never disagree.
 */
const STAGE_SELECTOR = '[data-render-stage]';

function visibleStageRect(): DOMRect | null {
  if (typeof document === 'undefined' || typeof window === 'undefined') {
    return null;
  }
  const el = document.querySelector(STAGE_SELECTOR);
  if (el === null) return null;

  const r = el.getBoundingClientRect();
  if (
    r.width <= 0 ||
    r.height <= 0 ||
    r.bottom <= 0 ||
    r.top >= window.innerHeight
  ) {
    return null;
  }
  return r;
}

export interface StageViewport {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

/**
 * The stage rect in the canvas's drawing-buffer space (origin bottom-left),
 * positioned RELATIVE TO THE CANVAS using its real CSS↔buffer scale. Null when
 * absent/off-screen or the canvas has no size yet.
 */
export function getStageViewport(
  canvas: HTMLCanvasElement,
): StageViewport | null {
  const r = visibleStageRect();
  if (r === null) return null;

  const cb = canvas.getBoundingClientRect();
  if (cb.width <= 0 || cb.height <= 0) return null;

  const scaleX = canvas.width / cb.width;
  const scaleY = canvas.height / cb.height;

  const w = r.width * scaleX;
  const h = r.height * scaleY;
  const x = (r.left - cb.left) * scaleX;
  const yTopInCanvas = (r.top - cb.top) * scaleY;
  const y = canvas.height - (yTopInCanvas + h); // GL origin is bottom-left

  return { x, y, w, h };
}

/**
 * Normalised scroll progress of the stage: 0 at rest (top of page), → 1 as it
 * scrolls one viewport up and away. Null when absent/off-screen. Same anchor
 * as the viewport, so dolly/visibility and scissor never disagree.
 */
export function getStageProgress(): number | null {
  const r = visibleStageRect();
  if (r === null || typeof window === 'undefined') return null;
  const p = -r.top / window.innerHeight;
  return p < 0 ? 0 : p > 1 ? 1 : p;
}
