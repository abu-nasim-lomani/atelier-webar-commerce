/**
 * Cubic-bézier sampler — the JS side of the locked easing curves.
 *
 * Control points come from the token typed channel (`easingPoints`), so the
 * render motion and the CSS motion are literally the same curve. Standard
 * Newton-Raphson solve with a clamp (the well-known UnitBezier approach).
 * Framework-free.
 */
import { easingPoints } from '@/tokens';

function cubicBezier(
  p1x: number,
  p1y: number,
  p2x: number,
  p2y: number,
): (x: number) => number {
  const cx = 3 * p1x;
  const bx = 3 * (p2x - p1x) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * p1y;
  const by = 3 * (p2y - p1y) - cy;
  const ay = 1 - cy - by;

  const sampleX = (t: number): number => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number): number => ((ay * t + by) * t + cy) * t;
  const sampleSlopeX = (t: number): number => (3 * ax * t + 2 * bx) * t + cx;

  const solveX = (x: number): number => {
    let t = x;
    for (let i = 0; i < 6; i += 1) {
      const error = sampleX(t) - x;
      const slope = sampleSlopeX(t);
      if (Math.abs(error) < 1e-5 || slope === 0) break;
      t -= error / slope;
    }
    return t < 0 ? 0 : t > 1 ? 1 : t;
  };

  return (x: number): number =>
    x <= 0 ? 0 : x >= 1 ? 1 : sampleY(solveX(x));
}

const [ax, ay, bx, by] = easingPoints.authority;

/** The signature curve — long decel settle. Input/return clamped to [0,1]. */
export const easeAuthority = cubicBezier(ax, ay, bx, by);
