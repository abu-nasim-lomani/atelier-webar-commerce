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
      <ambientLight intensity={0.55} />
      <hemisphereLight intensity={0.35} />
      <directionalLight intensity={0.7} position={[3, 5, 2]} />
    </>
  );
}
