/**
 * ReducedCapabilityState — the device is gently asked to do less, and that is
 * presented as a considered choice, not a failure.
 */
import type { ReactElement } from 'react';
import { Button } from '@/ui/primitives';
import { StateScreen } from './StateScreen';

export function ReducedCapabilityState(): ReactElement {
  return (
    <StateScreen
      eyebrow="A calmer mode"
      title="Simplified, so it stays smooth."
      message="We’ve eased back the visuals to keep everything fluid on this device. The essentials are all here — quiet, clear, and complete."
      action={<Button variant="ghost">Continue</Button>}
    />
  );
}
