/**
 * Site identity + canonical origin — the single source for SEO metadata, the
 * web manifest, robots, the sitemap, and the Open Graph image routes.
 *
 * `url` MUST be the real production origin for correct absolute OG / canonical
 * URLs. Set `NEXT_PUBLIC_SITE_URL` in the deploy environment (e.g. the Vercel
 * project env). The localhost fallback keeps `pnpm dev` correct with no config.
 *
 * The brand name is "Atelier" (confirmed). The WhatsApp number lives in the
 * commerce layer (env-overridable). What still needs filling before launch: the
 * contact email and showroom address on the Contact page, and the marked
 * placeholders in the legal pages.
 */
const rawUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const SITE = {
  name: 'Atelier',
  shortName: 'Atelier',
  title: 'Atelier — See it home before it’s home',
  description:
    'A calm, true-to-scale way to see furniture in your own room before it arrives — WebAR, with no app to install.',
  /** Canonical origin, no trailing slash. */
  url: rawUrl.replace(/\/+$/, ''),
  /** OG / BCP-47 locale. */
  locale: 'en_US',
} as const;
