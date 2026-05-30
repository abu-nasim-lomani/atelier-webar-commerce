# 3D Asset Spec — the contract

This is the moat. Every hero asset MUST satisfy this spec; the CI budget gate
(`pnpm assets:check`) enforces the machine-checkable parts. Budgets are not
restated here — they live in `config/perf-budget.ts` (single source of truth)
and the gate reads them directly.

> Strategy: digitise **hero SKUs only** (10–30), never the catalogue. Start
> with one flagship sofa, prove the funnel, then scale the hero set.

## 1. Units & scale

- Units are **metres**. Real-world scale, always — never resized to flatter.
- The gate rejects non-positive or implausible (> 10 m) dimensions.

## 2. Origin & orientation

- Origin is **floor-centred**: x/z centred on the footprint, **y = 0 at the
  floor contact plane** (`originFloorCentered: true`).
- +Y up, front facing −Z. This lets the product drop onto the
  `product-anchor` and the contact shadow sit at y ≈ 0 with no per-asset fixups.

## 3. Geometry budget

- ≤ `perfBudget.scene.triBudget` target, hard cap `triHardMax`.
- Single hero mesh group; detail comes from normal maps, not triangles.

## 4. Texture budget

- **KTX2 / Basis mandatory** (ETC1S colour, UASTC normal). No uncompressed.
- Hero ≤ `textureHeroMaxPx`, secondary ≤ `textureSecondaryMaxPx`. ORM packed.

## 5. Materials & finish slots

- 2–4 shared materials. Material names are the future configurator finish
  slots (declared in the manifest `materials`). No clearcoat/transmission/sheen.

## 6. Deliverables (per hero asset)

- `high` + `low` GLB variants (meshopt + KTX2).
- `usdz` (iOS Quick Look) — QA'd separately (USDZ material drift is real).
- `poster` (AVIF/WebP) — the instant blur-up source.
- A manifest entry (`assets-pipeline/manifest.ts`) with hash, byte/tri/texture
  metrics, true-scale dimensions, floor-origin flag.

## 7. Toolchain (required once a real GLB exists)

Authoring → retopo → bake AO → PBR → GLB, then:
`gltf-transform` / `gltfpack` → meshopt + KTX2 → USDZ export → poster render →
manifest update → `pnpm assets:check`. These tools are added as devDeps **only
when the first real asset lands** (kept lean until then).

## 8. Placeholder rule (current phase)

A `placeholder: true` entry has **no GLB yet**. The gate still enforces the
non-negotiables — positive true-scale dimensions and floor-centred origin — so
the placeholder that renders in the Hero stage (C2) is dimensionally honest and
the real GLB later is a drop-in swap.

## 9. QA acceptance (manual, before flipping `placeholder` → false)

- Measured against real product dimensions (± 1 cm).
- Floor-centred origin verified in a DCC tool.
- Within all `config/perf-budget.ts` limits (gate must pass).
- USDZ opens at true scale in iOS Quick Look.
- Materials map 1:1 to declared finish slots.
