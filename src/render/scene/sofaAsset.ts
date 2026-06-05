/**
 * Hero-sofa GLB asset — framework-free loader singleton.
 *
 * Loads the optimised GLB once (browser only) and hands the loaded scene to the
 * <Sofa> mounter via a plain getter. On completion it requests a frame so the
 * demand-driven renderer paints the swap immediately. On failure it stays
 * silent and the procedural placeholder remains (graceful, never a dead stage).
 *
 * No `react`; `three` + the render controller only.
 */
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { renderController } from '../controller';

const MODEL_URL = '/models/hero-sofa.glb';

let sofaScene: THREE.Group | null = null;
let started = false;

export function ensureSofaLoading(): void {
  if (started || typeof window === 'undefined') return;
  started = true;

  new GLTFLoader().load(
    MODEL_URL,
    (gltf) => {
      sofaScene = gltf.scene;
      renderController.requestFrame();
    },
    undefined,
    () => {
      // Allow a later retry; placeholder stays visible meanwhile.
      started = false;
    },
  );
}

export function getSofaScene(): THREE.Group | null {
  return sofaScene;
}

/** True once the hero GLB has finished loading (gate for entering AR). */
export function isSofaLoaded(): boolean {
  return sofaScene !== null;
}
