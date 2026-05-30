/**
 * Stage anchor — "is the stage visible? how far has it scrolled?"
 *
 * The canvas now lives inside the stage div (DOM-flow architecture), so
 * positioning is solved structurally — no scissor maths here any more. What
 * remains is visibility gating (the drivers don't waste frames off-screen)
 * and the dolly's scroll progress, both derived from the stage element's
 * bounding rect via `document.querySelector('[data-render-stage]')`.
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

/**
 * Normalised scroll progress of the stage: 0 at rest, → 1 as it scrolls one
 * viewport up. Null when absent/off-screen. CinematicDriver visibility gating
 * and CameraDolly read this — never disagree because they share the source.
 */
export function getStageProgress(): number | null {
  const r = visibleStageRect();
  if (r === null || typeof window === 'undefined') return null;
  const p = -r.top / window.innerHeight;
  return p < 0 ? 0 : p > 1 ? 1 : p;
}
