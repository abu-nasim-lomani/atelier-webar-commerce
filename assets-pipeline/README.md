# `assets-pipeline/` — Offline 3D asset pipeline

**Status:** C1 implemented — Asset Spec + typed manifest + CI budget gate.
Offline tooling, not shipped to the client.

## C1 surface

- **`ASSET_SPEC.md`** — the contract (units, floor origin, budgets via
  `config/perf-budget.ts`, deliverables, QA, toolchain).
- **`manifest.ts`** — typed manifest. `hero-sofa` is a declared
  `placeholder` (no GLB yet; true-scale dims + floor origin are real).
- **`validate.ts`** — the gate. `pnpm assets:check` (also part of
  `pnpm verify`) exits non-zero if any entry violates the perf budget;
  placeholders are still held to true-scale + floor-origin.

## Deferred (until a real GLB exists)

The optimize toolchain (`gltf-transform`/`gltfpack` → meshopt + KTX2 → USDZ →
poster) and its devDeps are added only when the first real asset lands — kept
lean until then. C2 renders a dimensionally-honest placeholder in the Hero
stage and swaps in the real GLB later with no code change.
