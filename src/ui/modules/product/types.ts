/**
 * Local structural prop types for product UI modules.
 *
 * Boundary: ui MUST NOT import `commerce` (lint-enforced). UI modules accept
 * structurally-compatible shapes; the app-layer orchestrator wires commerce's
 * actual `ProductEntry` / `Finish` / `FitResult` into these. TypeScript's
 * structural typing keeps the contract honest without crossing the boundary.
 */

export interface ProductSummary {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly price: {
    readonly amount: number;
    readonly currency: 'BDT';
  };
  readonly dimensionsMeters: {
    readonly width: number;
    readonly depth: number;
    readonly height: number;
  };
}

export interface FinishOption {
  readonly id: string;
  readonly label: string;
  readonly story: string;
  readonly sRGBHex: string;
}

export type FitVerdict = 'fits' | 'tight' | 'tooLarge';

export interface FitView {
  readonly verdict: FitVerdict;
  readonly clearanceMeters: number;
}
