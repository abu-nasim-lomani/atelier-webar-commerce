/**
 * Hero — the cinematic arrival.
 *
 * Calm editorial composition, weighted typographic rhythm, restrained CTA
 * hierarchy (one quiet primary, one text secondary). The `.stage` region
 * paints NO opaque background so the Phase-B persistent canvas can later show
 * through this exact area without restructuring (canvas coexistence).
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Inline, Text, Button, Reveal } from '@/ui/primitives';
import styles from './Hero.module.css';

export function Hero(): ReactElement {
  return (
    <Section rhythm="hero" label="Introduction">
      <Container>
        <Stack gap="s5">
          <Reveal order={1}>
            <Text variant="overline" tone="inkMuted">
              Furniture, seen clearly
            </Text>
          </Reveal>
          <Reveal order={2}>
            <Text as="h1" variant="displayXl" className={styles.headline}>
              See it home before it’s home.
            </Text>
          </Reveal>
          <Reveal order={3}>
            <Text variant="bodyL" tone="inkSoft" className={styles.lede}>
              A calm, true-to-scale way to know a piece is right — before it
              ever arrives.
            </Text>
          </Reveal>
          <Reveal order={4}>
            <Inline gap="s4" wrap>
              <Button variant="primary">Explore the collection</Button>
              <Button variant="text">How it works</Button>
            </Inline>
          </Reveal>
        </Stack>
      </Container>

      {/* Reserved stage region — intentionally quiet negative space.
          No opaque background: the future persistent canvas renders here. */}
      <div className={styles.stage} aria-hidden="true" />
    </Section>
  );
}
