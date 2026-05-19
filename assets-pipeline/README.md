# `assets-pipeline/` — Offline 3D asset pipeline

**Status:** reserved. Implemented in **Phase C**. Empty in A1.

Offline tooling — not shipped to the client. Implements the locked moat:

- The **3D Asset Spec** (the contract): metres, floor-centre origin, tri/texture
  budgets, material slots = configurator finishes, ORM packing, tiered
  GLB (meshopt + KTX2) + USDZ + poster deliverables.
- Automated optimize/validate (`gltf-transform`/`gltfpack` → KTX2 → USDZ).
- A **CI budget gate** that fails the build if an asset exceeds
  `config/perf-budget.ts`. Start with one flagship sofa; scale the hero set.
