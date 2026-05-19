/**
 * Surface — the layering primitive.
 *
 * Conveys depth through tone + (rarely) soft warm elevation, per the locked
 * "max 3 perceptual layers, separate by tone not borders" rule. Radius is a
 * token reference, never a raw value.
 */
import type { ElementType, ReactElement } from 'react';
import type { SurfaceTone, ElevationToken, RadiusToken } from '@/tokens';
import type { PolymorphicProps, StyleVars } from '@/types';
import { radiusVar } from '@/tokens';
import { cx } from '@/lib/cx';
import styles from './Surface.module.css';

interface SurfaceOwnProps {
  readonly tone?: SurfaceTone;
  readonly elevation?: ElevationToken;
  readonly radius?: RadiusToken;
  readonly className?: string | undefined;
}

export function Surface<TElement extends ElementType = 'div'>({
  as,
  tone = 'canvas',
  elevation = 'none',
  radius = 'rMd',
  className,
  style,
  ...rest
}: PolymorphicProps<TElement, SurfaceOwnProps> & {
  readonly style?: StyleVars;
}): ReactElement {
  const Component: ElementType = as ?? 'div';
  // Consumer style merges first; the token var is the component's contract.
  const merged: StyleVars = { ...style, '--surface-radius': radiusVar(radius) };
  return (
    <Component
      className={cx(styles.surface, styles[tone], styles[elevation], className)}
      style={merged}
      {...rest}
    />
  );
}
