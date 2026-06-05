/**
 * Render layer — public surface.
 *
 * Only the persistent canvas host + imperative seams are exposed. No
 * scene/product/AR internals leak out. The render loop is never React-driven.
 */
export { RenderCanvas } from './RenderCanvas';
export { RoomPreviewCanvas } from './RoomPreviewCanvas';
export { ArCanvas } from './xr/ArCanvas';
export { enterAr } from './xr/xrStore';
export { renderController } from './controller';
export { materialBridge } from './materialBridge';
export type { DeviceTier } from './core/deviceProfile';
