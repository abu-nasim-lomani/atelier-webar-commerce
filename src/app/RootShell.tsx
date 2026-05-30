/**
 * Persistent shell — the locked canvas topology.
 *
 * Establishes two layers for the entire app lifetime:
 *   1. #canvas-root  — a fixed layer at z-stage holding the single persistent
 *      WebGL canvas (B1). It never unmounts across client navigations, which
 *      is exactly why the GL context can persist.
 *   2. content layer — DOM UI composited above the canvas, safe-area aware.
 */
import type { ReactNode, ReactElement } from 'react';
import { SITE } from '@config/site';
import { SiteHeader } from '@/ui/modules/chrome';
import { CanvasMount } from './CanvasMount';
import styles from './RootShell.module.css';

export function RootShell({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return (
    <div className={styles.shell}>
      {/* Persistent canvas layer (B1). Decorative — kept out of the
          accessibility tree; pointer-events are disabled at the slot. */}
      <div id="canvas-root" className={styles.canvasSlot} aria-hidden="true">
        <CanvasMount />
      </div>

      <div className={styles.content}>
        <SiteHeader
          brand={SITE.name}
          productHref="/product/hero-sofa"
          productLabel="The Sofa"
        />
        {children}
      </div>
    </div>
  );
}
