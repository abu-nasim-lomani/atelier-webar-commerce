/**
 * Asset manifest — the typed contract between the (offline) pipeline and the
 * (runtime) renderer. The CI budget gate validates this; later phases read it
 * to choose a tier variant. Framework-free; no `three`/`react` here.
 *
 * `hero-sofa` now ships a real optimised GLB (the "Mid Century Modern Sofa",
 * CC-BY — see CREDITS.md). The budget gate validates its declared `high`
 * variant against config/perf-budget.ts.
 *
 * Dimensions come from config/hero-asset.ts (single source shared with the
 * runtime model fit) — never duplicated here.
 */
import { HERO_SOFA } from '../config/hero-asset';

export type AssetTier = 'low' | 'high';

export interface AssetVariant {
  /** Public, content-hashed path (e.g. /assets/hero-sofa.high.<hash>.glb). */
  readonly file: string;
  readonly fileBytes: number;
  readonly triangles: number;
  readonly textureBytes: number;
  readonly textureMaxPx: number;
}

export interface AssetDimensions {
  readonly width: number;
  readonly depth: number;
  readonly height: number;
}

export interface AssetEntry {
  readonly id: string;
  /** true → no GLB yet; gate enforces only true-scale + floor origin. */
  readonly placeholder: boolean;
  readonly dimensionsMeters: AssetDimensions;
  readonly originFloorCentered: boolean;
  /** Material/finish slot names (future configurator). */
  readonly materials: readonly string[];
  readonly variants?: Partial<Record<AssetTier, AssetVariant>>;
  readonly usdz?: string;
  readonly poster?: string;
}

export type AssetManifest = readonly AssetEntry[];

export const assetManifest: AssetManifest = [
  {
    id: HERO_SOFA.id,
    placeholder: false,
    dimensionsMeters: HERO_SOFA.dimensionsMeters,
    originFloorCentered: true,
    materials: ['oak-natural'],
    variants: {
      high: {
        file: '/models/hero-sofa.glb',
        fileBytes: 3000032,
        triangles: 5403,
        textureBytes: 2768204,
        textureMaxPx: 2048,
      },
    },
  },
];
