/**
 * robots.txt — allow all crawlers, point them at the sitemap. Uses the
 * canonical origin from the site config (set NEXT_PUBLIC_SITE_URL on deploy).
 */
import type { MetadataRoute } from 'next';
import { SITE } from '@config/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
