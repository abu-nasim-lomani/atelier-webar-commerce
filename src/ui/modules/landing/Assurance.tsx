/**
 * Assurance — quiet, factual reassurance (mechanisms, not fabricated contact
 * data). Trust through clarity, not badges.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Divider, Reveal } from '@/ui/primitives';
import styles from './Assurance.module.css';

const PROMISES = [
  'True-to-scale visualisation',
  'Speak with a person',
  'Pay on delivery',
  'See it at the showroom',
] as const;

export function Assurance(): ReactElement {
  return (
    <Section label="Assurance">
      <Container>
        <Stack gap="s7">
          <Reveal>
            <Stack gap="s4">
              <Text variant="overline" tone="inkMuted">
                Assurance
              </Text>
              <Text as="h2" variant="headline">
                A purchase you can stand behind.
              </Text>
            </Stack>
          </Reveal>
          <Reveal>
            <ul className={styles.list}>
              {PROMISES.map((promise, i) => (
                <li key={promise} className={styles.item}>
                  {i > 0 && <Divider className={styles.rule} />}
                  <Text variant="body">{promise}</Text>
                </li>
              ))}
            </ul>
          </Reveal>
        </Stack>
      </Container>
    </Section>
  );
}
