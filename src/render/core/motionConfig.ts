/**
 * Cinematic constants for the hero reveal (locked Phase-3 motion bible).
 *
 * Duration is the `cinematic` token (single source). The bloom delay, the
 * arrival scale, and the resting shadow opacity are choreography constants
 * from the locked storyboard — not design tokens (like a geometry constant).
 */
import { duration } from '@/tokens';

/** Form resolves over the cinematic duration on `ease-authority`. */
export const REVEAL_DURATION_MS = duration.cinematic;

/** Locked: the contact shadow blooms in +180ms AFTER the form resolves. */
export const SHADOW_BLOOM_DELAY_MS = 180;

/** Locked: the product "arrives" 96% → 100% (settle, never overshoot). */
export const REVEAL_FROM_SCALE = 0.96;

/** Resting opacity the contact shadow blooms up to. */
export const SHADOW_REST_OPACITY = 0.5;

/* -- Idle breathing (locked: "ambient breathing, not a spin"). ------------- */

/** One full, gentle sine cycle ≈ the ambient token (single source). */
export const BREATHE_PERIOD_MS = duration.ambient;

/** Locked amplitude ≈ ±6° of quiet Y oscillation. */
export const BREATHE_AMPLITUDE_RAD = (6 * Math.PI) / 180;
