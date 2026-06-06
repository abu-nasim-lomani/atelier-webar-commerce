/**
 * Decision Artifact card — composes the shareable IMAGE (the locked signature
 * mechanic: the card the buyer sends to family). Canvas 2D in the brand
 * palette: the configured sofa snapshot + name, dimensions, price, fit, and a
 * "true to scale" line.
 *
 * Pure DOM util (no React, no commerce): plain data + an optional snapshot in,
 * a PNG Blob out. Token colours only — no raw hex.
 */
import { palette } from '@/tokens';

export interface DecisionCardInput {
  readonly snapshotDataUrl: string | null;
  readonly brand: string;
  readonly productName: string;
  readonly tagline: string;
  readonly dimensionsLabel: string;
  readonly priceLabel: string;
  readonly fitLabel: string | null;
}

const WIDTH = 1080;
const HEIGHT = 1350;
const MARGIN = 72;

async function loadImage(src: string): Promise<HTMLImageElement | null> {
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    return img;
  } catch {
    return null;
  }
}

export async function composeDecisionCard(
  input: DecisionCardInput,
): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext('2d');
  if (ctx === null) return null;

  ctx.textBaseline = 'alphabetic';

  // Warm canvas background.
  ctx.fillStyle = palette.bone;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Brand overline.
  ctx.fillStyle = palette.taupe;
  ctx.font = '600 26px system-ui, sans-serif';
  ctx.fillText(input.brand.toUpperCase(), MARGIN, 110);

  // Snapshot panel (raised tone), with the sofa contained inside it.
  const panelY = 150;
  const panelH = 640;
  ctx.fillStyle = palette.linen;
  ctx.fillRect(MARGIN, panelY, WIDTH - MARGIN * 2, panelH);

  if (input.snapshotDataUrl !== null) {
    const img = await loadImage(input.snapshotDataUrl);
    if (img !== null && img.width > 0 && img.height > 0) {
      const availW = WIDTH - MARGIN * 2;
      const scale = Math.min(availW / img.width, panelH / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      ctx.drawImage(
        img,
        MARGIN + (availW - dw) / 2,
        panelY + (panelH - dh) / 2,
        dw,
        dh,
      );
    }
  }

  // Product name (editorial serif).
  let y = panelY + panelH + 96;
  ctx.fillStyle = palette.espresso;
  ctx.font = '600 64px Georgia, serif';
  ctx.fillText(input.productName, MARGIN, y);

  // Tagline.
  y += 50;
  ctx.fillStyle = palette.umber;
  ctx.font = '400 30px system-ui, sans-serif';
  ctx.fillText(input.tagline, MARGIN, y);

  // Divider.
  y += 46;
  ctx.strokeStyle = palette.clay;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(MARGIN, y);
  ctx.lineTo(WIDTH - MARGIN, y);
  ctx.stroke();

  // Details.
  y += 64;
  ctx.fillStyle = palette.espresso;
  ctx.font = '500 34px system-ui, sans-serif';
  ctx.fillText(input.dimensionsLabel, MARGIN, y);
  y += 52;
  ctx.fillText(input.priceLabel, MARGIN, y);
  if (input.fitLabel !== null) {
    y += 52;
    ctx.fillStyle = palette.umber;
    ctx.fillText(input.fitLabel, MARGIN, y);
  }

  // Footer line.
  ctx.fillStyle = palette.taupe;
  ctx.font = '600 24px system-ui, sans-serif';
  ctx.fillText(`TRUE TO SCALE · ${input.brand.toUpperCase()}`, MARGIN, HEIGHT - 84);

  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob);
    }, 'image/png');
  });
}
