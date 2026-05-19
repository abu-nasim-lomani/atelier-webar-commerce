/**
 * LoadingState — the pause, not a spinner (locked: no spinners, ever).
 *
 * A composed wordmark with a faint breathing presence. Wired into the genuine
 * Next route-loading slot (app/loading.tsx). Breathing is motion-gated in CSS
 * so reduced-motion / weak devices simply see a calm, still wordmark.
 */
import type { ReactElement } from 'react';
import { Container, Stack, Text } from '@/ui/primitives';
import styles from './LoadingState.module.css';

export function LoadingState(): ReactElement {
  return (
    <div className={styles.screen} role="status" aria-live="polite">
      <Container width="text">
        <Stack gap="s4" align="center">
          <Text as="p" variant="displayL" className={styles.mark}>
            Atelier
          </Text>
          <Text variant="caption" tone="inkMuted">
            Preparing a calm space.
          </Text>
        </Stack>
      </Container>
    </div>
  );
}
