/**
 * Asset budget gate — the enforced half of ASSET_SPEC.md.
 *
 *   pnpm assets:check   → exit 1 if any entry violates config/perf-budget.ts
 *
 * Relative imports (not @config alias) so `tsx` resolves it the same way the
 * tokens generator does. Framework-free Node script; not shipped to the client.
 */
import { perfBudget } from '../config/perf-budget';
import { assetManifest, type AssetEntry } from './manifest';

const MAX_PLAUSIBLE_DIM_M = 10;
const BYTES_PER_MB = 1024 * 1024;

const mb = (bytes: number): string => (bytes / BYTES_PER_MB).toFixed(2);

function validateEntry(entry: AssetEntry): string[] {
  const errors: string[] = [];
  const { width, depth, height } = entry.dimensionsMeters;

  if (width <= 0 || depth <= 0 || height <= 0) {
    errors.push(`${entry.id}: dimensionsMeters must be positive (true scale).`);
  }
  if (
    width > MAX_PLAUSIBLE_DIM_M ||
    depth > MAX_PLAUSIBLE_DIM_M ||
    height > MAX_PLAUSIBLE_DIM_M
  ) {
    errors.push(
      `${entry.id}: dimensionsMeters implausible (> ${String(MAX_PLAUSIBLE_DIM_M)} m).`,
    );
  }
  if (!entry.originFloorCentered) {
    errors.push(`${entry.id}: origin must be floor-centred (locked).`);
  }

  // A declared placeholder has no GLB — only the non-negotiables apply.
  if (entry.placeholder) return errors;

  const high = entry.variants?.high;
  if (high === undefined) {
    errors.push(`${entry.id}: non-placeholder must provide a 'high' variant.`);
    return errors;
  }

  const ceilingBytes = perfBudget.payload.heroGlbCeilingMb * BYTES_PER_MB;
  if (high.fileBytes > ceilingBytes) {
    errors.push(
      `${entry.id}: high GLB ${mb(high.fileBytes)} MB exceeds ceiling ${String(
        perfBudget.payload.heroGlbCeilingMb,
      )} MB.`,
    );
  }
  if (high.triangles > perfBudget.scene.triHardMax) {
    errors.push(
      `${entry.id}: high tris ${String(high.triangles)} exceed hard max ${String(
        perfBudget.scene.triHardMax,
      )}.`,
    );
  }
  if (high.textureMaxPx > perfBudget.scene.textureHeroMaxPx) {
    errors.push(
      `${entry.id}: high texture ${String(high.textureMaxPx)}px exceeds ${String(
        perfBudget.scene.textureHeroMaxPx,
      )}px.`,
    );
  }

  const low = entry.variants?.low;
  if (low !== undefined && low.textureMaxPx > perfBudget.scene.textureSecondaryMaxPx) {
    errors.push(
      `${entry.id}: low texture ${String(low.textureMaxPx)}px exceeds ${String(
        perfBudget.scene.textureSecondaryMaxPx,
      )}px.`,
    );
  }

  return errors;
}

const allErrors = assetManifest.flatMap(validateEntry);

if (allErrors.length > 0) {
  console.error('✗ Asset budget gate failed:');
  for (const error of allErrors) console.error(`  - ${error}`);
  process.exit(1);
}

const count = assetManifest.length;
console.log(
  `✓ Asset manifest within budget (${String(count)} entr${count === 1 ? 'y' : 'ies'}).`,
);
