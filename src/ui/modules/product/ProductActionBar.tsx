/**
 * ProductActionBar — sticky thumb-zone close (locked conversational commerce).
 *
 * Two actions: a calm secondary "View in your room" and the single filled
 * accent CTA "Order on WhatsApp" (the locked primary close). The secondary
 * resolves by capability, best-first: WebXR custom session (`onEnterAr`),
 * else native AR as an anchor (`arHref`), else the in-app Room Preview
 * (`onRoomPreview`) — so the button is ALWAYS present, never a dead end. The
 * accent-CTA rule (one filled action per screen) is preserved: the secondary
 * is a ghost anchor/button.
 *
 * Pure presentational. Receives ready hrefs + plain callbacks; never touches
 * the ar / commerce / render layers (boundary preserved — plain values flow in).
 */
import type { ReactElement } from 'react';
import styles from './ProductActionBar.module.css';

interface ProductActionBarProps {
  readonly handoffUrl: string;
  readonly label: string;
  /** Preferred: enter the WebXR custom session (capable Android Chrome). */
  readonly onEnterAr?: (() => void) | undefined;
  /** WebXR supported but the 3D model is still loading — show a calm wait. */
  readonly arPreparing?: boolean | undefined;
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
  onEnterAr,
  arPreparing,
  arHref,
  arRel,
  onRoomPreview,
  arLabel = 'View in your room',
}: ProductActionBarProps): ReactElement {
  return (
    <div className={styles.bar} role="region" aria-label="Order">
      {onEnterAr !== undefined ? (
        <button type="button" onClick={onEnterAr} className={styles.secondary}>
          {arLabel}
        </button>
      ) : arPreparing === true ? (
        <button
          type="button"
          disabled
          className={styles.secondary}
          aria-busy="true"
        >
          Preparing the room…
        </button>
      ) : arHref !== undefined ? (
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
