/**
 * ProductActionBar — sticky thumb-zone close (locked conversational commerce).
 *
 * Two actions: a calm secondary "View in your room" (AR) when the orchestrator
 * has resolved a launch path for the device, and the single filled accent CTA
 * "Order on WhatsApp" (the locked primary close). The accent CTA rule — one
 * filled action per screen — is preserved: AR is a ghost/secondary anchor.
 *
 * Pure presentational. Receives ready hrefs; never touches the ar / commerce
 * layers (boundary preserved — plain strings flow in from the app layer).
 */
import type { ReactElement } from 'react';
import styles from './ProductActionBar.module.css';

interface ProductActionBarProps {
  readonly handoffUrl: string;
  readonly label: string;
  /** AR launch URL (Scene Viewer intent / Quick Look USDZ). Hidden when absent. */
  readonly arHref?: string | undefined;
  /** iOS Quick Look needs `rel="ar"`. Android Scene Viewer doesn't use rel. */
  readonly arRel?: string | undefined;
  /** Label for the AR action (defaults to "View in your room"). */
  readonly arLabel?: string | undefined;
}

export function ProductActionBar({
  handoffUrl,
  label,
  arHref,
  arRel,
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
