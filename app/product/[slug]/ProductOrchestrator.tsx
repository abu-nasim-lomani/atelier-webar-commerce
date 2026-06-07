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
import { useEffect, useState, type ReactElement } from 'react';
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
import {
  materialBridge,
  enterAr,
  ensureSofaLoading,
  isSofaLoaded,
  renderController,
} from '@/render';
import { resolveArLaunch } from '@/ar';
import { isImmersiveArSupported } from '@/capability';
import { SITE } from '@config/site';
import { CanvasMount } from '@/app/CanvasMount';
import { RoomPreviewMount } from '@/app/RoomPreviewMount';
import { ArMount } from '@/app/ArMount';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import {
  ProductHero,
  Dimensions,
  FitChecker,
  ProductActionBar,
  ProductAssurance,
  RoomPreview,
  ProductRecap,
  composeDecisionCard,
} from '@/ui/modules/product';
import { Section, Container, Stack, Text, Divider } from '@/ui/primitives';
import styles from './ProductOrchestrator.module.css';

interface ProductOrchestratorProps {
  readonly product: ProductEntry;
}

function formatPrice(amount: number, currency: 'BDT'): string {
  return `${amount.toLocaleString('en-IN')} ${currency}`;
}

function fitWord(verdict: 'fits' | 'tight' | 'tooLarge'): string {
  switch (verdict) {
    case 'fits':
      return 'fits comfortably';
    case 'tight':
      return 'a tight fit';
    case 'tooLarge':
      return 'too large';
  }
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

  // Finish-colour selection is removed for now: the sofa renders with its
  // ORIGINAL material, untinted — exactly like model-viewer, which proved the
  // asset is fine. `null` = natural / no tint, threaded to every render path.
  const activeFinishHex: string | null = null;

  // Reset the sofa to its natural (untinted) material once.
  useEffect(() => {
    materialBridge.setNatural();
  }, []);

  // Capability-driven AR launch (Phase F1). Resolved client-side after mount
  // so SSR and the client agree on the initial render (button hidden) — the
  // effect then surfaces the button on Android (Scene Viewer) or iOS+USDZ
  // (Quick Look). USDZ is deferred to F4, so iOS currently falls through to
  // unsupported and the button stays hidden honestly.
  // Best AR path wins: WebXR custom session > native launcher > Room Preview.
  const [webxrReady, setWebxrReady] = useState(false);
  // Don't open the camera until the 3D model is loaded — show a calm wait.
  const [sofaReady, setSofaReady] = useState(false);
  const [arHref, setArHref] = useState<string | undefined>(undefined);
  const [arRel, setArRel] = useState<string | undefined>(undefined);
  const [arUnsupported, setArUnsupported] = useState(false);
  const [roomPreviewOpen, setRoomPreviewOpen] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    let cancelled = false;
    const resolve = async (): Promise<void> => {
      let webxr = false;
      try {
        webxr = await isImmersiveArSupported();
      } catch {
        webxr = false;
      }
      if (cancelled) return;
      if (webxr) {
        setWebxrReady(true);
        return;
      }
      // No WebXR → native launcher (F1), else in-app Room Preview (F2).
      const launch = resolveArLaunch({
        glbUrl: '/models/hero-sofa.glb',
        siteUrl: SITE.url,
        productSlug: product.slug,
        productTitle: product.name,
      });
      if (launch.href !== undefined) {
        setArHref(launch.href);
        setArRel(launch.rel);
      } else {
        setArUnsupported(true);
      }
    };
    void resolve();
    return () => {
      cancelled = true;
    };
  }, [product.slug, product.name]);

  // Once WebXR is the path, start loading the hero GLB and gate "enter AR" on
  // it — so tapping never opens the camera onto an empty/late-loading scene.
  useEffect(() => {
    if (!webxrReady) return;
    ensureSofaLoading();
    if (isSofaLoaded()) {
      setSofaReady(true);
      return;
    }
    const id = setInterval(() => {
      if (isSofaLoaded()) {
        setSofaReady(true);
        clearInterval(id);
      }
    }, 250);
    return () => {
      clearInterval(id);
    };
  }, [webxrReady]);

  // Fit verdict only when the buyer has entered a room width.
  const fitResult =
    roomWidth === null
      ? null
      : checkFit(roomWidth, product.dimensionsMeters.width);

  // Same verdict, phrased for the AR overlay (shown once the sofa is placed).
  let arFitLabel: string | null = null;
  if (fitResult !== null) {
    if (fitResult.verdict === 'tooLarge') {
      arFitLabel = 'Larger than the space you entered';
    } else {
      const word = fitResult.verdict === 'fits' ? 'Fits' : 'Tight fit';
      arFitLabel = `${word} — ${fitResult.clearanceMeters.toFixed(2)} m to spare`;
    }
  }

  // Brand line shown in the AR view so device screenshots carry it.
  const arWatermark = `${SITE.name} · ${product.name} · true to scale`;

  // Compose the Decision Artifact → pre-filled WhatsApp message → deep link.
  const artifact: DecisionArtifact | null =
    selectedFinish !== null
      ? { product, finish: selectedFinish, fit: fitResult }
      : null;
  const message = artifact !== null ? composeWhatsAppMessage(artifact) : '';
  const handoffUrl = buildWhatsAppUrl(message);

  // Decision Artifact: snapshot the configured sofa → compose the brand card →
  // Web Share ("send to family"), with a download + WhatsApp fallback where
  // Web Share with files isn't available (most desktops).
  const [sharing, setSharing] = useState(false);
  const handleShare = async (): Promise<void> => {
    if (sharing) return;
    setSharing(true);
    try {
      renderController.requestFrame();
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => {
          resolve();
        });
      });

      const d = product.dimensionsMeters;
      const fitLabel =
        fitResult === null
          ? null
          : `In your space: ${fitWord(fitResult.verdict)} (${fitResult.clearanceMeters.toFixed(
              2,
            )} m clearance)`;

      const blob = await composeDecisionCard({
        snapshotDataUrl: renderController.captureDataUrl(),
        brand: SITE.name,
        productName: product.name,
        tagline: product.tagline,
        dimensionsLabel: `${d.width.toFixed(2)} × ${d.depth.toFixed(2)} × ${d.height.toFixed(
          2,
        )} m`,
        priceLabel: formatPrice(product.price.amount, product.price.currency),
        fitLabel,
      });

      const file =
        blob !== null
          ? new File([blob], 'atelier-sofa.png', { type: 'image/png' })
          : null;
      const shareData =
        file !== null
          ? { files: [file], text: message, title: product.name }
          : null;

      if (
        shareData !== null &&
        typeof navigator.canShare === 'function' &&
        navigator.canShare(shareData)
      ) {
        await navigator.share(shareData);
      } else {
        if (blob !== null) {
          const url = URL.createObjectURL(blob);
          const anchor = document.createElement('a');
          anchor.href = url;
          anchor.download = 'atelier-sofa.png';
          anchor.click();
          URL.revokeObjectURL(url);
        }
        window.open(handoffUrl, '_blank', 'noopener');
      }
    } catch {
      // Share dismissed or unavailable — stay calm, no error surface.
    } finally {
      setSharing(false);
    }
  };

  return (
    <>
      <ProductHero product={product} stage={<CanvasMount />} />

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

      <ProductRecap
        onShare={() => {
          void handleShare();
        }}
        sharing={sharing}
      />

      {/* Spacer so content scrolls clear of the fixed action bar. */}
      <div className={styles.actionBarSpacer} aria-hidden="true" />

      <ProductActionBar
        handoffUrl={handoffUrl}
        label="Order on WhatsApp"
        onEnterAr={
          webxrReady && sofaReady
            ? () => {
                enterAr();
              }
            : undefined
        }
        arPreparing={webxrReady && !sofaReady}
        arHref={arHref}
        arRel={arRel}
        onRoomPreview={
          arUnsupported
            ? () => {
                setRoomPreviewOpen(true);
              }
            : undefined
        }
      />

      {/* WebXR host: mounted (hidden) once supported so enterAr() fires in the
          tap gesture and binds the session to this renderer. */}
      {webxrReady && selectedFinish !== null ? (
        <ArMount
          finishHex={activeFinishHex}
          fitLabel={arFitLabel}
          watermark={arWatermark}
          onShare={() => {
            void handleShare();
          }}
        />
      ) : null}

      <RoomPreview
        open={roomPreviewOpen}
        onClose={() => {
          setRoomPreviewOpen(false);
        }}
        productName={product.name}
        finishLabel={selectedFinish !== null ? selectedFinish.label : undefined}
        handoffUrl={handoffUrl}
        handoffLabel="Order on WhatsApp"
        renderStage={(yaw) => (
          <RoomPreviewMount
            finishHex={activeFinishHex}
            reducedMotion={reducedMotion}
            yaw={yaw}
          />
        )}
      />
    </>
  );
}
