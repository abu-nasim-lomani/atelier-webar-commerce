/**
 * Commerce — pure domain surface (Phase E1).
 *
 * Framework-free (no react, no three): catalog, finishes, fit verdict, the
 * Decision Artifact + WhatsApp message, and URL-as-state. UI (E2) and the
 * 3D coupling (E3) consume this layer; nothing here knows about either.
 */
export { catalog, findProductBySlug } from './catalog';
export type { ProductEntry, ProductPriceBDT } from './catalog';

export { finishes, findFinishById } from './finishes';
export type { Finish } from './finishes';

export { checkFit } from './fitChecker';
export type { FitVerdict, FitResult } from './fitChecker';

export { buildWhatsAppUrl } from './whatsapp';

export { composeWhatsAppMessage } from './decisionArtifact';
export type { DecisionArtifact } from './decisionArtifact';

export { encodeConfiguration, decodeConfiguration } from './urlState';
export type { ProductConfiguration } from './urlState';
