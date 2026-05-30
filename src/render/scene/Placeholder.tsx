/**
 * Placeholder — a TRUE-SCALE procedural stand-in for the hero sofa.
 *
 * NOT a product render: a calm, single-tone block massing at the exact
 * manifest dimensions (config/hero-asset.ts), floor-centred (y = 0 at the
 * floor, origin at footprint centre) — so it reads honestly as "a sofa-sized
 * object, here, at real scale" until the real GLB drops into this same anchor.
 *
 * No `react` import; R3F intrinsics + token-derived linear colour only.
 */
import { HERO_SOFA } from '@config/hero-asset';
import { palette } from '@/tokens';
import { linearColor } from '../core/colorBridge';

const { width: W, depth: D, height: H } = HERO_SOFA.dimensionsMeters;

const BASE_H = 0.36;
const ARM_W = 0.2;
const ARM_H = 0.58;
const BACK_T = 0.14;
const SEAT_H = 0.16;

const backH = H - BASE_H;
const seatW = W - ARM_W * 2;
const seatD = D - BACK_T;
const armX = W / 2 - ARM_W / 2;

export function Placeholder() {
  // Default = Oak Natural (palette.clay) — matches the catalog's default
  // finish, so the initial paint on the product page doesn't flash before
  // FinishDriver applies the buyer's selection.
  const tone = linearColor(palette.clay);

  return (
    <group name="procedural-placeholder">
      {/* plinth */}
      <mesh position={[0, BASE_H / 2, 0]}>
        <boxGeometry args={[W, BASE_H, D]} />
        <meshStandardMaterial color={tone} roughness={0.85} metalness={0} />
      </mesh>

      {/* seat */}
      <mesh position={[0, BASE_H + SEAT_H / 2, BACK_T / 2]}>
        <boxGeometry args={[seatW, SEAT_H, seatD]} />
        <meshStandardMaterial color={tone} roughness={0.85} metalness={0} />
      </mesh>

      {/* backrest */}
      <mesh position={[0, BASE_H + backH / 2, -(D / 2) + BACK_T / 2]}>
        <boxGeometry args={[W, backH, BACK_T]} />
        <meshStandardMaterial color={tone} roughness={0.85} metalness={0} />
      </mesh>

      {/* arms */}
      <mesh position={[-armX, ARM_H / 2, 0]}>
        <boxGeometry args={[ARM_W, ARM_H, D]} />
        <meshStandardMaterial color={tone} roughness={0.85} metalness={0} />
      </mesh>
      <mesh position={[armX, ARM_H / 2, 0]}>
        <boxGeometry args={[ARM_W, ARM_H, D]} />
        <meshStandardMaterial color={tone} roughness={0.85} metalness={0} />
      </mesh>
    </group>
  );
}
