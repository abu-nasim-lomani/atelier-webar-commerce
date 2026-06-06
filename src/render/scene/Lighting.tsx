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
      {/* IBL (scene.environment, full strength) does the lighting, like
          model-viewer. Just a soft directional key for form/definition + a
          tiny ambient as a floor. More than this flattens / overexposes it. */}
      <ambientLight intensity={0.1} />
      <directionalLight intensity={0.4} position={[3, 5, 2]} />
    </>
  );
}
