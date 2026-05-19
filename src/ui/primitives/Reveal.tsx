'use client';

/**
 * Reveal — restrained on-enter motion (opacity + a small token-sized rise).
 *
 * Allowed motion only: opacity + transform, weighted `ease-authority`. No
 * bounce, no parallax, no scroll-hijack. `order` provides an editorial stagger
 * via token-driven `transition-delay` (no raw timing values).
 */
import type { ReactElement, ReactNode } from 'react';
import { useReveal } from '@/hooks/useReveal';
import { cx } from '@/lib/cx';
import styles from './Reveal.module.css';

type Order = 1 | 2 | 3 | 4;

interface RevealProps {
  readonly children: ReactNode;
  /** Stagger position within a group (1–4). */
  readonly order?: Order;
  readonly className?: string | undefined;
}

export function Reveal({
  children,
  order,
  className,
}: RevealProps): ReactElement {
  const { ref, armed, shown } = useReveal();
  return (
    <div
      ref={ref}
      className={cx(
        styles.reveal,
        order !== undefined && styles[`d${String(order)}`],
        className,
      )}
      {...(armed ? { 'data-armed': 'true' } : {})}
      {...(shown ? { 'data-shown': 'true' } : {})}
    >
      {children}
    </div>
  );
}
