# `render/` — Realtime rendering layer

**Status:** reserved. Implemented in **Phase B**. Empty in A1 by design.

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
