/**
 * Sitemap — the landing page plus every product route, enumerated from the
 * commerce catalog so it stays accurate as the curated hero set grows.
 */
import type { MetadataRoute } from 'next';
import { catalog } from '@/commerce';
import { SITE } from '@config/site';

const STATIC_PATHS = ['/privacy', '/terms', '/returns', '/contact'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const products: MetadataRoute.Sitemap = catalog.map((product) => ({
    url: `${SITE.url}/product/${product.slug}`,
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const pages: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  return [
    { url: SITE.url, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...products,
    ...pages,
  ];
}
