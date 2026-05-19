/**
 * Container — the editorial measure.
 *
 * Centres content to a comfortable reading/composition width and supplies the
 * responsive horizontal gutter. Width is a controlled variant, never an
 * arbitrary value.
 */
import type { ReactElement, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Container.module.css';

type Width = 'text' | 'default' | 'wide';

interface ContainerProps {
  readonly children: ReactNode;
  readonly width?: Width;
  readonly className?: string | undefined;
}

export function Container({
  children,
  width = 'default',
  className,
}: ContainerProps): ReactElement {
  return (
    <div className={cx(styles.container, styles[width], className)}>
      {children}
    </div>
  );
}
