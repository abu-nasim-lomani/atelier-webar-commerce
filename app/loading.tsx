/**
 * Genuine Next route-loading slot. Renders the calm pause (no spinner).
 * This is real integration, not a mock.
 */
import type { ReactElement } from 'react';
import { LoadingState } from '@/ui/states';

export default function Loading(): ReactElement {
  return <LoadingState />;
}
