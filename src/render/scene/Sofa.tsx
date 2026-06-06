/**
 * Sofa — mounts the real hero GLB onto the `product-anchor` seam.
 *
 * Renders nothing itself; on each demanded frame it checks whether the GLB has
 * loaded and, once, fits it to true scale, parents it under `product-anchor`
 * (so the CinematicDriver scale/breathe and FinishDriver tint all keep working
 * on it), and hides the procedural placeholder. Idempotent via a scene-graph
 * check (survives StrictMode double-render and context restore).
 *
 * No `react`; R3F `useFrame` + `three` via helpers only.
 */
import { useFrame } from '@react-three/fiber';
import { HERO_SOFA } from '@config/hero-asset';
import { renderController } from '../controller';
import { fitToFootprint } from '../core/fitModel';
import { ensureSofaLoading, getSofaScene } from './sofaAsset';

// Front-facing yaw. The camera looks down −Z from +Z, so the sofa front must
// face +Z. If it loads showing its back/side, flip to Math.PI (one constant).
const SOFA_YAW = 0;

export function Sofa() {
  ensureSofaLoading();

  useFrame(({ scene }) => {
    const anchor = scene.getObjectByName('product-anchor');
    if (anchor === undefined) return;
    if (anchor.getObjectByName('sofa-model') !== undefined) return;

    const sofa = getSofaScene();
    if (sofa === null) return;

    sofa.name = 'sofa-model';
    sofa.rotation.y = SOFA_YAW;
    fitToFootprint(sofa, HERO_SOFA.dimensionsMeters.width);
    anchor.add(sofa);

    const placeholder = scene.getObjectByName('procedural-placeholder');
    if (placeholder !== undefined) placeholder.visible = false;

    renderController.requestFrame();
  });

  return null;
}
