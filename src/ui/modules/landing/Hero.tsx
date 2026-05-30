/**
 * Hero — the cinematic arrival.
 *
 * Calm editorial composition, weighted typographic rhythm, restrained CTA
 * hierarchy (one quiet primary, one text secondary). The `.stage` region is a
 * slot the app composition root fills with the 3D canvas — the canvas lives
 * INSIDE the stage div (DOM-flow), so it scrolls with the page as one unit
 * and stays framed without scissor sync. UI never imports the renderer.
 */
import type { ReactElement, ReactNode } from 'react';
import { Section, Container, Stack, Inline, Text, Button, Reveal } from '@/ui/primitives';
import styles from './Hero.module.css';

interface HeroProps {
  /** The 3D canvas, passed in from the app layer (boundary preserved). */
  readonly stage?: ReactNode | undefined;
}

export function Hero({ stage }: HeroProps): ReactElement {
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
              <Button variant="primary" href="/product/hero-sofa">
                Explore the collection
              </Button>
              <Button variant="text" href="#how-it-works">
                How it works
              </Button>
            </Inline>
          </Reveal>
        </Stack>
      </Container>

      {/* The product stage. The 3D canvas mounts INSIDE this div as a DOM-
          flow element — it scrolls with the section so it can never drift
          outside the frame. Decorative for the a11y tree. */}
      <div className={styles.stage} aria-hidden="true" data-render-stage="">
        {stage}
      </div>
    </Section>
  );
}
