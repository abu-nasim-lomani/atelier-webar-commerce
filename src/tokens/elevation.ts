/**
 * ELEVATION — UI shadows only.
 *
 * Two-system rule (Phase 4): UI elevation is barely-there and warm; the PRODUCT
 * contact shadow is a separate render-owned brand asset (see color.ts). Most UI
 * is `none` and separates by tone, not shadow.
 */
import { shadowRGB } from './primitive';

const s = (a: number): string =>
  `rgba(${String(shadowRGB.r)}, ${String(shadowRGB.g)}, ${String(shadowRGB.b)}, ${String(a)})`;

export const elevation = {
  /** Default. The honest answer for almost everything. */
  none: 'none',
  /** Resting sheet / action bar. */
  e1: `0 1px 2px ${s(0.04)}, 0 8px 24px ${s(0.05)}`,
  /** Raised / active sheet. */
  e2: `0 2px 8px ${s(0.05)}, 0 16px 40px ${s(0.07)}`,
} as const;
