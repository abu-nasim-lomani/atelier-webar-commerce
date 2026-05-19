/**
 * SEMANTIC COLOUR TOKENS.
 *
 * Two-tier inheritance: semantic aliases reference primitives. UI consumes only
 * semantic tokens — never the palette directly. The `ar.*` namespace is
 * intentionally separate because those values must stay legible composited over
 * an arbitrary camera feed (Phase 4 decision).
 */
import { palette, espressoRGB, linenRGB, shadowRGB } from './primitive';

const rgba = (
  c: { r: number; g: number; b: number },
  a: number,
): string =>
  `rgba(${String(c.r)}, ${String(c.g)}, ${String(c.b)}, ${String(a)})`;

export const color = {
  /* Neutral spine — the entire UI lives here. */
  canvas: palette.bone,
  canvasRaised: palette.linen,
  canvasSunk: palette.sand,

  line: palette.clay,
  lineStrong: palette.stone,

  inkMuted: palette.taupe, // metadata / captions only
  inkSoft: palette.umber, // body secondary
  ink: palette.espresso, // primary text (warm near-black)

  /* Accent — primary action & selected state ONLY. */
  accent: palette.ember,
  accentPress: palette.emberDeep,
  accentWash: palette.emberWash,

  /* Semantic — muted, never bright. */
  confirm: palette.sage,
  caution: palette.amber,
  alert: palette.brick,
} as const;

/** AR / cinematic overlay namespace (separate from UI on purpose). */
export const ar = {
  scrim: rgba(espressoRGB, 0.4),
  scrimSoft: rgba(espressoRGB, 0.22),
  /** Warm translucent card — NOT a heavy backdrop blur on mid-range Android. */
  surface: rgba(linenRGB, 0.86),
} as const;

/**
 * Contact shadow is a separate brand asset, not a UI box-shadow. It is owned by
 * the render layer (Phase B/C); only its warm base colour is defined here so the
 * value is centralized. Do NOT apply this as a CSS shadow.
 */
export const contactShadow = {
  base: palette.shadowWarm,
  baseRGB: shadowRGB,
} as const;
