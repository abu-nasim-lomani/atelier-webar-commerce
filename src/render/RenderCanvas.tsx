'use client';

/**
 * RenderCanvas — the single persistent WebGL host.
 *
 * Mounted once inside the reserved #canvas-root slot (root layout) so it
 * survives every client navigation and never remounts. `frameloop="demand"`:
 * one frame on creation, then the GPU is idle until something invalidates —
 * the locked "stable calm over continuous" rule. The render loop is never
 * driven by React state; frames are requested imperatively via renderController.
 *
 * No `react` import — JSX automatic runtime + R3F only (render stays
 * framework-free at the package level).
 */
import { Canvas } from '@react-three/fiber';
import { detectTier } from './core/deviceProfile';
import { getPreset } from './core/quality';
import { CAMERA, framingForAspect } from './core/cameraRig';
import { RENDERER } from './core/rendererConfig';
import { renderController } from './controller';
import { Stage } from './scene/Stage';
import { Diagnostics } from './scene/Diagnostics';
import { StageView } from './scene/StageView';
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
        // Manual clears (StageView) must be fully transparent.
        gl.setClearAlpha(0);

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

        // Controlled, demand-safe invalidation: invalidate directly inside
        // the scroll/resize handler — NOT via a rAF throttle. The throttle
        // added one rAF hop between the scroll event and R3F's render, which
        // left the scissor a frame behind the DOM during scroll (visible
        // drift). `invalidate()` is just a flag write; R3F still renders only
        // once per rAF regardless of how many events fire → still
        // demand-driven, no continuous loop, but in lockstep with scroll.
        const onScrollOrResize = (): void => {
          invalidate();
        };
        window.addEventListener('scroll', onScrollOrResize, { passive: true });
        window.addEventListener('resize', onScrollOrResize);

        renderController.setContextHandlers(() => {
          el.removeEventListener('webglcontextlost', onLost);
          el.removeEventListener('webglcontextrestored', onRestored);
          window.removeEventListener('scroll', onScrollOrResize);
          window.removeEventListener('resize', onScrollOrResize);
        });

        // First deliberate frame; StageView paints it into the stage rect.
        invalidate();
      }}
    >
      <CinematicDriver />
      <CameraDolly />
      <FinishDriver />
      <StageView />
      <Stage />
      <Diagnostics />
    </Canvas>
  );
}
