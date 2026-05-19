# `motion/` — Motion primitives

**Status:** reserved. Implemented in **Phase D**. Empty in A1.

## Dependency contract

- May depend on: `tokens`, `lib`, `types`. Framework-free core.
- Two backends (Phase D): WAAPI for DOM (compositor: transform/opacity only),
  loop-driven lerp/tween for camera/material uniforms.
- Token-driven only — durations/easings come from `tokens`, never literals.
- One focal sequence at a time; reduced variants honour reduced-motion.
