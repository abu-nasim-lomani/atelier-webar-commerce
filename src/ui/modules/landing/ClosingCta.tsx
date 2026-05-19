/**
 * ClosingCta — the narrative closes where it opened. One calm decision.
 */
import type { ReactElement } from 'react';
import { Section, Container, Stack, Inline, Text, Button, Reveal } from '@/ui/primitives';

export function ClosingCta(): ReactElement {
  return (
    <Section rhythm="loose" label="Begin">
      <Container width="text">
        <Reveal>
          <Stack gap="s6" align="start">
            <Text as="h2" variant="displayL">
              When you can see it, you can be sure.
            </Text>
            <Inline gap="s4" wrap>
              <Button variant="primary">Explore the collection</Button>
              <Button variant="text">How it works</Button>
            </Inline>
          </Stack>
        </Reveal>
      </Container>
    </Section>
  );
}
