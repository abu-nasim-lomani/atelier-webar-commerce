/**
 * Token kind unions — the typed vocabulary primitives accept.
 * Standalone so both the barrel and the var accessors can depend on it
 * without a cycle.
 */

export type TypeVariant =
  | 'displayXl'
  | 'displayL'
  | 'headline'
  | 'title'
  | 'bodyL'
  | 'body'
  | 'caption'
  | 'overline';

export type SpaceToken =
  | 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7' | 's8' | 's9' | 's10';

export type RadiusToken = 'r0' | 'rSm' | 'rMd' | 'rLg' | 'rXl' | 'rPill';

export type SurfaceTone = 'canvas' | 'canvasRaised' | 'canvasSunk';

export type ElevationToken = 'none' | 'e1' | 'e2';
