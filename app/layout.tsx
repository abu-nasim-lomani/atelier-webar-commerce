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
import { Fraunces, Hanken_Grotesk } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import '@/styles/reset.css';
import '@/tokens/tokens.generated.css';
import '@/styles/base.css';
import { color } from '@/tokens';
import { SITE } from '@config/site';
import { Providers } from '@/app/Providers';
import { RootShell } from '@/app/RootShell';

/**
 * The locked typographic voice, finally loaded.
 *
 * The token layer references `--font-display-face` / `--font-text-face` with
 * static fallbacks; until now those variables were never defined, so the site
 * rendered in Georgia + system-ui. next/font self-hosts the real faces (no
 * render-blocking Google request, CLS minimised via size-adjusted fallbacks)
 * and binds each to the variable the tokens already expect.
 *
 * Display = Fraunces (editorial serif, the "voice"). UI/data = Hanken Grotesk
 * (warm humanist grotesque, a free stand-in for the Söhne-class brief — swap
 * the import here if a licensed face is acquired; nothing else changes).
 */
const display = Fraunces({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal'],
  display: 'swap',
  variable: '--font-display-face',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

const text = Hanken_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-text-face',
  fallback: [
    'system-ui',
    '-apple-system',
    'Segoe UI',
    'Roboto',
    'Helvetica Neue',
    'Arial',
    'sans-serif',
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.title, template: `%s · ${SITE.name}` },
  description: SITE.description,
  applicationName: SITE.name,
  formatDetection: { telephone: false },
  alternates: { canonical: '/' },
  // app/opengraph-image.tsx + app/icon.tsx are auto-detected by Next and wired
  // into og:image / twitter:image / icons — no explicit references needed here.
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
    locale: SITE.locale,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE.title,
    description: SITE.description,
  },
  robots: { index: true, follow: true },
  keywords: [
    'furniture',
    'WebAR',
    'augmented reality furniture',
    '3D furniture',
    'see furniture in your room',
    'sofa',
    'Bangladesh furniture',
  ],
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
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body>
        <Providers>
          <RootShell>{children}</RootShell>
        </Providers>
        {/* Cookieless, consent-free RUM: usage + Web Vitals. Field KPIs are the
            product metrics (locked). No-ops off Vercel / in dev. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
