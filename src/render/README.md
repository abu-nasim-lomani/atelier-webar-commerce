# `render/` — Realtime rendering layer

**Status:** B1 implemented — renderer foundation only (persistent canvas,
demand loop, tiers, calm empty stage). NO product / GLB / configurator / AR yet.

## B1 surface

- `RenderCanvas` — the single persistent `<Canvas frameloop="demand">`, mounted
  once via the app-layer SSR-safe `CanvasMount` into `#canvas-root`.
- `renderController` — framework-free imperative seam (holds `gl` + R3F
  `invalidate`, context-loss state). How future orchestration/AR request frames
  WITHOUT React re-renders.
- `core/` — pure TS: device tiering (no benchmarking), quality presets (DPR
  clamped to the perf budget), camera rig, ACES tone config, token→linear
  colour bridge, opt-in diagnostics.
- `scene/` — calm empty `Stage` (one matte floor + restrained light) with
  reserved empty seams: `product-anchor`, `contact-shadow-slot`,
  `environment-slot`.

**No `react` package import** anywhere here — JSX automatic runtime + R3F only.

## Dependency contract (lint-enforced)

- **Framework-free.** Importing `react` / `react-dom` here is a CI error.
- Owns `three` / `@react-three/*` — these are forbidden in every other layer.
- May depend on: `tokens`, `config`, `lib`, `types`.
- Exposes an imperative API + a ref-bus. The **only** bridge to React is coarse
  events (`sceneReady`, `tierChanged`, `transitionDone`).

## Invariants (Phase 5/6 locks)

- One persistent `WebGLRenderer` / canvas — never unmounted across routes.
- Render-on-demand only — no continuous rAF on a static scene.
- Every GPU resource registered with a disposal registry.
