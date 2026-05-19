/**
 * SiteFooter — quiet utility. Minimal by intent; no link dump.
 *
 * The labels are rendered as plain text, not links: their routes do not exist
 * yet (later phases). Honest over a dead `href="#"`.
 */
import type { ReactElement } from 'react';
import { Container, Stack, Inline, Text, Divider } from '@/ui/primitives';
import styles from './SiteFooter.module.css';

const LINKS = ['The collection', 'How it works', 'Showroom', 'Contact'] as const;

export function SiteFooter(): ReactElement {
  return (
    <footer className={styles.footer}>
      <Container>
        <Divider />
        <Stack gap="s6" className={styles.inner}>
          <Inline justify="between" align="baseline" wrap gap="s6">
            <Text variant="title">Atelier</Text>
            <Inline wrap gap="s6">
              {LINKS.map((link) => (
                <Text key={link} variant="caption" tone="inkMuted">
                  {link}
                </Text>
              ))}
            </Inline>
          </Inline>
          <Text variant="caption" tone="inkMuted">
            © Atelier. Crafted for considered spaces.
          </Text>
        </Stack>
      </Container>
    </footer>
  );
}
