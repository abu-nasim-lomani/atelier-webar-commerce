/**
 * Fit checker — directly answers the locked #1 buyer fear: "will it fit?".
 *
 * Pure function, no UI: takes a real room width and the product width in
 * metres, returns a verdict + the actual clearance. The UI (Phase E2) maps
 * the verdict to a calm token-coloured indicator (`confirm`/`caution`/`alert`).
 */

export type FitVerdict = 'fits' | 'tight' | 'tooLarge';

export interface FitResult {
  readonly verdict: FitVerdict;
  /** Room width minus product width (metres). Negative when the piece is too large. */
  readonly clearanceMeters: number;
}

/** Recommended breathing room beside a sofa for circulation / visual rest. */
const RECOMMENDED_CLEARANCE_M = 0.3;

export function checkFit(
  roomWidthMeters: number,
  productWidthMeters: number,
): FitResult {
  const clearance = roomWidthMeters - productWidthMeters;
  if (clearance < 0) {
    return { verdict: 'tooLarge', clearanceMeters: clearance };
  }
  if (clearance < RECOMMENDED_CLEARANCE_M) {
    return { verdict: 'tight', clearanceMeters: clearance };
  }
  return { verdict: 'fits', clearanceMeters: clearance };
}
