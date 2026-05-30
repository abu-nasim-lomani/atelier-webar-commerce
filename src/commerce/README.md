# `commerce/` — Pure domain layer

**Status:** E1 implemented — framework-free domain surface.
Phase E2 (product route + UI) and E3 (3D material coupling) build on this.

## Dependency contract (lint-enforced)

- **Framework-free.** Importing `react` / `three` here is a CI error.
- May depend on: `tokens`, `config`, `lib`, `types`. No `render` / `ui` / `ar`.

## E1 surface

- **`catalog.ts`** — typed `ProductEntry`; one `hero-sofa` entry; dimensions
  reference `config/hero-asset.ts` (never duplicated).
- **`finishes.ts`** — 4 curated finishes (Oak / Walnut / Linen / Charcoal),
  each with a one-word story; colours pulled from `palette` tokens (no hex).
- **`fitChecker.ts`** — pure `checkFit(roomW, productW) → fits | tight | tooLarge`
  + clearance. Answers the locked #1 buyer fear, "will it fit?".
- **`whatsapp.ts`** — `buildWhatsAppUrl(message)` deep-link. Placeholder number
  with a deploy-time TODO.
- **`decisionArtifact.ts`** — the locked signature mechanic: typed artifact
  (product + finish + fit + optional snapshot) + a calm pre-filled WhatsApp
  message composer. Image-side composition lands in E4/G.
- **`urlState.ts`** — `encode/decodeConfiguration` ↔ `URLSearchParams`. The
  URL **is** the state — no server, no auth (locked backend-free V1).

## What this layer does NOT do

No fragile Western checkout. No payment gateway. No accounts. No fake API.
Conversational commerce (WhatsApp) is the primary close per locked strategy.
