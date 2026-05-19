/**
 * WeakNetworkState — a slower connection, framed calmly. No alarm.
 * Respecting the data wallet is itself a trust signal (Bangladesh-first).
 */
import type { ReactElement } from 'react';
import { Button } from '@/ui/primitives';
import { StateScreen } from './StateScreen';

export function WeakNetworkState(): ReactElement {
  return (
    <StateScreen
      live
      eyebrow="A lighter experience"
      title="We’re keeping things light."
      message="Your connection is gentle right now, so we’ll bring the full experience slowly — or you can continue in a simpler view. Nothing is lost."
      action={<Button variant="ghost">Continue lightly</Button>}
    />
  );
}
