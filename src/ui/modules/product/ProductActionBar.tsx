/**
 * ProductActionBar — sticky thumb-zone close (locked conversational commerce).
 *
 * One primary action per screen (locked CTA hierarchy). For E2 the primary is
 * **Order on WhatsApp** — the locked conversational close, fully functional via
 * the deep-link composed in the orchestrator. "View in your room" is
 * intentionally absent until AR lands in Phase F (no fake/disabled buttons).
 *
 * Fixed at the bottom of the viewport, safe-area aware, above the canvas.
 * Pure presentational; receives a ready WhatsApp URL.
 */
import type { ReactElement } from 'react';
import styles from './ProductActionBar.module.css';

interface ProductActionBarProps {
  readonly handoffUrl: string;
  readonly label: string;
}

export function ProductActionBar({
  handoffUrl,
  label,
}: ProductActionBarProps): ReactElement {
  return (
    <div className={styles.bar} role="region" aria-label="Order">
      <a
        href={handoffUrl}
        className={styles.primary}
        target="_blank"
        rel="noopener noreferrer"
      >
        {label}
      </a>
    </div>
  );
}
