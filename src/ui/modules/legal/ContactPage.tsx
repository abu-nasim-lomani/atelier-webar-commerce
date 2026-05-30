/**
 * ContactPage — the human handoff page. WhatsApp is the primary, locked close
 * for this market, so it leads; email and the showroom follow. The WhatsApp URL
 * is composed in the route (commerce layer) and passed in; this stays pure.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text } from '@/ui/primitives';
import styles from './ContactPage.module.css';

interface ContactPageProps {
  readonly intro: string;
  readonly whatsappUrl: string;
  readonly email: string;
  readonly addressLines: readonly string[];
  readonly hours: string;
}

export function ContactPage({
  intro,
  whatsappUrl,
  email,
  addressLines,
  hours,
}: ContactPageProps): ReactElement {
  return (
    <Section rhythm="loose" label="Contact">
      <Container width="text">
        <Stack gap="s7">
          <Stack gap="s3">
            <Text variant="overline" tone="inkMuted">
              Talk to us
            </Text>
            <Text as="h1" variant="displayL">
              Contact
            </Text>
            <Text variant="bodyL" tone="inkSoft">
              {intro}
            </Text>
          </Stack>

          <a
            href={whatsappUrl}
            className={styles.primary}
            target="_blank"
            rel="noopener noreferrer"
          >
            Message us on WhatsApp
          </a>

          <Stack gap="s4">
            <Text as="h2" variant="title">
              Email
            </Text>
            <a href={`mailto:${email}`} className={styles.link}>
              <Text as="span" variant="body">
                {email}
              </Text>
            </a>
          </Stack>

          <Stack gap="s4">
            <Text as="h2" variant="title">
              Showroom
            </Text>
            <Stack gap="s1">
              {addressLines.map((line) => (
                <Text key={line} variant="body" tone="inkSoft">
                  {line}
                </Text>
              ))}
            </Stack>
            <Text variant="caption" tone="inkMuted">
              {hours}
            </Text>
          </Stack>
        </Stack>
      </Container>
    </Section>
  );
}
