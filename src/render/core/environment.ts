/**
 * Neutral indoor IBL (image-based lighting).
 *
 * PBR materials (MeshStandardMaterial) get most of their realism from
 * environment reflections. With no environment the sofa reads as flat, matte
 * "plastic / clay" no matter how good the texture is. This applies a soft,
 * neutral indoor environment generated procedurally from three's
 * `RoomEnvironment` (no HDRI file, no download) via PMREM, and sets it as
 * `scene.environment` so every standard material picks it up automatically.
 *
 * Framework-free; `three` only. Called once per renderer in `onCreated`.
 */
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export function applyNeutralEnvironment(
  gl: THREE.WebGLRenderer,
  scene: THREE.Scene,
): void {
  const pmrem = new THREE.PMREMGenerator(gl);
  const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTexture;
  // RoomEnvironment is brighter than model-viewer's neutral studio, so at full
  // strength (plus any manual lights) it overexposed the sofa to white. 0.6
  // lands the exposure where model-viewer's neutral env does — realistic.
  scene.environmentIntensity = 0.6;
  pmrem.dispose();
}
