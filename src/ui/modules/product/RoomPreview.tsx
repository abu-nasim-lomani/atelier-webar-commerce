'use client';

/**
 * RoomPreview — "see it in a room" without AR (Phase F2) + your-own-photo
 * styling preview (Phase G).
 *
 * Preset mode: the live 3D sofa floats over a warm backdrop (the AR fallback).
 * Photo mode: the buyer drops in a photo of their room and drags / scales /
 * rotates the sofa onto it — a STYLING preview (a flat photo can't be true
 * scale; the AR path + Fit Checker remain the honest measurement).
 *
 * Pure presentational: the 3D canvas arrives via `renderStage(yaw)` from the
 * app (UI never imports the renderer). UI owns the photo + 2D transform + yaw.
 */
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Text } from '@/ui/primitives';
import { cx } from '@/lib/cx';
import { composeRoomShot } from './roomShot';
import styles from './RoomPreview.module.css';

interface RoomPreviewProps {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly productName: string;
  /** Brand wordmark stamped onto the shared room shot. */
  readonly brand: string;
  readonly finishLabel?: string | undefined;
  readonly handoffUrl: string;
  readonly handoffLabel: string;
  /** The 3D canvas for a given yaw (null = preset-room breathing). */
  readonly renderStage: (yaw: number | null) => ReactNode;
}

const ROTATE_STEP = Math.PI / 12; // 15°

export function RoomPreview({
  open,
  onClose,
  productName,
  brand,
  finishLabel,
  handoffUrl,
  handoffLabel,
  renderStage,
}: RoomPreviewProps): ReactElement | null {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const [scale, setScale] = useState(1);
  const [yaw, setYaw] = useState(0);
  const [capturing, setCapturing] = useState(false);
  const dragFrom = useRef<{ x: number; y: number } | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

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

  // Release the object URL when it changes or the overlay unmounts.
  useEffect(() => {
    return () => {
      if (photoUrl !== null) URL.revokeObjectURL(photoUrl);
    };
  }, [photoUrl]);

  if (!open) return null;

  const photoMode = photoUrl !== null;

  const resetTransform = (): void => {
    setTx(0);
    setTy(0);
    setScale(1);
    setYaw(0);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file === undefined) return;
    setPhotoUrl((old) => {
      if (old !== null) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });
    resetTransform();
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>): void => {
    if (!photoMode) return;
    dragFrom.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>): void => {
    const from = dragFrom.current;
    if (from === null) return;
    const dx = e.clientX - from.x;
    const dy = e.clientY - from.y;
    setTx((v) => v + dx);
    setTy((v) => v + dy);
    dragFrom.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (): void => {
    dragFrom.current = null;
  };

  const onShareRoom = async (): Promise<void> => {
    const stage = stageRef.current;
    if (stage === null || capturing) return;
    const sofa = stage.querySelector('canvas');
    const photo = stage.querySelector('img');
    if (sofa === null || photo === null) return;

    setCapturing(true);
    try {
      const rect = stage.getBoundingClientRect();
      const blob = await composeRoomShot({
        photo,
        sofa,
        tx,
        ty,
        scale,
        width: rect.width,
        height: rect.height,
        brand,
        productName,
      });
      if (blob === null) return;

      const file = new File([blob], 'atelier-room.png', { type: 'image/png' });
      const shareData = { files: [file], title: productName };
      if (
        typeof navigator.canShare === 'function' &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'atelier-room.png';
        anchor.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      // Share dismissed or unavailable — stay calm, no error surface.
    } finally {
      setCapturing(false);
    }
  };

  return (
    <div
      className={styles.layer}
      role="dialog"
      aria-modal="true"
      aria-label={`${productName} shown in a room`}
    >
      <div className={styles.header}>
        <Text variant="overline" tone="inkMuted">
          {photoMode ? 'Your room' : 'Room preview'}
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

      <div
        ref={stageRef}
        className={photoMode ? styles.stagePhoto : styles.stage}
      >
        {photoMode ? (
          <img className={styles.photo} src={photoUrl} alt="" />
        ) : null}
        <div
          className={cx(styles.sofaLayer, photoMode && styles.sofaLayerDrag)}
          style={{
            transform: `translate(${String(tx)}px, ${String(ty)}px) scale(${String(scale)})`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {renderStage(photoMode ? yaw : null)}
        </div>
      </div>

      {photoMode ? (
        <div className={styles.controls}>
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Rotate left"
            onClick={() => {
              setYaw((y) => y + ROTATE_STEP);
            }}
          >
            ↺
          </button>
          <input
            className={styles.slider}
            type="range"
            min={0.4}
            max={2.5}
            step={0.05}
            value={scale}
            aria-label="Size"
            onChange={(e) => {
              setScale(Number(e.target.value));
            }}
          />
          <button
            type="button"
            className={styles.iconBtn}
            aria-label="Rotate right"
            onClick={() => {
              setYaw((y) => y - ROTATE_STEP);
            }}
          >
            ↻
          </button>
          <button
            type="button"
            className={styles.textBtn}
            onClick={resetTransform}
          >
            Reset
          </button>
        </div>
      ) : null}

      <div className={styles.footer}>
        <Text variant="caption" tone="inkMuted">
          {photoMode
            ? 'Drag to position, slider to size, ↺ ↻ to rotate. A styling preview — open it in AR for true scale.'
            : finishLabel !== undefined
              ? `Shown true-to-scale in ${finishLabel}. Or place it on a photo of your own room.`
              : 'Shown true-to-scale. Or place it on a photo of your own room.'}
        </Text>

        <input
          ref={fileInput}
          type="file"
          accept="image/*"
          hidden
          onChange={onPick}
        />
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.secondary}
            onClick={() => fileInput.current?.click()}
          >
            {photoMode ? 'Use a different photo' : 'Use your room photo'}
          </button>
          {photoMode ? (
            <button
              type="button"
              className={styles.cta}
              disabled={capturing}
              onClick={() => {
                void onShareRoom();
              }}
            >
              {capturing ? 'Preparing…' : 'Save & share'}
            </button>
          ) : (
            <a
              href={handoffUrl}
              className={styles.cta}
              target="_blank"
              rel="noopener noreferrer"
            >
              {handoffLabel}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
