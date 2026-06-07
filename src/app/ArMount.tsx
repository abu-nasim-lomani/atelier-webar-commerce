'use client';

/**
 * ArMount — SSR-safe React/Next boundary for the WebXR canvas (mirrors
 * CanvasMount). Rendered by the orchestrator only when WebXR-AR is supported,
 * so the hidden host canvas is ready for an in-gesture `enterAr()`.
 */
import dynamic from 'next/dynamic';
import type { ReactElement } from 'react';

const ArCanvas = dynamic(() => import('@/render').then((m) => m.ArCanvas), {
  ssr: false,
});

interface ArMountProps {
  readonly finishHex: string | null;
  readonly fitLabel: string | null;
  readonly watermark: string;
  readonly onShare: () => void;
}

export function ArMount({
  finishHex,
  fitLabel,
  watermark,
  onShare,
}: ArMountProps): ReactElement {
  return (
    <ArCanvas
      finishHex={finishHex}
      fitLabel={fitLabel}
      watermark={watermark}
      onShare={onShare}
    />
  );
}
