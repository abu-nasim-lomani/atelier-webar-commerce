/**
 * Persistent shell — the locked canvas topology.
 *
 * Establishes two layers for the entire app lifetime:
 *   1. #canvas-root  — a fixed layer at z-stage. RESERVED for the single
 *      persistent WebGL canvas (Phase B). A1 mounts NOTHING here.
 *   2. content layer — DOM UI composited above the canvas, safe-area aware.
 *
 * This component never unmounts across client navigations, which is precisely
 * why the future GL context can persist (Phase 6 requirement).
 */
import type { ReactNode, ReactElement } from 'react';
import styles from './RootShell.module.css';

export function RootShell({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return (
    <div className={styles.shell}>
      {/* RESERVED CANVAS SLOT — do not render 3D in A1.
          Phase B mounts the persistent <canvas> here without changing this
          structure. Kept out of the accessibility tree. */}
      <div id="canvas-root" className={styles.canvasSlot} aria-hidden="true" />

      <div className={styles.content}>{children}</div>
    </div>
  );
}
