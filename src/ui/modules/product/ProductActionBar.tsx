/**
 * ProductActionBar — sticky thumb-zone close (locked conversational commerce).
 *
 * Two actions: a calm secondary "View in your room" and the single filled
 * accent CTA "Order on WhatsApp" (the locked primary close). The secondary
 * resolves by capability: native AR opens as an anchor (`arHref`); otherwise
 * `onRoomPreview` opens the in-app Room Preview fallback — so the button is
 * ALWAYS present, never a dead end. The accent-CTA rule (one filled action per
 * screen) is preserved: the secondary is a ghost anchor/button.
 *
 * Pure presentational. Receives ready hrefs + a plain callback; never touches
 * the ar / commerce layers (boundary preserved — plain values flow in).
 */
import type { ReactElement } from 'react';
import styles from './ProductActionBar.module.css';

interface ProductActionBarProps {
  readonly handoffUrl: string;
  readonly label: string;
  /** AR launch URL (Scene Viewer intent / Quick Look USDZ). */
  readonly arHref?: string | undefined;
  /** iOS Quick Look needs `rel="ar"`. Android Scene Viewer doesn't use rel. */
  readonly arRel?: string | undefined;
  /** Fallback: open the in-app Room Preview when no native AR path exists. */
  readonly onRoomPreview?: (() => void) | undefined;
  /** Label for the secondary action (defaults to "View in your room"). */
  readonly arLabel?: string | undefined;
}

export function ProductActionBar({
  handoffUrl,
  label,
  arHref,
  arRel,
  onRoomPreview,
  arLabel = 'View in your room',
}: ProductActionBarProps): ReactElement {
  return (
    <div className={styles.bar} role="region" aria-label="Order">
      {arHref !== undefined ? (
        <a
          href={arHref}
          {...(arRel !== undefined ? { rel: arRel } : {})}
          className={styles.secondary}
        >
          {arLabel}
        </a>
      ) : onRoomPreview !== undefined ? (
        <button
          type="button"
          onClick={onRoomPreview}
          className={styles.secondary}
        >
          {arLabel}
        </button>
      ) : null}
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
