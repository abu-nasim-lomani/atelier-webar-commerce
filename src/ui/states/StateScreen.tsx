/**
 * StateScreen — the shared calm shell for every system state.
 *
 * One restrained composition: a quiet label, a reassuring line, an optional
 * gentle next step. Never an error panel, never panic language. A focused
 * shared layout for the four states — not a generic abstraction.
 */
import type { ReactElement, ReactNode } from 'react';
import { Container, Stack, Text } from '@/ui/primitives';
import styles from './StateScreen.module.css';

interface StateScreenProps {
  readonly eyebrow: string;
  readonly title: string;
  readonly message: string;
  /** Optional quiet next step (presentational in A2; wired in later phases). */
  readonly action?: ReactNode;
  /** Politely announce transient states (loading / network). */
  readonly live?: boolean;
}

export function StateScreen({
  eyebrow,
  title,
  message,
  action,
  live = false,
}: StateScreenProps): ReactElement {
  return (
    <div
      className={styles.screen}
      {...(live ? { role: 'status', 'aria-live': 'polite' } : {})}
    >
      <Container width="text">
        <Stack gap="s5" align="start">
          <Text variant="overline" tone="inkMuted">
            {eyebrow}
          </Text>
          <Text as="h1" variant="headline">
            {title}
          </Text>
          <Text variant="bodyL" tone="inkSoft">
            {message}
          </Text>
          {action !== undefined && <div className={styles.action}>{action}</div>}
        </Stack>
      </Container>
    </div>
  );
}
