'use client';

/**
 * RoomPreview — the never-a-dead-end AR fallback overlay (Phase F2).
 *
 * When a device can't launch native AR (iOS before USDZ ships, desktop, misc),
 * "View in your room" opens this instead of hiding: the live 3D sofa over a
 * calm, warm room backdrop. Honest copy frames it as a preview, not a measuring
 * instrument — the true-scale AR path stays the premium promise.
 *
 * Pure presentational: the 3D canvas arrives as the `stage` slot from the app
 * composition root (UI never imports the renderer). Closed → renders nothing,
 * so the canvas (and its GL context) only exists while open.
 */
import { useEffect, type ReactElement, type ReactNode } from 'react';
import { Text } from '@/ui/primitives';
import styles from './RoomPreview.module.css';

interface RoomPreviewProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly productName: string;
  /** e.g. "Oak Natural" — shown as a quiet caption. */
  readonly finishLabel?: string | undefined;
  /** WhatsApp deep link — the preview still leads to the conversational close. */
  readonly handoffUrl: string;
  readonly handoffLabel: string;
  /** The 3D canvas, passed by the orchestrator (boundary preserved). */
  readonly stage?: ReactNode | undefined;
}

export function RoomPreview({
  open,
  onClose,
  productName,
  finishLabel,
  handoffUrl,
  handoffLabel,
  stage,
}: RoomPreviewProps): ReactElement | null {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent): void => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.layer}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} shown in a room`}
    >
      <div className={styles.header}>
        <Text variant="overline" tone="inkMuted">
          Room preview
        </Text>
        <button
          type="button"
          className={styles.close}
          onClick={onClose}
          aria-label="Close room preview"
        >
          Close
        </button>
      </div>

      {/* The live 3D sofa floats over the warm backdrop. Decorative for a11y. */}
      <div className={styles.stage} aria-hidden="true">
        {stage}
      </div>

      <div className={styles.footer}>
        <Text variant="caption" tone="inkMuted">
          {finishLabel !== undefined
            ? `Shown true-to-scale in ${finishLabel}. Your room and light will differ — open it in AR on a supported phone to place it exactly.`
            : 'Shown true-to-scale. Your room and light will differ — open it in AR on a supported phone to place it exactly.'}
        </Text>
        <a
          href={handoffUrl}
          className={styles.cta}
          target="_blank"
          rel="noopener noreferrer"
        >
          {handoffLabel}
        </a>
      </div>
    </div>
  );
}
