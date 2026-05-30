'use client';

/**
 * StageView — DOM-anchored containment (the fix for canvas bleed + misframe).
 *
 * Takes over rendering (priority useFrame > 0 → R3F stops auto-rendering): each
 * demanded frame it clears the whole drawing buffer transparent, then scissors
 * + viewports rendering to ONLY the Hero stage rect — derived from the canvas's
 * own measured CSS↔buffer scale (`getStageViewport`), so it stays exact under
 * fractional display scaling. Off that element → nothing drawn → pristine A2.
 *
 * Still fully demand-driven: frames happen only on the controlled
 * scroll/resize invalidations wired in RenderCanvas. No `react` import.
 */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStageViewport } from '../core/stageAnchor';

export function StageView(): null {
  useFrame((state) => {
    const { gl, scene, camera } = state;
    const canvas = gl.domElement;

    // 1. Clear the entire drawing buffer to fully transparent.
    gl.setScissorTest(false);
    gl.setViewport(0, 0, canvas.width, canvas.height);
    gl.clear();

    // 2. Resolve the stage rect in buffer space; absent/off-screen → clean.
    const vp = getStageViewport(canvas);
    if (vp === null) return;

    if (camera instanceof THREE.PerspectiveCamera) {
      const aspect = vp.w / vp.h;
      if (camera.aspect !== aspect) {
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
      }
    }

    // 3. Render the scene into just that window.
    gl.setViewport(vp.x, vp.y, vp.w, vp.h);
    gl.setScissor(vp.x, vp.y, vp.w, vp.h);
    gl.setScissorTest(true);
    gl.render(scene, camera);
  }, 1);

  return null;
}
