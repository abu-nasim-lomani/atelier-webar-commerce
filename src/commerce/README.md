# `commerce/` — Pure domain layer

**Status:** reserved. Implemented from **Phase E**. Empty in A1.

## Dependency contract (lint-enforced)

- **Framework-free.** Importing `react` here is a CI error.
- May depend on: `tokens`, `config`, `lib`, `types`. No `render`/`ui`/`ar`.
- Scope: catalog, configurator, pricing, the Confidence/Decision Artifact,
  and the WhatsApp deep-link builder. No fragile checkout — conversational
  handoff is the locked close. State is shareable via URL (backend-free V1).
