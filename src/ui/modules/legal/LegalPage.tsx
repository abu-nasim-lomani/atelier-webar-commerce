/**
 * LegalPage — the shared layout for plain-language policy pages (privacy,
 * terms, returns). Content-only, constrained to a comfortable reading measure.
 * Pure presentational; the route supplies the copy.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text } from '@/ui/primitives';

export interface LegalSection {
  readonly heading: string;
  readonly body: readonly string[];
}

interface LegalPageProps {
  readonly title: string;
  readonly updated: string;
  readonly intro: string;
  readonly sections: readonly LegalSection[];
}

export function LegalPage({
  title,
  updated,
  intro,
  sections,
}: LegalPageProps): ReactElement {
  return (
    <Section rhythm="loose" label={title}>
      <Container width="text">
        <Stack gap="s7">
          <Stack gap="s3">
            <Text variant="overline" tone="inkMuted">
              Legal
            </Text>
            <Text as="h1" variant="displayL">
              {title}
            </Text>
            <Text variant="caption" tone="inkMuted">
              {updated}
            </Text>
          </Stack>

          <Text variant="bodyL" tone="inkSoft">
            {intro}
          </Text>

          {sections.map((section) => (
            <Stack key={section.heading} gap="s4">
              <Text as="h2" variant="title">
                {section.heading}
              </Text>
              {section.body.map((paragraph, index) => (
                <Text
                  key={`${section.heading}-${String(index)}`}
                  variant="body"
                  tone="inkSoft"
                >
                  {paragraph}
                </Text>
              ))}
            </Stack>
          ))}
        </Stack>
      </Container>
    </Section>
  );
}
