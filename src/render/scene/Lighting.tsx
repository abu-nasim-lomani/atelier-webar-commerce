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
      {/* TEMP DIAGNOSTIC: plain lighting (IBL off) to reveal whether the sofa
          texture renders at all. Grey fabric + brown legs = texture works;
          still white = texture not applied. */}
      <ambientLight intensity={0.5} />
      <hemisphereLight intensity={0.3} />
      <directionalLight intensity={0.9} position={[3, 5, 2]} />
    </>
  );
}
