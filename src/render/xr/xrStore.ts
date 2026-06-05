/**
 * WebXR store (Phase F3) — the single immersive-ar session store.
 *
 * `createXRStore` wires the standard session / hit-test / dom-overlay plumbing
 * (locked: never hand-roll standard platform plumbing — build the custom calm
 * UX on top of it). `enterAr()` MUST run inside a user gesture (a browser
 * requirement); the `<XR>` provider in ArCanvas binds the started session to
 * that canvas's renderer.
 *
 * Framework-free like the rest of render/ — value import only, no `react`.
 */
import { createXRStore } from '@react-three/xr';

export const xrStore = createXRStore();

/** Request the immersive-ar session. Call directly from a user gesture. */
export function enterAr(): void {
  void xrStore.enterAR();
}

/** End the active session (the calm in-AR "Done"). No-op when not in session. */
export function exitAr(): void {
  const { session } = xrStore.getState();
  if (session !== undefined) void session.end();
}
