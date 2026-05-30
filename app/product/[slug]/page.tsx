/**
 * Product route (Server Component).
 *
 * Resolves the slug via the commerce catalog. Renders the client orchestrator
 * with the resolved product, or Next's 404 if the slug is unknown. Plain data
 * crosses the server→client boundary; functions/state live in the client.
 *
 * Suspense boundary is required by Next 15 for the orchestrator's
 * `useSearchParams` (URL-as-state sync) on statically rendered routes.
 */
import { Suspense, type ReactElement } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { findProductBySlug } from '@/commerce';
import { SITE } from '@config/site';
import { ProductOrchestrator } from './ProductOrchestrator';

interface ProductPageProps {
  readonly params: Promise<{ readonly slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (product === null) return {};

  const path = `/product/${product.slug}`;
  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: SITE.name,
      title: `${product.name} · ${SITE.name}`,
      description: product.description,
      url: path,
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
    },
  };
}

export default async function ProductPage({
  params,
}: ProductPageProps): Promise<ReactElement> {
  const { slug } = await params;
  const product = findProductBySlug(slug);
  if (product === null) notFound();
  return (
    <Suspense>
      <ProductOrchestrator product={product} />
    </Suspense>
  );
}
