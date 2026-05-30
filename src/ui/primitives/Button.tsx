/**
 * Button — the action primitive.
 *
 * Three variants only. `primary` is the single accent action per screen
 * (a usage rule, not enforceable here). Touch targets meet the locked
 * ergonomics (≥48px; primary ≥56px). Press feedback uses ease-response /
 * duration-instant — input acknowledgment is never slow.
 *
 * `href` makes the same visual a Next `<Link>` (an anchor) — for navigation
 * to internal routes. Without `href` it stays a `<button>`.
 */
import type { ReactElement, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

type Variant = 'primary' | 'ghost' | 'text';

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> {
  readonly variant?: Variant;
  readonly className?: string | undefined;
  /** When set, render as a Next `<Link>` for internal navigation. */
  readonly href?: string;
}

export function Button({
  variant = 'ghost',
  type = 'button',
  className,
  href,
  children,
  ...rest
}: ButtonProps): ReactElement {
  const composed = cx(styles.button, styles[variant], className);

  if (href !== undefined) {
    // Nav variant: Next Link as an anchor — anchor-specific props only.
    return (
      <Link href={href} className={composed}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={composed} {...rest}>
      {children}
    </button>
  );
}
