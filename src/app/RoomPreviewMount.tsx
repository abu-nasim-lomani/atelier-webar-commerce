'use client';

/**
 * RoomPreviewMount — the SSR-safe React/Next boundary for the Room Preview
 * canvas (mirrors CanvasMount). `next/dynamic` with `ssr: false` keeps the
 * second WebGL context client-only; the render layer stays framework-free.
 *
 * Mounted by the orchestrator only while the overlay is open, so the GL context
 * exists for the preview's lifetime and is freed on close.
 */
import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';

const RoomPreviewCanvas = dynamic(
  () => import('@/render').then((m) => m.RoomPreviewCanvas),
  { ssr: false },
);

interface RoomPreviewMountProps {
  readonly finishHex: string | null;
  readonly reducedMotion: boolean;
}

export function RoomPreviewMount({
  finishHex,
  reducedMotion,
}: RoomPreviewMountProps): ReactElement {
  return (
    <RoomPreviewCanvas finishHex={finishHex} reducedMotion={reducedMotion} />
  );
}
