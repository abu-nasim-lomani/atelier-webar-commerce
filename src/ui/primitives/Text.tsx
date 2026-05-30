/**
 * Text — the typographic primitive.
 *
 * Accepts ONLY locked type-scale variants and semantic tones. It is
 * structurally impossible to pass a raw size, weight, or colour. Display-tier
 * variants render in the editorial serif voice; UI tiers in the grotesque.
 */
import { createElement, type ElementType, type ReactElement } from 'react';
import type { TypeVariant } from '@/tokens';
import type { PolymorphicProps } from '@/types';
import { cx } from '@/lib/cx';
import styles from './Text.module.css';

type Tone = 'ink' | 'inkSoft' | 'inkMuted' | 'accent';

interface TextOwnProps {
  readonly variant: TypeVariant;
  readonly tone?: Tone;
  /** Enables tabular numerals — use for any meaningful numbers. */
  readonly numeric?: boolean;
  readonly className?: string | undefined;
}

export function Text<TElement extends ElementType = 'p'>({
  as,
  variant,
  tone = 'ink',
  numeric = false,
  className,
  ...rest
}: PolymorphicProps<TElement, TextOwnProps>): ReactElement {
  const Component: ElementType = as ?? 'p';
  // createElement (not JSX): React 19 collapses a bare ElementType's JSX
  // props to `never`; createElement keeps this polymorphic and fully typed.
  return createElement(Component, {
    className: cx(styles.text, styles[variant], styles[tone], className),
    ...(numeric ? { 'data-numeric': '' } : {}),
    ...rest,
  });
}
