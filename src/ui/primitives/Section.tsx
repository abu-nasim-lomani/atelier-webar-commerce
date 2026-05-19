/**
 * Section — the vertical rhythm primitive.
 *
 * Owns the cinematic pacing between narrative beats via a controlled rhythm
 * variant. Optional `raised` tone provides tonal layering (separate by tone,
 * not borders — the locked rule).
 */
import type { ReactElement, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import styles from './Section.module.css';

type Rhythm = 'default' | 'loose' | 'hero';

interface SectionProps {
  readonly children: ReactNode;
  readonly rhythm?: Rhythm;
  readonly raised?: boolean;
  readonly id?: string;
  readonly label?: string;
  readonly className?: string | undefined;
}

export function Section({
  children,
  rhythm = 'default',
  raised = false,
  id,
  label,
  className,
}: SectionProps): ReactElement {
  return (
    <section
      className={cx(
        styles.section,
        styles[rhythm],
        raised && styles.raised,
        className,
      )}
      {...(id ? { id } : {})}
      {...(label ? { 'aria-label': label } : {})}
    >
      {children}
    </section>
  );
}
