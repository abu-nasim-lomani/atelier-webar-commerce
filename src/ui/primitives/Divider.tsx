/**
 * Divider — a quiet hairline. Editorial separation without weight.
 */
import type { ReactElement } from 'react';
import { cx } from '@/lib/cx';
import styles from './Divider.module.css';

export function Divider({
  className,
}: {
  readonly className?: string | undefined;
}): ReactElement {
  return <hr className={cx(styles.divider, className)} />;
}
