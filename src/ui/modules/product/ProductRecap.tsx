/**
 * ProductRecap — the Confidence Recap moment (Phase F3.4).
 *
 * Prompts the buyer to send the Decision Artifact card to family — the locked
 * collective-decision mechanic for BD homes. Pure presentational: the app
 * composition root captures the sofa + composes the card + shares; this only
 * renders the prompt and a calm preparing state.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Text, Button } from '@/ui/primitives';

interface ProductRecapProps {
  readonly onShare: () => void;
  readonly sharing: boolean;
}

export function ProductRecap({
  onShare,
  sharing,
}: ProductRecapProps): ReactElement {
  return (
    <Section rhythm="loose" raised label="Share">
      <Container width="text">
        <Stack gap="s5">
          <Text variant="overline" tone="inkMuted">
            Decide together
          </Text>
          <Text as="h2" variant="headline">
            Send it to your family.
          </Text>
          <Text variant="bodyL" tone="inkSoft">
            A card with the sofa at its true size, finish and price — the way
            most homes decide together.
          </Text>
          <Button variant="ghost" onClick={onShare} disabled={sharing}>
            {sharing ? 'Preparing the card…' : 'Share with family'}
          </Button>
        </Stack>
      </Container>
    </Section>
  );
}
