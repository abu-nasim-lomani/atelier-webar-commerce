/**
 * Quality presets — three calm tiers. Framework-free.
 *
 * `maxDpr` is always clamped by the locked Phase-5 perf budget (full DPR on a
 * 3× screen is a silent killer). No tier enables shadows or post-processing in
 * B1 — those are later, deliberate decisions.
 */
import { perfBudget } from '@config/perf-budget';
import type { DeviceTier } from './deviceProfile';

export type PowerPreference = 'default' | 'high-performance' | 'low-power';

export interface QualityPreset {
  readonly tier: DeviceTier;
  readonly maxDpr: number;
  readonly antialias: boolean;
  readonly powerPreference: PowerPreference;
}

const DPR_CEILING = perfBudget.scene.dprClampMax;

const clampDpr = (value: number): number => Math.min(value, DPR_CEILING);

export function getPreset(tier: DeviceTier): QualityPreset {
  switch (tier) {
    case 'low':
      return {
        tier,
        maxDpr: clampDpr(1),
        antialias: false,
        powerPreference: 'low-power',
      };
    case 'premium':
      return {
        tier,
        maxDpr: clampDpr(2),
        antialias: true,
        powerPreference: 'high-performance',
      };
    case 'balanced':
    default:
      return {
        tier,
        maxDpr: clampDpr(1.5),
        antialias: false,
        powerPreference: 'default',
      };
  }
}
