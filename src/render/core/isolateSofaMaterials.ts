/**
 * Isolate the sofa clone's materials for a SECOND WebGLRenderer.
 *
 * The product stage owns the canonical sofa + its loaded textures in the hero
 * renderer. The AR and Room Preview canvases are SEPARATE WebGLRenderers, and a
 * `THREE.Texture` shared across two renderers does not get uploaded to the
 * second context — the cloned sofa then renders as a flat, untextured colour
 * (this is exactly why the AR sofa looked like a solid white/grey blob).
 *
 * Cloning each material AND its textures gives the clone its own upload state,
 * so the second renderer uploads them from the shared image source. Colour is
 * applied by the caller afterwards (white = natural, or the finish tint).
 *
 * Framework-free; `three` only.
 */
import * as THREE from 'three';

export function isolateSofaMaterials(root: THREE.Object3D): void {
  root.traverse((obj) => {
    if (!(obj instanceof THREE.Mesh)) return;
    // `Mesh#material` is typed `any` — funnel via unknown + a real guard.
    const material: unknown = obj.material;
    if (!(material instanceof THREE.MeshStandardMaterial)) return;

    const isolated = material.clone();
    if (isolated.map !== null) isolated.map = isolated.map.clone();
    if (isolated.normalMap !== null) {
      isolated.normalMap = isolated.normalMap.clone();
    }
    if (isolated.roughnessMap !== null) {
      isolated.roughnessMap = isolated.roughnessMap.clone();
    }
    if (isolated.metalnessMap !== null) {
      isolated.metalnessMap = isolated.metalnessMap.clone();
    }
    if (isolated.aoMap !== null) isolated.aoMap = isolated.aoMap.clone();
    isolated.needsUpdate = true;
    obj.material = isolated;
  });
}
