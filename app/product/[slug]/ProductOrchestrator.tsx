'use client';

/**
 * ProductOrchestrator — the composition root for the product route.
 *
 * Lives in the app layer (the only layer allowed to import BOTH commerce and
 * ui). Reads the zustand product-config slice, resolves defaults from the
 * catalog, computes the fit verdict, composes the Decision Artifact + the
 * WhatsApp deep-link, and hands READY props to pure presentational UI modules.
 * UI never touches commerce directly (boundary preserved).
 */
import { useEffect, type ReactElement } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  type ProductEntry,
  type DecisionArtifact,
  finishes,
  findFinishById,
  checkFit,
  buildWhatsAppUrl,
  composeWhatsAppMessage,
  encodeConfiguration,
  decodeConfiguration,
} from '@/commerce';
import { useProductConfig } from '@/state/productConfig';
import { materialBridge } from '@/render';
import {
  ProductHero,
  Dimensions,
  FinishSelector,
  FitChecker,
  ProductActionBar,
  ProductAssurance,
} from '@/ui/modules/product';
import { Section, Container, Stack, Text, Divider } from '@/ui/primitives';
import styles from './ProductOrchestrator.module.css';

interface ProductOrchestratorProps {
  readonly product: ProductEntry;
}

function formatPrice(amount: number, currency: 'BDT'): string {
  return `${amount.toLocaleString('en-IN')} ${currency}`;
}

export function ProductOrchestrator({
  product,
}: ProductOrchestratorProps): ReactElement {
  const storeFinishId = useProductConfig((s) => s.finishId);
  const roomWidth = useProductConfig((s) => s.roomWidthMeters);
  const setFinish = useProductConfig((s) => s.setFinish);
  const setRoomWidth = useProductConfig((s) => s.setRoomWidth);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Mount-only: URL → store. Lets a shared/QR-handoff link reopen the exact
  // configuration. Empty deps intentional (one-shot seed; later changes flow
  // store → URL, never URL → store, so no loop).
  useEffect(() => {
    const decoded = decodeConfiguration(searchParams.toString());
    if (decoded.finishId !== '') setFinish(decoded.finishId);
    if (decoded.roomWidthMeters !== undefined) {
      setRoomWidth(decoded.roomWidthMeters);
    }
  }, []);

  // Continuous: store → URL via `router.replace` (no scroll jump). Only kicks
  // in once the buyer has actually made a choice, so the URL stays clean on
  // first arrival and `router.replace` is idempotent on no-op (no re-renders).
  useEffect(() => {
    if (storeFinishId === '' && roomWidth === null) return;
    const encoded = encodeConfiguration({
      finishId: storeFinishId !== '' ? storeFinishId : product.defaultFinishId,
      ...(roomWidth !== null ? { roomWidthMeters: roomWidth } : {}),
    });
    router.replace(`${pathname}?${encoded}`, { scroll: false });
  }, [storeFinishId, roomWidth, router, pathname, product.defaultFinishId]);

  // Only finishes available for THIS product, resolved by id.
  const availableFinishes = finishes.filter((f) =>
    product.availableFinishIds.includes(f.id),
  );

  // Empty store finish → fall back to the product's default.
  const effectiveFinishId =
    storeFinishId !== '' ? storeFinishId : product.defaultFinishId;
  const selectedFinish =
    findFinishById(effectiveFinishId) ?? availableFinishes[0] ?? null;

  // Push the selected finish colour into the render layer's material bridge.
  // Finish object identity is stable for the same id, so this effect only
  // re-fires when the buyer actually changes the selection.
  useEffect(() => {
    if (selectedFinish !== null) {
      materialBridge.setFinishHex(selectedFinish.sRGBHex);
    }
  }, [selectedFinish]);

  // Fit verdict only when the buyer has entered a room width.
  const fitResult =
    roomWidth === null
      ? null
      : checkFit(roomWidth, product.dimensionsMeters.width);

  // Compose the Decision Artifact → pre-filled WhatsApp message → deep link.
  const artifact: DecisionArtifact | null =
    selectedFinish !== null
      ? { product, finish: selectedFinish, fit: fitResult }
      : null;
  const message = artifact !== null ? composeWhatsAppMessage(artifact) : '';
  const handoffUrl = buildWhatsAppUrl(message);

  return (
    <>
      <ProductHero product={product} />

      <Section label="Details">
        <Container width="text">
          <Stack gap="s7">
            <Text variant="bodyL" tone="inkSoft">
              {product.description}
            </Text>

            <Text variant="title" numeric>
              {formatPrice(product.price.amount, product.price.currency)}
            </Text>

            <Divider />

            <Dimensions dimensionsMeters={product.dimensionsMeters} />

            <Divider />

            <FinishSelector
              finishes={availableFinishes}
              selectedId={
                selectedFinish !== null ? selectedFinish.id : effectiveFinishId
              }
              onSelect={setFinish}
            />

            <Divider />

            <FitChecker
              productWidthMeters={product.dimensionsMeters.width}
              value={roomWidth}
              result={fitResult}
              onChange={setRoomWidth}
            />
          </Stack>
        </Container>
      </Section>

      <ProductAssurance />

      {/* Spacer so content scrolls clear of the fixed action bar. */}
      <div className={styles.actionBarSpacer} aria-hidden="true" />

      <ProductActionBar handoffUrl={handoffUrl} label="Order on WhatsApp" />
    </>
  );
}
