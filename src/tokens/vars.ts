/**
 * Typed CSS-variable accessors.
 *
 * The only sanctioned bridge between the typed token API and inline custom
 * properties. Returns `var(--token)` references — never raw values — so
 * components stay token-only while remaining type-safe.
 */
import type { SpaceToken, RadiusToken } from './kinds';

export const spaceVar = (token: SpaceToken): string => `var(--space-${token})`;

const radiusVarName: Record<RadiusToken, string> = {
  r0: '--radius-r0',
  rSm: '--radius-r-sm',
  rMd: '--radius-r-md',
  rLg: '--radius-r-lg',
  rXl: '--radius-r-xl',
  rPill: '--radius-r-pill',
};

export const radiusVar = (token: RadiusToken): string =>
  `var(${radiusVarName[token]})`;
