/**
 * Button — the action primitive.
 *
 * Three variants only. `primary` is the single accent action per screen
 * (a usage rule, not enforceable here). Touch targets meet the locked
 * ergonomics (≥48px; primary ≥56px). Press feedback uses ease-response /
 * duration-instant — input acknowledgment is never slow.
 */
import type { ReactElement, ButtonHTMLAttributes } from 'react';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'text';

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  readonly variant?: Variant;
  readonly className?: string | undefined;
}

export function Button({
  variant = 'ghost',
  type = 'button',
  className,
  ...rest
}: ButtonProps): ReactElement {
  return (
    <button
      type={type}
      className={cx(styles.button, styles[variant], className)}
      {...rest}
    />
  );
}
