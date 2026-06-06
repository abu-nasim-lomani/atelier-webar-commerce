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
      {/* IBL (scene.environment) now provides the ambient fill, so the manual
          lights are dialled back — full manual + IBL overexposed the sofa to
          white. A soft directional keeps form/definition. */}
      <ambientLight intensity={0.25} />
      <hemisphereLight intensity={0.15} />
      <directionalLight intensity={0.6} position={[3, 5, 2]} />
    </>
  );
}
