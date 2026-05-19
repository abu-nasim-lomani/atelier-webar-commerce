/**
 * Stack — vertical layout primitive. Gap is a spacing token, never a raw value.
 */
import type { ElementType, ReactElement } from 'react';
import type { SpaceToken } from '@/tokens';
import type { PolymorphicProps, StyleVars } from '@/types';
import { spaceVar } from '@/tokens';
import { cx } from '@/lib/cx';
import styles from './Stack.module.css';

type Align = 'start' | 'center' | 'stretch';

interface StackOwnProps {
  readonly gap?: SpaceToken;
  readonly align?: Align;
  readonly className?: string | undefined;
}

export function Stack<TElement extends ElementType = 'div'>({
  as,
  gap = 's4',
  align = 'stretch',
  className,
  style,
  ...rest
}: PolymorphicProps<TElement, StackOwnProps> & {
  readonly style?: StyleVars;
}): ReactElement {
  const Component: ElementType = as ?? 'div';
  const merged: StyleVars = { ...style, '--stack-gap': spaceVar(gap) };
  return (
    <Component
      className={cx(styles.stack, styles[align], className)}
      style={merged}
      {...rest}
    />
  );
}
