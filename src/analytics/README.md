# `analytics/` — One-way event sink

**Status:** reserved. Implemented in **Phase H**. Empty in A1.

## Dependency contract

- One-way sink: every layer may emit to it; **it is depended on by none**.
- May depend on: `lib`, `types`. Must be lightweight — the SDK must not itself
  harm performance.
- Tracks the funnel + field perf KPIs (p95 frame time, AR-support/fallback/
  tracking-fail/tab-kill rate). Field data is the source of truth, not lab.
