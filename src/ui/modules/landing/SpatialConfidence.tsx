/**
 * SpatialConfidence — the core value, as three paced statements separated by
 * hairlines (NOT a card grid). Restraint over feature-listing.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Divider, Reveal } from '@/ui/primitives';
import styles from './SpatialConfidence.module.css';

const POINTS = [
  {
    title: 'True scale',
    body: 'Every piece is shown at its exact real-world size — never resized to flatter a room.',
  },
  {
    title: 'Your space',
    body: 'Placed where it will actually live, in the light it will actually have.',
  },
  {
    title: 'No pressure',
    body: 'Take the time the decision deserves. Nothing here is built to rush you.',
  },
] as const;

/** Stagger positions for the points (typed — no assertion needed). */
const ORDER = [2, 3, 4] as const;

export function SpatialConfidence(): ReactElement {
  return (
    <Section id="how-it-works" label="Confidence">
      <Container>
        <Stack gap="s7">
          <Reveal>
            <Stack gap="s4">
              <Text variant="overline" tone="inkMuted">
                Confidence
              </Text>
              <Text as="h2" variant="headline">
                Know it fits. Before you decide.
              </Text>
            </Stack>
          </Reveal>

          <Stack gap="s6">
            {POINTS.map((point, i) => (
              <Reveal key={point.title} order={ORDER[i % ORDER.length] ?? 2}>
                <Stack gap="s4">
                  {i > 0 && <Divider />}
                  <div className={styles.row}>
                    <Text variant="title">{point.title}</Text>
                    <Text variant="body" tone="inkSoft">
                      {point.body}
                    </Text>
                  </div>
                </Stack>
              </Reveal>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
