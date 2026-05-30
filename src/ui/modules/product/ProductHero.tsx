/**
 * ProductHero — the product page's calm arrival.
 *
 * Editorial title block + the stage region. The 3D canvas is passed in by the
 * orchestrator (app layer) as the `stage` slot and mounts INSIDE the stage div
 * — the same DOM-flow containment as the landing hero, so it can never drift
 * outside the frame. UI never imports the renderer.
 */
import type { ReactElement, ReactNode } from 'react';
import { Section, Container, Stack, Text, Reveal } from '@/ui/primitives';
import type { ProductSummary } from './types';
import styles from './ProductHero.module.css';

interface ProductHeroProps {
  readonly product: ProductSummary;
  /** The 3D canvas, passed in by the orchestrator (boundary preserved). */
  readonly stage?: ReactNode | undefined;
}

export function ProductHero({ product, stage }: ProductHeroProps): ReactElement {
  return (
    <Section rhythm="hero" label="Product">
      <Container>
        <Stack gap="s5">
          <Reveal order={1}>
            <Text variant="overline" tone="inkMuted">
              The collection
            </Text>
          </Reveal>
          <Reveal order={2}>
            <Text as="h1" variant="displayL" className={styles.name}>
              {product.name}
            </Text>
          </Reveal>
          <Reveal order={3}>
            <Text variant="bodyL" tone="inkSoft" className={styles.tagline}>
              {product.tagline}
            </Text>
          </Reveal>
        </Stack>
      </Container>

      {/* Product stage. The 3D canvas mounts as a child of this div (DOM-flow
          containment). Decorative for the a11y tree. */}
      <div className={styles.stage} aria-hidden="true" data-render-stage="">
        {stage}
      </div>
    </Section>
  );
}
