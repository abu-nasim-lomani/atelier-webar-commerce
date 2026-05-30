/**
 * Product catalog — the commercial entries for the hero set.
 *
 * Pure domain data: no UI, no rendering, no framework. Dimensions are NOT
 * duplicated; they reference `config/hero-asset.ts` (the single source shared
 * with the offline manifest and the runtime placeholder) so a real GLB swap
 * later changes nothing here.
 *
 * Strategy (locked): hero SKUs only — start with one flagship sofa, prove the
 * funnel, then scale the curated set.
 */
import { HERO_SOFA } from '@config/hero-asset';

export interface ProductPriceBDT {
  readonly amount: number;
  readonly currency: 'BDT';
}

export interface ProductEntry {
  /** Matches `assets-pipeline/manifest.ts` and the render placeholder id. */
  readonly id: string;
  /** URL slug for the product route (Phase E2). */
  readonly slug: string;
  readonly name: string;
  readonly tagline: string;
  readonly description: string;
  readonly price: ProductPriceBDT;
  readonly dimensionsMeters: typeof HERO_SOFA.dimensionsMeters;
  readonly defaultFinishId: string;
  readonly availableFinishIds: readonly string[];
}

export const catalog: readonly ProductEntry[] = [
  {
    id: HERO_SOFA.id,
    slug: 'hero-sofa',
    name: 'The Atelier Sofa',
    tagline: 'Three seats, considered.',
    description:
      'A three-seat sofa built around quiet comfort and honest materials. Solid frame, considered proportions — designed to be lived with, not noticed.',
    price: { amount: 35000, currency: 'BDT' },
    dimensionsMeters: HERO_SOFA.dimensionsMeters,
    defaultFinishId: 'oak-natural',
    availableFinishIds: ['oak-natural', 'walnut', 'linen-bone', 'charcoal'],
  },
];

/** Resolve a product by its URL slug. Returns null when no entry matches. */
export function findProductBySlug(slug: string): ProductEntry | null {
  return catalog.find((entry) => entry.slug === slug) ?? null;
}
