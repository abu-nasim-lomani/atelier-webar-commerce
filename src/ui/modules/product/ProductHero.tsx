/**
 * ProductHero — the product page's calm arrival.
 *
 * Editorial title block + the stage region (with `data-render-stage` so the
 * persistent canvas scissors here, just like the landing hero). Pure
 * presentational: receives a product summary, renders text + the framed stage.
 *
 * NOTE: the locked H-deferred Hero-stage containment polish applies here too.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Reveal } from '@/ui/primitives';
import type { ProductSummary } from './types';
import styles from './ProductHero.module.css';

interface ProductHeroProps {
  readonly product: ProductSummary;
}

export function ProductHero({ product }: ProductHeroProps): ReactElement {
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

      {/* Product stage. Persistent canvas scissors the 3D placeholder here
          (same `[data-render-stage]` selector as the landing hero — only one
          such element exists per route). Transparent on purpose. */}
      <div className={styles.stage} aria-hidden="true" data-render-stage="" />
    </Section>
  );
}
