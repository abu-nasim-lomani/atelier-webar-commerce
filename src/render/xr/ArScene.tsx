/**
 * ArScene (Phase F3.1) — the immersive-ar scene graph.
 *
 * Foundation step: enter the session, continuously hit-test the floor from the
 * viewer, and let the true-scale sofa preview FOLLOW the detected surface (a
 * lerped follow, smoothing the noisy raw hit). A calm `<XRDomOverlay>` carries
 * the only chrome — a "Done" exit. Tap-to-commit placement, the +180ms shadow
 * bloom, gestures, and capture are F3.2–F3.4.
 *
 * The product stage owns the canonical sofa Group (one Object3D, one graph), so
 * this mounts an independent CLONE with isolated materials — same pattern as the
 * Room Preview. WebXR is 1 unit = 1 metre, so the fitted 2.05 m sofa is true
 * scale in the room (the locked honest-AR promise; no resize).
 *
 * No `react` import; @react-three/fiber + @react-three/xr + three only. State is
 * module-level (no useState/useRef), like the other render drivers.
 */
import { useFrame } from '@react-three/fiber';
import { useXRHitTest, XRDomOverlay } from '@react-three/xr';
import * as THREE from 'three';
import { HERO_SOFA } from '@config/hero-asset';
import { hexToLinear, color, ar } from '@/tokens';
import { linearColor } from '../core/colorBridge';
import { fitToFootprint } from '../core/fitModel';
import { ensureSofaLoading, getSofaScene } from '../scene/sofaAsset';
import { Lighting } from '../scene/Lighting';
import { exitAr } from './xrStore';

const HIT_MATRIX = new THREE.Matrix4();
const HIT_POSITION = new THREE.Vector3();
const FOLLOW_LERP = 0.35;
let hasHit = false;
let appliedFinish = '';

interface ArSceneProps {
  readonly finishHex: string;
}

export function ArScene({ finishHex }: ArSceneProps) {
  ensureSofaLoading();

  // Continuous floor hit-test cast from the viewer (screen centre).
  useXRHitTest((results, getWorldMatrix) => {
    const first = results[0];
    if (first === undefined) {
      hasHit = false;
      return;
    }
    getWorldMatrix(HIT_MATRIX, first);
    HIT_POSITION.setFromMatrixPosition(HIT_MATRIX);
    hasHit = true;
  }, 'viewer');

  useFrame((state) => {
    const anchor = state.scene.getObjectByName('ar-anchor');
    const reticle = state.scene.getObjectByName('ar-reticle');

    // Mount the cloned sofa once the shared GLB is ready.
    if (anchor !== undefined && anchor.getObjectByName('ar-sofa') === undefined) {
      const source = getSofaScene();
      if (source !== null) {
        const clone = source.clone(true);
        clone.name = 'ar-sofa';
        fitToFootprint(clone, HERO_SOFA.dimensionsMeters.width);
        anchor.add(clone);
        appliedFinish = '';
      }
    }

    // Apply the chosen finish to the isolated clone materials, once per change.
    if (anchor !== undefined && finishHex !== appliedFinish) {
      const sofa = anchor.getObjectByName('ar-sofa');
      if (sofa !== undefined) {
        const lin = hexToLinear(finishHex);
        const tint = new THREE.Color().setRGB(
          lin.r,
          lin.g,
          lin.b,
          THREE.LinearSRGBColorSpace,
        );
        sofa.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          const material: unknown = obj.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            const isolated = material.clone();
            isolated.color.copy(tint);
            obj.material = isolated;
          }
        });
        appliedFinish = finishHex;
      }
    }

    // Follow the floor (lerped) until a later phase commits the placement.
    if (anchor !== undefined) {
      anchor.visible = hasHit;
      if (hasHit) anchor.position.lerp(HIT_POSITION, FOLLOW_LERP);
    }
    if (reticle !== undefined) {
      reticle.visible = hasHit;
      if (hasHit) reticle.position.copy(HIT_POSITION);
    }
  });

  return (
    <>
      <Lighting />

      <group name="ar-anchor" visible={false} />

      {/* A soft ground ring that tracks the detected surface. */}
      <mesh name="ar-reticle" visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.11, 0.15, 48]} />
        <meshBasicMaterial
          color={linearColor(color.accent)}
          transparent
          opacity={0.85}
          toneMapped={false}
        />
      </mesh>

      <XRDomOverlay>
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            insetBlockEnd: '28px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <button
            type="button"
            onClick={() => {
              exitAr();
            }}
            style={{
              minHeight: '48px',
              padding: '0 28px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: ar.surface,
              color: color.ink,
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Done
          </button>
        </div>
      </XRDomOverlay>
    </>
  );
}
