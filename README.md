# Atelier — Cinematic WebAR Furniture Commerce

Production scaffold. **Current state: Phase A1 — Repository Scaffold + Token Infrastructure.**

This repository implements a locked, multi-phase product blueprint. A1 establishes
the architectural foundation only — there is intentionally **no 3D, no AR, no
commerce logic, and no product UI** yet.

## Stack

- **Next.js (App Router) + TypeScript (strict)** — static/SSR commerce shell.
- React Three Fiber + WebXR are introduced **only in `src/render` / `src/ar`** in
  later phases. They are lint-forbidden everywhere else.

## Architecture (lint-enforced)

Dependencies point one way. Forbidden imports fail CI (`eslint-plugin-boundaries`).

| Layer | Contract |
|---|---|
| `src/tokens` | Single source of design truth. Leaf. Only home of raw values. |
| `src/render` | Realtime rendering. **Framework-free** (no `react`). Owns `three`. |
| `src/experience` | Cinematic orchestration (later phase). |
| `src/ar` | AR session system. Isolated. |
| `src/commerce` | Pure domain. Framework-free. |
| `src/ui` | DOM presentation. Never imports `render`/`ar`. |
| `src/motion` | Motion primitives. Framework-free core. |
| `src/state` | Stores + ref-bus. |
| `src/capability` | Device/network detection. Leaf. |
| `src/analytics` | One-way sink. Depended on by none. |
| `config` | Performance budgets / flags. |
| `assets-pipeline` | Offline asset spec + CI gate (Phase C). |

**Golden rule:** the render loop never depends on React; React never drives the
loop per frame.

## Token pipeline

`src/tokens/*.ts` is the single source of truth and emits three channels:

1. **CSS variables** (`tokens:build` → `src/tokens/tokens.generated.css`) — for UI.
2. **Typed TS constants** — for motion/render math.
3. **Linear colour** (`colorSpace.ts`) — prepared for the render channel (Phase B).

Component CSS may consume **only** `var(--token)`. Raw hex / spacing / radius /
shadow values in component CSS fail `stylelint`.

## Commands

```bash
pnpm install
pnpm tokens:build     # regenerate src/tokens/tokens.generated.css from TS tokens
pnpm dev              # local dev server
pnpm verify           # typecheck + eslint + stylelint + token drift check
```

## Phase roadmap

`A1 (this) → A2 shell+states → B render core → C asset pipeline+hero stage →
D cinematic+motion → E product+commerce → F AR → G recap+handoff → H hardening`

Do not implement a later phase before the prior phase is reviewed and authorized.
