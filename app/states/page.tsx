/**
 * TEMPORARY A2 review surface — lets the system states be reviewed now.
 *
 * Same precedent as the A1 smoke screen: a verification surface, not product.
 * Later phases (capability / AR) mount these states conditionally and this
 * route is removed. No logic, no fake APIs — presentation only.
 */
import type { ReactElement } from 'react';
import { Container, Text, Divider } from '@/ui/primitives';
import {
  LoadingState,
  WeakNetworkState,
  ARUnsupportedState,
  ReducedCapabilityState,
} from '@/ui/states';

export default function StatesReview(): ReactElement {
  return (
    <>
      <Container width="text">
        <Text variant="overline" tone="inkMuted">
          A2 review · system states
        </Text>
      </Container>
      <LoadingState />
      <Divider />
      <WeakNetworkState />
      <Divider />
      <ARUnsupportedState />
      <Divider />
      <ReducedCapabilityState />
    </>
  );
}
