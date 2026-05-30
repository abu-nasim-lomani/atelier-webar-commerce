/**
 * SiteFooter — quiet utility. Minimal by intent; no link dump.
 *
 * Links point at routes that now exist (the product + the legal/trust pages).
 */
import type { ReactElement } from 'react';
import Link from 'next/link';
import { Container, Stack, Inline, Text, Divider } from '@/ui/primitives';
import styles from './SiteFooter.module.css';

const LINKS = [
  { label: 'The Sofa', href: '/product/hero-sofa' },
  { label: 'Returns & delivery', href: '/returns' },
  { label: 'Contact', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
] as const;

export function SiteFooter(): ReactElement {
  return (
    <footer className={styles.footer}>
      <Container>
        <Divider />
        <Stack gap="s6" className={styles.inner}>
          <Inline justify="between" align="baseline" wrap gap="s6">
            <Text variant="title">Atelier</Text>
            <Inline wrap gap="s6">
              {LINKS.map(({ label, href }) => (
                <Link key={href} href={href} className={styles.link}>
                  <Text as="span" variant="caption" tone="inkMuted">
                    {label}
                  </Text>
                </Link>
              ))}
            </Inline>
          </Inline>
          <Text variant="caption" tone="inkMuted">
            © Atelier. Crafted for considered spaces.
          </Text>
          <Text variant="caption" tone="inkMuted">
            3D model “Mid Century Modern Sofa” by Tom Seddon, licensed CC BY 4.0.
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
