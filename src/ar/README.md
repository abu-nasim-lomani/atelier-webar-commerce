# `ar/` — AR session system

**Status:** reserved. Implemented in **Phase F**. Empty in A1.

## Dependency contract

- May depend on: `render`, `tokens`, `state`, `capability`, `config`, `lib`,
  `types`. Isolated; projects only coarse status to a store for UI.

## Platform reality (locked, non-negotiable)

- Android Chrome + ARCore → WebXR `immersive-ar` (custom UI / capture).
- Android without WebXR → Scene Viewer intent.
- iOS → **AR Quick Look (USDZ) only — no WebXR ever**, no custom capture.
- Otherwise → Room Preview fallback. **Never a dead end.**
- True scale is locked (no pinch-resize). Never promise unsupported AR.
