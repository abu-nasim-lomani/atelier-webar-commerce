/**
 * PRIMITIVE TOKENS — the single sanctioned home of raw values.
 *
 * Nothing outside this file may contain a raw hex, raw scale number, or raw
 * timing literal (lint-enforced). Primitives carry no meaning; semantic tokens
 * assign meaning by referencing them.
 *
 * Values are locked by the Phase 3 (motion) and Phase 4 (visual) specs.
 */

/* -------------------------------------------------------------------------- */
/* Colour — warm neutral spine + one accent. 100% warm. No #000 / #FFF.        */
/* -------------------------------------------------------------------------- */

export const palette = {
  bone: '#F3EEE7',
  linen: '#FAF6EF',
  sand: '#E9E2D6',
  clay: '#DAD1C3',
  stone: '#C7BCAA',
  taupe: '#948A79',
  umber: '#6B6253',
  espresso: '#2B2620',

  ember: '#B05A38',
  emberDeep: '#964A2D',
  emberWash: '#EFE2D9',

  sage: '#6E7A57',
  amber: '#B98336',
  brick: '#9B4A38',

  /** Warm shadow base — every shadow derives from this. Never pure black. */
  shadowWarm: '#2A1F16',
} as const;

/** Espresso channels for warm scrims (sRGB 8-bit). */
export const espressoRGB = { r: 43, g: 38, b: 32 } as const;
/** Linen channels for the warm AR surface. */
export const linenRGB = { r: 250, g: 246, b: 239 } as const;
/** Shadow base channels for elevation rgba(). */
export const shadowRGB = { r: 42, g: 31, b: 22 } as const;

/* -------------------------------------------------------------------------- */
/* Scale — 4pt spacing base.                                                   */
/* -------------------------------------------------------------------------- */

export const space = {
  s1: 4,
  s2: 8,
  s3: 12,
  s4: 16,
  s5: 24, // mobile gutter
  s6: 32,
  s7: 48,
  s8: 64, // section rhythm
  s9: 96,
  s10: 128, // cinematic breathing
} as const;

export const radius = {
  r0: 0, // full-bleed media / stage
  rSm: 2,
  rMd: 12, // surfaces, buttons
  rLg: 16, // cards
  rXl: 24, // bottom-sheet top edge
  rPill: 9999, // chips / toggles only
} as const;

/** Touch ergonomics (px). */
export const touch = {
  min: 48, // minimum interactive target
  primary: 56, // primary action height
  thumbZone: 120, // reserved bottom action band
} as const;

/** Mobile-first breakpoints (px). Base styles are mobile; these are rare. */
export const breakpoint = {
  sm: 480,
  md: 768,
  lg: 1024,
} as const;

/* -------------------------------------------------------------------------- */
/* Typography — editorial serif voice + neutral grotesque UI.                   */
/* Actual licensed faces are wired in a later phase; A1 ships robust stacks.    */
/* -------------------------------------------------------------------------- */

export const fontFamily = {
  display:
    "var(--font-display-face, 'Fraunces'), 'Georgia', 'Times New Roman', serif",
  text: "var(--font-text-face, system-ui), -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
} as const;

/** Type ramp: [size, lineHeight, letterSpacing]. */
export const typeScale = {
  displayXl: { size: 'clamp(2.5rem, 11vw, 3.5rem)', lh: '1.04', tracking: '-0.02em' },
  displayL: { size: '2.125rem', lh: '1.10', tracking: '-0.015em' },
  headline: { size: '1.625rem', lh: '1.18', tracking: '-0.01em' },
  title: { size: '1.25rem', lh: '1.25', tracking: '0em' },
  bodyL: { size: '1.0625rem', lh: '1.55', tracking: '0em' },
  body: { size: '0.9375rem', lh: '1.55', tracking: '0em' },
  caption: { size: '0.8125rem', lh: '1.40', tracking: '0.005em' },
  overline: { size: '0.75rem', lh: '1.30', tracking: '0.08em' },
} as const;

/* -------------------------------------------------------------------------- */
/* Motion — weight, not bounce. Canonical values within the locked ranges.      */
/* -------------------------------------------------------------------------- */

export const easing = {
  /** Signature: hero / stage / product / AR. Long decel settle. */
  authority: 'cubic-bezier(0.16, 1, 0.30, 1)',
  /** Sections / layout. Weighted in-out. */
  calm: 'cubic-bezier(0.33, 0, 0.10, 1)',
  /** Input acknowledgment. Near-instant decel. */
  response: 'cubic-bezier(0.22, 1, 0.36, 1)',
  /** Dismiss / recede. Accelerate away. */
  exit: 'cubic-bezier(0.40, 0, 1, 1)',
} as const;

/**
 * Numeric control points for the same curves — the typed channel for JS/render
 * motion math (the CSS `easing` strings above are the CSS channel). These MUST
 * mirror `easing` exactly; they are NOT emitted to tokens.generated.css.
 */
export const easingPoints = {
  authority: [0.16, 1, 0.3, 1],
  calm: [0.33, 0, 0.1, 1],
  response: [0.22, 1, 0.36, 1],
  exit: [0.4, 0, 1, 1],
} as const;

/** Durations in milliseconds. */
export const duration = {
  instant: 80,
  micro: 160,
  short: 280,
  medium: 560,
  cinematic: 1000,
  ambient: 9000,
} as const;

/* -------------------------------------------------------------------------- */
/* Z-index hierarchy — sheets are preferred over modals; modal is rare/top.     */
/* -------------------------------------------------------------------------- */

export const zIndex = {
  stage: 0, // persistent canvas slot (behind everything)
  content: 10,
  nav: 20,
  sheet: 30,
  actionBar: 40,
  scrim: 50,
  overlay: 60,
  modal: 70,
} as const;
