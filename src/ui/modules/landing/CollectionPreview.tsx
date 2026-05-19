/**
 * CollectionPreview — the collection's STRUCTURE, not its contents.
 *
 * Real taxonomy, no fabricated products, prices, or imagery. Quiet framed
 * tiles imply curation arriving with the immersive experience — honest about
 * what exists today.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Reveal } from '@/ui/primitives';
import styles from './CollectionPreview.module.css';

const CATEGORIES = ['Seating', 'Tables', 'Storage', 'Lighting'] as const;

export function CollectionPreview(): ReactElement {
  return (
    <Section rhythm="loose" raised label="The collection">
      <Container>
        <Stack gap="s7">
          <Reveal>
            <Stack gap="s4">
              <Text variant="overline" tone="inkMuted">
                The collection
              </Text>
              <Text as="h2" variant="displayL">
                A short, considered selection.
              </Text>
              <Text variant="bodyL" tone="inkSoft">
                We begin with the pieces that matter most — chosen, not
                catalogued.
              </Text>
            </Stack>
          </Reveal>

          <Reveal>
            <ul className={styles.grid}>
              {CATEGORIES.map((name) => (
                <li key={name} className={styles.tile}>
                  <Text variant="overline" tone="inkMuted">
                    {name}
                  </Text>
                </li>
              ))}
            </ul>
          </Reveal>
        </Stack>
      </Container>
    </Section>
  );
}
