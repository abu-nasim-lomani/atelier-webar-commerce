/**
 * RoomSofa — the hero sofa, shown in the Room Preview fallback (Phase F2).
 *
 * The product stage owns the canonical sofa Group (parented under
 * `product-anchor`), and an Object3D can live in only ONE scene graph at a
 * time. So the preview mounts an independent CLONE: shared geometry (cheap),
 * but cloned materials so tinting the preview never bleeds into the hero. The
 * chosen finish is applied directly from a plain hex string (the app passes it
 * in) — no coupling to the hero's materialBridge / renderController.
 *
 * Motion is the locked gentle breathing (±6°, ~9s), never a turntable spin
 * (locked: "behaves like 80kg furniture, not a showroom spin"). Reduced-motion
 * holds it still.
 *
 * No `react` import; R3F `useFrame` + `three` via helpers only.
 */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HERO_SOFA } from '@config/hero-asset';
import { hexToLinear } from '@/tokens';
import { fitToFootprint } from '../core/fitModel';
import { isolateSofaMaterials } from '../core/isolateSofaMaterials';
import { ensureSofaLoading, getSofaScene } from './sofaAsset';

const BREATHE_PERIOD_S = 9;
const BREATHE_AMPLITUDE_RAD = (6 * Math.PI) / 180;
// Front-facing yaw — matches the hero (see Sofa.tsx). Field-confirmed 0.
const SOFA_YAW = 0;

interface RoomSofaProps {
  /** sRGB hex to tint the sofa, or `null` for the natural (untinted) look. */
  readonly finishHex: string | null;
  /** Hold the breathing still when the user prefers reduced motion. */
  readonly reducedMotion: boolean;
  /**
   * Fixed yaw (radians) for photo mode — the user rotates the sofa to match
   * their room photo. `null` = preset-room mode (gentle breathing instead).
   */
  readonly yaw: number | null;
}

function linearFromHex(hex: string): THREE.Color {
  const lin = hexToLinear(hex);
  return new THREE.Color().setRGB(
    lin.r,
    lin.g,
    lin.b,
    THREE.LinearSRGBColorSpace,
  );
}

export function RoomSofa({ finishHex, reducedMotion, yaw }: RoomSofaProps) {
  ensureSofaLoading();

  useFrame((state) => {
    const anchor = state.scene.getObjectByName('room-anchor');
    if (anchor === undefined) return;

    // Mount the clone once, as soon as the shared GLB is ready.
    if (anchor.getObjectByName('room-sofa') === undefined) {
      const source = getSofaScene();
      if (source !== null) {
        const clone = source.clone(true);
        clone.name = 'room-sofa';
        clone.rotation.y = SOFA_YAW;
        // Own materials + textures so this second renderer uploads them.
        isolateSofaMaterials(clone);

        // `null` finish = natural: leave the texture untinted (white).
        const color = finishHex !== null ? linearFromHex(finishHex) : null;
        if (color !== null) {
          clone.traverse((obj) => {
            if (!(obj instanceof THREE.Mesh)) return;
            const material: unknown = obj.material;
            if (material instanceof THREE.MeshStandardMaterial) {
              material.color.copy(color);
            }
          });
        }

        fitToFootprint(clone, HERO_SOFA.dimensionsMeters.width);
        anchor.add(clone);
      }
    }

    if (yaw !== null) {
      // Photo mode: hold the user's chosen rotation (no breathing).
      anchor.rotation.y = yaw;
    } else {
      // Preset-room mode: gentle breathing (no spin, no parallax).
      anchor.rotation.y = reducedMotion
        ? 0
        : Math.sin((state.clock.elapsedTime * 2 * Math.PI) / BREATHE_PERIOD_S) *
          BREATHE_AMPLITUDE_RAD;
    }
  });

  return <group name="room-anchor" />;
}
