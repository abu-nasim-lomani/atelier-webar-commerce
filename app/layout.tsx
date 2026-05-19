/**
 * Root layout (Server Component).
 *
 * Establishes the global CSS cascade in strict order, the typographic voice,
 * the viewport policy, and mounts the persistent shell. It does NOT render any
 * 3D — the canvas is a reserved architectural slot inside RootShell (Phase B).
 *
 * CSS order is load-bearing:
 *   reset  →  tokens (variables)  →  base (consumes variables)
 */
import type { Metadata, Viewport } from 'next';
import type { ReactNode, ReactElement } from 'react';
import '@/styles/reset.css';
import '@/tokens/tokens.generated.css';
import '@/styles/base.css';
import { color } from '@/tokens';
import { Providers } from '@/app/Providers';
import { RootShell } from '@/app/RootShell';

export const metadata: Metadata = {
  title: 'Atelier — See it home before it’s home',
  description:
    'A cinematic way to see furniture, at true scale, in your own room.',
  applicationName: 'Atelier',
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  // Cover the notch/safe areas; do NOT disable user zoom (accessibility).
  viewportFit: 'cover',
  themeColor: color.canvas,
};

export default function RootLayout({
  children,
}: {
  readonly children: ReactNode;
}): ReactElement {
  return (
    <html lang="en">
      <body>
        <Providers>
          <RootShell>{children}</RootShell>
        </Providers>
      </body>
    </html>
  );
}
