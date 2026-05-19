# `capability/` — Device & network detection

**Status:** reserved. Implemented in **Phase H** (consumed earlier). Empty in A1.

## Dependency contract

- Leaf. May depend on: `lib`, `types`. Read by any layer; depends on none.
- Detects WebGL2/extensions, `deviceMemory`, `hardwareConcurrency`, async
  `xr.isSessionSupported`, `saveData`/`effectiveType` → tier (Low/Mid/High).
- Default tier = **Mid**. Never assume High. Detection must be defensive
  (these APIs throw and lie).
