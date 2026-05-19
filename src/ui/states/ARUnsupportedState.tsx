/**
 * ARUnsupportedState — never a dead end. The augmented view simply isn't
 * available here; the true-to-scale promise is kept another way.
 */
import type { ReactElement } from 'react';
import { Button } from '@/ui/primitives';
import { StateScreen } from './StateScreen';

export function ARUnsupportedState(): ReactElement {
  return (
    <StateScreen
      eyebrow="Shown another way"
      title="This device shows it differently."
      message="Augmented view isn’t available here — so we’ll present each piece true-to-scale in a calm, simple way instead. You’ll still know exactly how it sits."
      action={<Button variant="ghost">See it true-to-scale</Button>}
    />
  );
}
