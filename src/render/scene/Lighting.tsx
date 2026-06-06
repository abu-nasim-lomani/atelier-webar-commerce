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
      {/* IBL (scene.environment) does the lighting, like model-viewer. Only a
          gentle directional key for form + a tiny ambient floor — anything
          stronger overexposed the sofa to white on top of the IBL. */}
      <ambientLight intensity={0.08} />
      <directionalLight intensity={0.25} position={[3, 5, 2]} />
    </>
  );
}
