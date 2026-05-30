'use client';

/**
 * RenderCanvas — the WebGL host, mounted INSIDE the product-stage DOM element.
 *
 * The earlier architecture pinned a single canvas to `position: fixed` over the
 * whole viewport and JS-scissored it to the stage rect every scroll frame. On
 * fractional display scaling that race between the compositor and the main
 * thread leaked the model outside the framed window — a stubborn bug.
 *
 * The fix is structural: the Canvas now lives WITHIN the stage div (passed in
 * as a slot from the app composition root), so it scrolls with the page as a
 * single DOM unit. No scissor, no scroll sync, no race — the compositor owns
 * positioning. Idle is still `frameloop="demand"`: 0 frames at rest.
 *
 * No `react` import; R3F + framework-free deps only.
 */
import { Canvas } from '@react-three/fiber';
import { detectTier } from './core/deviceProfile';
import { getPreset } from './core/quality';
import { CAMERA, framingForAspect } from './core/cameraRig';
import { RENDERER } from './core/rendererConfig';
import { renderController } from './controller';
import { Stage } from './scene/Stage';
import { Diagnostics } from './scene/Diagnostics';
import { CinematicDriver } from './scene/CinematicDriver';
import { CameraDolly } from './scene/CameraDolly';
import { FinishDriver } from './scene/FinishDriver';

export function RenderCanvas() {
  const aspect =
    typeof window === 'undefined'
      ? 1.6
      : window.innerWidth / Math.max(1, window.innerHeight);

  const preset = getPreset(detectTier());
  const framing = framingForAspect(aspect);

  return (
    <Canvas
      frameloop="demand"
      dpr={[1, preset.maxDpr]}
      gl={{
        antialias: preset.antialias,
        alpha: true,
        powerPreference: preset.powerPreference,
      }}
      camera={{
        fov: framing.fov,
        position: [
          framing.position[0],
          framing.position[1],
          framing.position[2],
        ],
        near: CAMERA.near,
        far: CAMERA.far,
      }}
      onCreated={(state) => {
        const { gl, camera, invalidate } = state;

        gl.toneMapping = RENDERER.toneMapping;
        gl.toneMappingExposure = RENDERER.exposure;
        gl.outputColorSpace = RENDERER.outputColorSpace;

        camera.lookAt(CAMERA.target[0], CAMERA.target[1], CAMERA.target[2]);

        renderController.register(gl, invalidate);

        const el = gl.domElement;
        const onLost = (event: Event): void => {
          event.preventDefault();
          renderController.markContextLost();
        };
        const onRestored = (): void => {
          renderController.markContextRestored();
          invalidate();
        };
        el.addEventListener('webglcontextlost', onLost, false);
        el.addEventListener('webglcontextrestored', onRestored, false);

        renderController.setContextHandlers(() => {
          el.removeEventListener('webglcontextlost', onLost);
          el.removeEventListener('webglcontextrestored', onRestored);
        });

        // First deliberate frame; R3F auto-renders subsequent demanded frames.
        invalidate();
      }}
    >
      <CinematicDriver />
      <CameraDolly />
      <FinishDriver />
      <Stage />
      <Diagnostics />
    </Canvas>
  );
}
