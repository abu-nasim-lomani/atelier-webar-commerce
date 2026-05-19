/**
 * The cinematic 2D floor (A2).
 *
 * Replaces the A1 scaffold smoke screen with the real, premium experience —
 * still WebGL/AR/renderer-free. This page must read as a luxury interiors
 * brand on its own: it is the locked "worst case = quiet, not broken".
 *
 * Server Component. The only client island is <Reveal> (motion is additive).
 */
import type { ReactElement } from 'react';
import {
  Hero,
  Premise,
  SpatialConfidence,
  CollectionPreview,
  Assurance,
  ClosingCta,
  SiteFooter,
} from '@/ui/modules/landing';

export default function LandingPage(): ReactElement {
  return (
    <>
      <Hero />
      <Premise />
      <SpatialConfidence />
      <CollectionPreview />
      <Assurance />
      <ClosingCta />
      <SiteFooter />
    </>
  );
}
