/**
 * Decision Artifact — the locked signature mechanic.
 *
 * A single, calm summary of what the customer is considering: product, finish,
 * dimensions, optional fit verdict, optional AR snapshot. It serves two roles
 * AT ONCE (the seam that makes premium UX × WhatsApp invisible):
 *   1. The PRE-FILLED MESSAGE handed into the conversational close.
 *   2. The SHAREABLE IMAGE the buyer sends to family — Bangladeshi furniture
 *      decisions are collective; this turns every prospect into a referrer.
 *
 * Pure data + a composer for the WhatsApp text. The image-side composition
 * (HTML→canvas snapshot, or DOM-to-image) belongs to E4/G — not here.
 */
import type { ProductEntry } from './catalog';
import type { Finish } from './finishes';
import type { FitResult } from './fitChecker';

export interface DecisionArtifact {
  readonly product: ProductEntry;
  readonly finish: Finish;
  readonly fit: FitResult | null;
  /** Optional URL to the captured AR snapshot (set later in Phase F/G). */
  readonly snapshotUrl?: string;
}

const verdictLine = (verdict: FitResult['verdict']): string => {
  switch (verdict) {
    case 'fits':
      return 'fits comfortably';
    case 'tight':
      return 'a tight fit';
    case 'tooLarge':
      return 'too large for the space';
  }
};

/** Compose the calm pre-filled WhatsApp message for this artifact. */
export function composeWhatsAppMessage(artifact: DecisionArtifact): string {
  const { product, finish, fit, snapshotUrl } = artifact;
  const d = product.dimensionsMeters;

  const lines: string[] = [
    `Hello — I'm considering the ${product.name}.`,
    `Finish: ${finish.label} (${finish.story.toLowerCase()})`,
    `Size: ${d.width.toFixed(2)} × ${d.depth.toFixed(2)} × ${d.height.toFixed(
      2,
    )} m`,
    `Price: ${String(product.price.amount)} ${product.price.currency}`,
  ];

  if (fit !== null) {
    lines.push(
      `In my space: ${verdictLine(fit.verdict)} (${fit.clearanceMeters.toFixed(
        2,
      )} m clearance).`,
    );
  }

  if (snapshotUrl !== undefined) {
    lines.push(`How it looks in the room: ${snapshotUrl}`);
  }

  return lines.join('\n');
}
