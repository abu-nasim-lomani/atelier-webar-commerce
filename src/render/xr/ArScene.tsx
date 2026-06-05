/**
 * ArScene (Phase F3.1 + F3.2) — the immersive-ar scene graph.
 *
 * F3.1 entered the session and let the true-scale sofa FOLLOW the floor.
 * F3.2 adds the IKEA-style commit: aim → the reticle + ghosted sofa preview
 * track the floor; tap (the session 'select') drops the sofa at that spot,
 * where it stays anchored in world space while you walk around it. A grounding
 * contact shadow sells the placement; "Move" re-enters aiming, "Done" exits.
 *
 * The +180ms shadow bloom / 96→100% settle choreography and gestures (1-finger
 * move, 2-finger rotate, NO scale) and capture are F3.3 / F3.4.
 *
 * The product stage owns the canonical sofa Group (one Object3D, one graph), so
 * this mounts an independent CLONE with isolated materials. WebXR is 1 unit =
 * 1 metre, so the fitted 2.05 m sofa is honest scale (the locked promise).
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
// The raw hit, distance-clamped so a true-scale (2 m) sofa is never dropped on
// top of the viewer — at < ~1.5 m it overflows a phone screen and reads as
// "huge". Scale stays honest; we only push the spot out along the same aim.
const FRAMED_POSITION = new THREE.Vector3();
const PLACED_POSITION = new THREE.Vector3();
const CAM_POSITION = new THREE.Vector3();
const FLAT_OFFSET = new THREE.Vector3();
const MIN_DISTANCE = 1.5;
const FOLLOW_LERP = 0.35;

let hasHit = false;
let placed = false;
let dragging = false;
let appliedFinish = '';
let armedSession: XRSession | null = null;

// Handheld AR: a screen press fires 'selectstart', release 'selectend'. Holding
// lets the sofa follow your aim (touch-to-move); releasing drops it where it
// rests. A quick tap is just a fast press→release, i.e. an instant place.
function onSelectStart(): void {
  dragging = true;
}
function onSelectEnd(): void {
  dragging = false;
  if (hasHit) {
    PLACED_POSITION.copy(FRAMED_POSITION);
    placed = true;
  }
}

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

  useFrame((state, _delta, frame) => {
    // Arm the tap-to-place listener once per session; reset on a fresh session.
    const session = frame?.session;
    if (session !== undefined && session !== armedSession) {
      armedSession = session;
      placed = false;
      dragging = false;
      session.addEventListener('selectstart', onSelectStart);
      session.addEventListener('selectend', onSelectEnd);
    }

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

    // Distance-clamp the hit so the true-scale sofa is always framable: if the
    // aimed floor point is nearer than MIN_DISTANCE, push it out along the same
    // horizontal direction (keeping the floor height). Scale is untouched.
    if (hasHit) {
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

    // Holding → follow the aim (touch-to-move); else hold the committed spot;
    // else (not placed yet) preview-follow the floor. When dragging without a
    // fresh hit, keep the last spot rather than flicker out.
    if (anchor !== undefined) {
      if (dragging) {
        anchor.visible = true;
        if (hasHit) anchor.position.lerp(FRAMED_POSITION, FOLLOW_LERP);
      } else if (placed) {
        anchor.visible = true;
        anchor.position.copy(PLACED_POSITION);
      } else if (hasHit) {
        anchor.visible = true;
        anchor.position.lerp(FRAMED_POSITION, FOLLOW_LERP);
      } else {
        anchor.visible = false;
      }
    }

    // The reticle guides while aiming or moving (hidden once at rest).
    if (reticle !== undefined) {
      reticle.visible = hasHit && (dragging || !placed);
      if (hasHit) reticle.position.copy(FRAMED_POSITION);
    }
  });

  return (
    <>
      <Lighting />

      <group name="ar-anchor" visible={false}>
        {/* Grounding shadow — stronger here so it reads over the live camera
            feed (a weak shadow is the #1 reason AR objects look like they
            float). Moves with the sofa, sells the placement. */}
        <ContactShadow opacity={0.78} />
      </group>

      {/* A soft ground ring that tracks the detected surface while aiming. */}
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
