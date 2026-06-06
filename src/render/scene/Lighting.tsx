/**
 * Lighting scaffold — restrained, neutral, calm.
 *
 * Soft ambient + hemisphere fill + one gentle key. No shadows, no dramatic
 * contrast (B1 is foundation, not art direction). The HDRI / IBL environment
 * is a deliberate later decision — see the documented slot in Stage.
 *
 * No `react` import (JSX automatic runtime); R3F intrinsics only.
 */
export function Lighting() {
  return (
    <>
      {/* TEMP DIAGNOSTIC: very low FLAT ambient only (IBL off), so it can NEVER
          overexpose. If the sofa shows brown wood legs + grey-taupe fabric, the
          texture works (earlier white was overexposure). If it's a uniform pale
          grey with no colour variation, the texture is not being applied. */}
      <ambientLight intensity={0.5} />
    </>
  );
}
