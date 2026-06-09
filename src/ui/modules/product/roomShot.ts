/**
 * Room shot — composes the "your room" share image (Phase G2).
 *
 * Flattens what the buyer arranged on screen: their room photo (cover-fit),
 * the live 3D sofa snapshot at the SAME translate/scale they positioned, and a
 * quiet brand footer. Honest framing: a flat photo isn't true scale, so the
 * footer says "styling preview", not a measurement claim.
 *
 * Pure DOM util (no React, no commerce): two source images + the transform in,
 * a PNG Blob out. Token colours only.
 */
import { palette } from '@/tokens';

export interface RoomShotInput {
  /** The buyer's room photo (decoded, object-fit: cover over the stage). */
  readonly photo: HTMLImageElement;
  /** The transparent 3D sofa canvas (preserveDrawingBuffer required). */
  readonly sofa: HTMLCanvasElement;
  /** On-screen CSS transform the buyer applied to the sofa layer. */
  readonly tx: number;
  readonly ty: number;
  readonly scale: number;
  /** Stage size in CSS pixels (the sofa layer fills this, origin = centre). */
  readonly width: number;
  readonly height: number;
  readonly brand: string;
  readonly productName: string;
}

export async function composeRoomShot(
  input: RoomShotInput,
): Promise<Blob | null> {
  const w = Math.round(input.width);
  const h = Math.round(input.height);
  if (w <= 0 || h <= 0) return null;

  // Render at device resolution (capped) so the share reads crisp.
  const dpr = Math.min(2, typeof window === 'undefined' ? 1 : window.devicePixelRatio || 1);

  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext('2d');
  if (ctx === null) return null;
  ctx.scale(dpr, dpr);

  // 1) Room photo, cover-fit (matches the on-screen object-fit: cover).
  const pw = input.photo.naturalWidth;
  const ph = input.photo.naturalHeight;
  if (pw > 0 && ph > 0) {
    const photoRatio = pw / ph;
    const stageRatio = w / h;
    let dw = w;
    let dh = h;
    if (photoRatio > stageRatio) {
      dh = h;
      dw = h * photoRatio;
    } else {
      dw = w;
      dh = w / photoRatio;
    }
    ctx.drawImage(input.photo, (w - dw) / 2, (h - dh) / 2, dw, dh);
  }

  // 2) Sofa snapshot at the buyer's transform. CSS `translate(tx,ty) scale(s)`
  //    with transform-origin at the layer centre composes to:
  //    T(centre) · T(tx,ty) · S(s) · T(-centre).
  ctx.save();
  ctx.translate(w / 2 + input.tx, h / 2 + input.ty);
  ctx.scale(input.scale, input.scale);
  ctx.translate(-w / 2, -h / 2);
  ctx.drawImage(input.sofa, 0, 0, w, h);
  ctx.restore();

  // 3) Brand footer — a soft scrim so the wordmark reads over any photo.
  const scrimH = Math.max(96, h * 0.18);
  const grad = ctx.createLinearGradient(0, h - scrimH, 0, h);
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, h - scrimH, w, scrimH);

  const pad = Math.round(h * 0.04);
  const brandSize = Math.max(16, Math.round(h * 0.03));
  const subSize = Math.max(12, Math.round(h * 0.022));

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = palette.bone;
  ctx.font = `600 ${String(brandSize)}px system-ui, sans-serif`;
  ctx.fillText(input.brand.toUpperCase(), pad, h - pad - subSize - 8);

  ctx.fillStyle = palette.linen;
  ctx.font = `400 ${String(subSize)}px system-ui, sans-serif`;
  ctx.fillText(`${input.productName} · styling preview`, pad, h - pad);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
