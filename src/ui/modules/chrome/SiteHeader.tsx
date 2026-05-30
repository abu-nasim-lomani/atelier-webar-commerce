/**
 * SiteHeader — persistent, quiet chrome.
 *
 * The brand philosophy is "interface recedes": this is a slim, borderless bar
 * that gives every route a wordmark home-link and one calm path to the product.
 * No menu, no dropdowns — restraint over a link dump. The brand string is
 * passed in (from the site config) so it stays centralised.
 */
import type { ReactElement } from 'react';
import Link from 'next/link';
import { Container, Inline, Text } from '@/ui/primitives';
import styles from './SiteHeader.module.css';

interface SiteHeaderProps {
  readonly brand: string;
  readonly productHref: string;
  readonly productLabel: string;
}

export function SiteHeader({
  brand,
  productHref,
  productLabel,
}: SiteHeaderProps): ReactElement {
  return (
    <header className={styles.header}>
      <Container>
        <Inline justify="between" align="center">
          <Link href="/" className={styles.brand} aria-label={`${brand} — home`}>
            <Text as="span" variant="title">
              {brand}
            </Text>
          </Link>
          <Link href={productHref} className={styles.link}>
            <Text as="span" variant="caption">
              {productLabel}
            </Text>
          </Link>
        </Inline>
      </Container>
    </header>
  );
}
