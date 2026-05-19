# `state/` — Stores + ref-bus

**Status:** reserved. Implemented from **Phase E**. Empty in A1.

## Dependency contract

- May depend on: `tokens`, `lib`, `types`. No `render`/`ui`/`commerce`/`ar`.
- **Coarse store slices** (infrequent React re-render): UI, commerce,
  AR-session projection, loading.
- **Ref-bus** (NEVER triggers React re-render): camera/anim targets,
  interaction deltas, per-frame perf samples. Per-frame `setState` is a
  hard-forbidden anti-pattern.
