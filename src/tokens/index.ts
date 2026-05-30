/**
 * TOKENS — public API (the typed TS channel).
 *
 * Consumers in TS (future motion/render math) import from here. UI consumes the
 * generated CSS-variable channel (`tokens.generated.css`) via `var(--token)`.
 * Both channels are derived from the same primitive source.
 */
export { color, ar, contactShadow } from './color';
export { elevation } from './elevation';
export { hexToLinear, type LinearRGB } from './colorSpace';
export { spaceVar, radiusVar } from './vars';
export {
  palette,
  space,
  radius,
  touch,
  breakpoint,
  fontFamily,
  fontWeight,
  typeScale,
  easing,
  easingPoints,
  duration,
  zIndex,
} from './primitive';

export type {
  TypeVariant,
  SpaceToken,
  RadiusToken,
  SurfaceTone,
  ElevationToken,
} from './kinds';
