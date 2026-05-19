/**
 * Premise — naming the buyer's quiet doubt. One calm editorial statement.
 * No imagery, no clutter; recognition, not selling.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Reveal } from '@/ui/primitives';

export function Premise(): ReactElement {
  return (
    <Section rhythm="loose" label="The difference">
      <Container width="text">
        <Reveal>
          <Stack gap="s5">
            <Text variant="overline" tone="inkMuted">
              The difference
            </Text>
            <Text as="h2" variant="displayL">
              Most furniture is bought on a guess.
            </Text>
            <Text variant="bodyL" tone="inkSoft">
              A photograph cannot tell you how a piece sits in your room, at its
              real size, in your light. We remove the guesswork — quietly, and
              without pressure.
            </Text>
          </Stack>
        </Reveal>
      </Container>
    </Section>
  );
}
