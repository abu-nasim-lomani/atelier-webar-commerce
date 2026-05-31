/**
 * AR — public surface for Phase F.
 *
 * F1 exposes the capability-driven launcher (Scene Viewer / Quick Look). The
 * full session director, WebXR custom UI, Room Preview fallback, and capture
 * pipeline land in F2–F4.
 */
export {
  resolveArLaunch,
  type ArLaunchInfo,
  type ArLaunchMode,
  type ResolveArOptions,
} from './launch';
