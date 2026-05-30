/**
 * ProductAssurance — the locked trust band, scoped to the buying moment.
 *
 * Calm factual promises (mechanisms, not fabricated contact data) — the
 * Bangladesh-market trust unlock: pay on delivery + a person on WhatsApp +
 * showroom + true scale. Pure presentational; no commerce/state/render deps.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Divider } from '@/ui/primitives';
import styles from './ProductAssurance.module.css';

const PROMISES = [
  'True-to-scale visualisation',
  'Speak with a person on WhatsApp',
  'Pay on delivery',
  'See it at the showroom',
] as const;

export function ProductAssurance(): ReactElement {
  return (
    <Section rhythm="loose" raised label="What you get">
      <Container>
        <Stack gap="s7">
          <Stack gap="s3">
            <Text variant="overline" tone="inkMuted">
              Buying this piece
            </Text>
            <Text as="h2" variant="headline">
              What you get with every order.
            </Text>
          </Stack>
          <ul className={styles.list}>
            {PROMISES.map((promise, i) => (
              <li key={promise} className={styles.item}>
                {i > 0 && <Divider className={styles.rule} />}
                <Text variant="body">{promise}</Text>
              </li>
            ))}
          </ul>
        </Stack>
      </Container>
    </Section>
  );
}
