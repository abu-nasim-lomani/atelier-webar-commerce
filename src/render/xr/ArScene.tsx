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
import { fitToFootprint } from '../core/fitModel';
import { isolateSofaMaterials } from '../core/isolateSofaMaterials';
import { ensureSofaLoading, getSofaScene } from '../scene/sofaAsset';
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
// Camera-relative floor axes, refreshed each frame so the nudge buttons move
// the sofa "forward/back/left/right" from the VIEWER's point of view.
const CAM_FORWARD = new THREE.Vector3();
const CAM_RIGHT = new THREE.Vector3();
const MIN_DISTANCE = 1.5;
const RETICLE_LERP = 0.2; // lower = smoother floor tracking
const RETICLE_COLOR = new THREE.Color(1, 1, 1); // white placement ring
const ROTATE_STEP = Math.PI / 12; // 15° per tap
const NUDGE_STEP = 0.1; // 10 cm per tap

// Shared style for the round icon controls (nudge / rotate).
const ICON_BTN = {
  width: '46px',
  height: '46px',
  borderRadius: '999px',
  border: 'none',
  backgroundColor: ar.surface,
  color: color.ink,
  fontSize: '20px',
};

let hasHit = false;
let placed = false;
let appliedFinish: string | null = '';
let armedSession: XRSession | null = null;
let hintEl: HTMLElement | null = null;
let spinnerEl: HTMLElement | null = null;
let adjustEl: HTMLElement | null = null;
let placeEl: HTMLElement | null = null;
let placedYaw = 0;

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
  /** Fit verdict from the buyer's entered room size; shown once placed. */
  readonly fitLabel: string | null;
  /** Brand line baked into the view so device screenshots carry it. */
  readonly watermark: string;
}

export function ArScene({ finishHex, fitLabel, watermark }: ArSceneProps) {
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
      placedYaw = 0;
      session.addEventListener('select', onSelect);
    }

    // Refresh camera-relative floor axes for the nudge buttons.
    state.camera.getWorldDirection(CAM_FORWARD);
    CAM_FORWARD.y = 0;
    if (CAM_FORWARD.lengthSq() > 1e-6) CAM_FORWARD.normalize();
    // Viewer's right = forward × up (on the floor plane).
    CAM_RIGHT.set(-CAM_FORWARD.z, 0, CAM_FORWARD.x);

    const anchor = state.scene.getObjectByName('ar-anchor');
    const reticle = state.scene.getObjectByName('ar-reticle');

    // Mount the cloned sofa once the shared GLB is ready (kept hidden until
    // placed). It stays parked under the invisible anchor.
    if (anchor !== undefined && anchor.getObjectByName('ar-sofa') === undefined) {
      const source = getSofaScene();
      if (source !== null) {
        const clone = source.clone(true);
        clone.name = 'ar-sofa';
        // Own materials + textures so this second renderer uploads them.
        isolateSofaMaterials(clone);
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
        // Materials are already isolated at mount — just recolour them.
        sofa.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return;
          const material: unknown = obj.material;
          if (material instanceof THREE.MeshStandardMaterial) {
            material.color.copy(tint);
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
      if (placed) {
        anchor.position.copy(PLACED_POSITION);
        anchor.rotation.y = placedYaw;
      }
    }

    // The circle guides only while aiming (hidden once the sofa is down).
    if (reticle !== undefined) {
      reticle.visible = hasHit && !placed;
      if (hasHit && !placed) reticle.position.lerp(FRAMED_POSITION, RETICLE_LERP);
    }

    // Scanning / aiming hint — reassures the user while ARCore finds the floor
    // (the sofa can't appear until a surface is detected, which takes a moment)
    // and then guides the tap. Driven imperatively (render layer = no React).
    if (hintEl === null) hintEl = document.getElementById('ar-scan-hint');
    if (hintEl !== null) {
      if (placed) {
        // Once down, show the buyer's measured fit verdict (if they entered a
        // room size) — connecting the page's Fit Checker to the AR view.
        if (fitLabel !== null) {
          hintEl.style.opacity = '1';
          hintEl.textContent = fitLabel;
        } else {
          hintEl.style.opacity = '0';
        }
      } else {
        hintEl.style.opacity = '1';
        hintEl.textContent = hasHit
          ? 'Tap to place it'
          : 'Point at the floor — move your phone slowly';
      }
    }

    // Centre loading spinner — visible while still scanning (no floor circle
    // yet), hidden the moment the reticle appears or the sofa is placed.
    if (spinnerEl === null) spinnerEl = document.getElementById('ar-spinner');
    if (spinnerEl !== null) {
      spinnerEl.style.display = !hasHit && !placed ? 'block' : 'none';
    }

    // Swap control groups: "Place here" while aiming, adjust/rotate once placed.
    if (adjustEl === null) adjustEl = document.getElementById('ar-adjust');
    if (adjustEl !== null) adjustEl.style.display = placed ? 'flex' : 'none';
    if (placeEl === null) placeEl = document.getElementById('ar-place');
    if (placeEl !== null) placeEl.style.display = placed ? 'none' : 'flex';
  });

  return (
    <>
      <Lighting />

      <group name="ar-anchor" visible={false} />

      {/* White placement ring (IKEA-style) — shows where the sofa will sit while
          aiming, hidden once placed. No fake contact shadow (it read unreal). */}
      <mesh name="ar-reticle" visible={false} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.44, 0.5, 72]} />
        <meshBasicMaterial
          color={RETICLE_COLOR}
          transparent
          opacity={0.95}
          toneMapped={false}
        />
      </mesh>

      <XRDomOverlay>
        {/* Brand watermark — baked into the view so a device screenshot of the
            sofa in the room carries the company + product + true-scale line. */}
        <div
          style={{
            position: 'absolute',
            insetBlockStart: 'calc(20px + env(safe-area-inset-top, 0px))',
            insetInlineStart: '20px',
            padding: '7px 12px',
            borderRadius: '999px',
            backgroundColor: ar.surface,
            color: color.ink,
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.04em',
          }}
        >
          {watermark}
        </div>

        {/* Centre loading spinner while ARCore is still finding the floor. */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <div id="ar-spinner" className="ar-scan-spinner" />
        </div>

        {/* Scanning / aiming hint — shows immediately so the camera view never
            looks frozen while ARCore locates the floor. Toggled in useFrame. */}
        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            insetBlockStart: '28px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            id="ar-scan-hint"
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              backgroundColor: ar.surface,
              color: color.ink,
              fontSize: '14px',
              fontWeight: 500,
              transition: 'opacity 200ms ease',
            }}
          >
            Point at the floor — move your phone slowly
          </span>
        </div>

        <div
          style={{
            position: 'absolute',
            insetInline: 0,
            insetBlockEnd: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          {/* Place row (aiming) — explicit "set on the floor"; a screen tap
              also places. Hidden once placed. */}
          <div id="ar-place" style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              type="button"
              onClick={() => {
                onSelect();
              }}
              style={{
                minHeight: '52px',
                padding: '0 32px',
                borderRadius: '999px',
                border: 'none',
                backgroundColor: color.accent,
                color: color.canvasRaised,
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Place on the floor
            </button>
          </div>

          {/* Adjust row (shown once placed) — nudge the sofa + rotate it. */}
          <div
            id="ar-adjust"
            style={{
              display: 'none',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: '8px',
            }}
          >
            <button
              type="button"
              aria-label="Move left"
              onClick={() => {
                PLACED_POSITION.addScaledVector(CAM_RIGHT, -NUDGE_STEP);
              }}
              style={ICON_BTN}
            >
              ←
            </button>
            <button
              type="button"
              aria-label="Move forward"
              onClick={() => {
                PLACED_POSITION.addScaledVector(CAM_FORWARD, NUDGE_STEP);
              }}
              style={ICON_BTN}
            >
              ↑
            </button>
            <button
              type="button"
              aria-label="Move back"
              onClick={() => {
                PLACED_POSITION.addScaledVector(CAM_FORWARD, -NUDGE_STEP);
              }}
              style={ICON_BTN}
            >
              ↓
            </button>
            <button
              type="button"
              aria-label="Move right"
              onClick={() => {
                PLACED_POSITION.addScaledVector(CAM_RIGHT, NUDGE_STEP);
              }}
              style={ICON_BTN}
            >
              →
            </button>
            <button
              type="button"
              aria-label="Rotate left"
              onClick={() => {
                placedYaw += ROTATE_STEP;
              }}
              style={ICON_BTN}
            >
              ↺
            </button>
            <button
              type="button"
              aria-label="Rotate right"
              onClick={() => {
                placedYaw -= ROTATE_STEP;
              }}
              style={ICON_BTN}
            >
              ↻
            </button>
            <button
              type="button"
              onClick={() => {
                placed = false;
              }}
              style={{
                minHeight: '46px',
                padding: '0 20px',
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
          </div>

          {/* Done row (always). */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
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
        </div>
      </XRDomOverlay>
    </>
  );
}
