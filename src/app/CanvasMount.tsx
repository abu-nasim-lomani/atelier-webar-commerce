'use client';

/**
 * CanvasMount — the SSR-safe React/Next boundary for the renderer.
 *
 * The render layer stays framework-free; all React/SSR concerns live here in
 * the app layer. `next/dynamic` with `ssr: false` guarantees the WebGL canvas
 * is created only on the client (no window/SSR hazards), while still being
 * mounted once inside the persistent #canvas-root slot.
 */
import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';

const RenderCanvas = dynamic(
  () => import('@/render').then((m) => m.RenderCanvas),
  { ssr: false },
);

export function CanvasMount(): ReactElement {
  return <RenderCanvas />;
}
