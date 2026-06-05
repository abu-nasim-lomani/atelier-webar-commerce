/**
 * ContactShadow — the soft, warm grounding shadow under the placeholder.
 *
 * A token-tinted plane at the floor using a generated radial alpha mask. This
 * is the single detail that makes the object read as having weight (locked:
 * "missing/black contact shadow = #1 cheap-tell"). Tint is a design token,
 * never a hex; falloff is the generated grayscale mask.
 *
 * No `react` import; R3F intrinsics only.
 */
import { HERO_SOFA } from '@config/hero-asset';
import { contactShadow } from '@/tokens';
import { linearColor } from '../core/colorBridge';
import { getContactShadowTexture } from '../core/contactShadow';

const { width: W, depth: D } = HERO_SOFA.dimensionsMeters;

// Spread wider than the footprint so the edge melts away softly.
const SHADOW_W = W * 1.25;
const SHADOW_D = D * 1.5;
const FLOOR_LIFT = 0.002;
const TURN_FLAT = -Math.PI / 2;

interface ContactShadowProps {
  /**
   * Initial opacity. The hero leaves this at 0 and lets the CinematicDriver
   * bloom it 0 → rest (+180ms after the form resolves, locked). Room Preview
   * has no driver, so it passes the rest opacity directly.
   */
  readonly opacity?: number;
}

export function ContactShadow({ opacity = 0 }: ContactShadowProps = {}) {
  const map = getContactShadowTexture();
  if (map === null) return null;

  return (
    <mesh rotation={[TURN_FLAT, 0, 0]} position={[0, FLOOR_LIFT, 0]}>
      <planeGeometry args={[SHADOW_W, SHADOW_D]} />
      <meshBasicMaterial
        color={linearColor(contactShadow.base)}
        alphaMap={map}
        transparent
        opacity={opacity}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
