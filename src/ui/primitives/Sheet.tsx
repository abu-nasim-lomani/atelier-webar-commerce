/**
 * Sheet — the bottom-sheet SHELL only.
 *
 * A1 ships the visual container: warm raised surface, large soft top radius
 * (rises like a physical panel), soft elevation, safe-area aware bottom inset.
 * Drag, snap states, and gesture choreography are Phase E — intentionally
 * absent here.
 */
import type { ReactElement, ReactNode } from 'react';
import styles from './Sheet.module.css';

interface SheetProps {
  readonly children: ReactNode;
  /** Accessible name for the region. */
  readonly label?: string;
}

export function Sheet({ children, label }: SheetProps): ReactElement {
  return (
    <section
      className={styles.sheet}
      {...(label ? { 'aria-label': label } : {})}
    >
      {children}
    </section>
  );
}
