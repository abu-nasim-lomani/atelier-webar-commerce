/**
 * Product UI modules — pure presentational, prop-driven (E2).
 * Orchestration (commerce + state wiring) lives in the app/product route.
 */
export { ProductHero } from './ProductHero';
export { Dimensions } from './Dimensions';
export { FinishSelector } from './FinishSelector';
export { FitChecker } from './FitChecker';
export { ProductActionBar } from './ProductActionBar';
export { ProductAssurance } from './ProductAssurance';
export type {
  ProductSummary,
  FinishOption,
  FitView,
  FitVerdict,
} from './types';
