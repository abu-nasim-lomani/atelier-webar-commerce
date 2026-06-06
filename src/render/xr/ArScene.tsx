/**
 * ArScene (Phase F3) — the immersive-ar scene graph.
 *
 * Flow (IKEA-style, the shape the user asked for):
 *   1. While aiming, ONLY a ground circle is shown at the floor point where the
 *      sofa will land (the sofa itself stays hidden — so it never looms/“too
 *      big” while you move the phone).
 *   2. A screen tap (session 'select') drops the true-scale sofa at the circle,
 *      instantly. It stays anchored in world space; walk around it.
 *   3. "Move" re-arms the circle to reposition; "Done" exits.
 *
 * The aim point is distance-clamped (MIN_DISTANCE) so a 2 m sofa is never
 * dropped on top of the viewer (honest scale kept; only the spot is pushed out).
 *
 * The product stage owns the canonical sofa Group (one Object3D, one graph), so
 * this mounts an independent CLONE with isolated materials. WebXR is 1 unit =
 * 1 metre, so the fitted 2.05 m sofa is honest scale.
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
import { ContactShadow } from '../scene/ContactShadow';
import { Lighting } from '../scene/Lighting';
import { exitAr } from './xrStore';

const HIT_MATRIX = new THREE.Matrix4();
const HIT_POSITION = new THREE.Vector3();
// The aimed hit, distance-clamped so a true-scale (2 m) sofa is never dropped on
// top of the viewer (< ~1.5 m overflows a phone screen and reads as "huge").
// Honest scale is untouched — only the spot is pushed out along the same aim.
const FRAMED_POSITION = new THREE.Vector3();
const PLACED_POSITION = new THREE.Vector3();
const CAM_POSITION = new THREE.Vector3();
const FLAT_OFFSET = new THREE.Vector3();
const MIN_DISTANCE = 1.5;
const RETICLE_LERP = 0.4;

let hasHit = false;
let placed = false;
let appliedFinish: string | null = '';
let armedSession: XRSession | null = null;

// Screen tap (handheld AR 'select') drops the sofa at the circle, instantly.
function onSelect(): void {
  if (hasHit && !placed) {
    PLACED_POSITION.copy(FRAMED_POSITION);
    placed = true;
  }
}

interface ArSceneProps {
  /** sRGB hex to tint the sofa, or `null` for the natural (untinted) look. */
  readonly finishHex: string | null;
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

  useFrame((state, _delta, frame) => {
    // Arm the tap-to-place listener once per session; reset on a fresh session.
    const session = frame?.session;
    if (session !== undefined && session !== armedSession) {
      armedSession = session;
      placed = false;
      session.addEventListener('select', onSelect);
    }

    const anchor = state.scene.getObjectByName('ar-anchor');
    const reticle = state.scene.getObjectByName('ar-reticle');

    // Mount the cloned sofa once the shared GLB is ready (kept hidden until
    // placed). It stays parked under the invisible anchor.
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
        const tint = new THREE.Color();
        if (finishHex === null) {
          // Natural: white multiplier → the baseColour texture shows as-is.
          tint.setRGB(1, 1, 1, THREE.LinearSRGBColorSpace);
        } else {
          const lin = hexToLinear(finishHex);
          tint.setRGB(lin.r, lin.g, lin.b, THREE.LinearSRGBColorSpace);
        }
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

    // Distance-clamp the aimed hit (only relevant while still aiming).
    if (hasHit && !placed) {
      state.camera.getWorldPosition(CAM_POSITION);
      FRAMED_POSITION.copy(HIT_POSITION);
      FLAT_OFFSET.set(
        HIT_POSITION.x - CAM_POSITION.x,
        0,
        HIT_POSITION.z - CAM_POSITION.z,
      );
      const dist = FLAT_OFFSET.length();
      if (dist > 0.001 && dist < MIN_DISTANCE) {
        FLAT_OFFSET.multiplyScalar(MIN_DISTANCE / dist);
        FRAMED_POSITION.x = CAM_POSITION.x + FLAT_OFFSET.x;
        FRAMED_POSITION.z = CAM_POSITION.z + FLAT_OFFSET.z;
      }
    }

    // Sofa is hidden until committed, then held at the placed spot.
    if (anchor !== undefined) {
      anchor.visible = placed;
      if (placed) anchor.position.copy(PLACED_POSITION);
    }

    // The circle guides only while aiming (hidden once the sofa is down).
    if (reticle !== undefined) {
      reticle.visible = hasHit && !placed;
      if (hasHit && !placed) reticle.position.lerp(FRAMED_POSITION, RETICLE_LERP);
    }
  });

  return (
    <>
      <Lighting />

      <group name="ar-anchor" visible={false}>
        {/* Grounding shadow — strong enough to read over the live camera feed
            (a faint shadow is the #1 reason AR objects look like they float). */}
        <ContactShadow opacity={0.78} />
      </group>

      {/* The placement circle — shows exactly where the sofa will land. */}
      <mesh name="ar-reticle" visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.42, 0.5, 64]} />
        <meshBasicMaterial
          color={linearColor(color.accent)}
          transparent
          opacity={0.9}
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
            gap: '12px',
          }}
        >
          <button
            type="button"
            onClick={() => {
              placed = false;
            }}
            style={{
              minHeight: '48px',
              padding: '0 24px',
              borderRadius: '999px',
              border: 'none',
              backgroundColor: ar.surface,
              color: color.ink,
              fontSize: '15px',
              fontWeight: 500,
            }}
          >
            Move
          </button>
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
              backgroundColor: color.accent,
              color: color.canvasRaised,
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
