'use client';

/**
 * Client provider composition root.
 *
 * Reserved architectural slot. Future phases mount capability, store, and
 * analytics providers here — kept explicit and minimal in A1 so the wiring
 * point exists without premature implementation. No business logic.
 */
import type { ReactNode, ReactElement } from 'react';

export function Providers({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return <>{children}</>;
}
