/**
 * Inline — horizontal layout primitive. Gap is a spacing token, never raw.
 */
import { createElement, type ElementType, type ReactElement } from 'react';
import type { SpaceToken } from '@/tokens';
import type { PolymorphicProps, StyleVars } from '@/types';
import { spaceVar } from '@/tokens';
import { cx } from '@/lib/cx';
import styles from './Inline.module.css';

type Align = 'start' | 'center' | 'baseline';
type Justify = 'start' | 'center' | 'between';

interface InlineOwnProps {
  readonly gap?: SpaceToken;
  readonly align?: Align;
  readonly justify?: Justify;
  readonly wrap?: boolean;
  readonly className?: string | undefined;
}

export function Inline<TElement extends ElementType = 'div'>({
  as,
  gap = 's3',
  align = 'center',
  justify = 'start',
  wrap = false,
  className,
  style,
  ...rest
}: PolymorphicProps<TElement, InlineOwnProps> & {
  readonly style?: StyleVars;
}): ReactElement {
  const Component: ElementType = as ?? 'div';
  const merged: StyleVars = { ...style, '--inline-gap': spaceVar(gap) };
  return createElement(Component, {
    className: cx(
      styles.inline,
      styles[`a-${align}`],
      styles[`j-${justify}`],
      wrap && styles.wrap,
      className,
    ),
    style: merged,
    ...rest,
  });
}
