/**
 * Isolate the sofa clone's materials for a SECOND WebGLRenderer.
 *
 * The product stage owns the canonical sofa + its loaded textures in the hero
 * renderer. The AR and Room Preview canvases are SEPARATE WebGLRenderers, and a
 * `THREE.Texture` shared with the hero renderer is not uploaded to the second
 * context — so we clone each material AND its textures.
 *
 * TEMP DIAGNOSTIC: replace the sofa's material with an UNLIT MeshBasicMaterial
 * showing only the baseColour map. If the texture then shows, the map loads
 * fine and the white sofa was a lighting/PBR issue; if it's still flat/white,
 * the baseColour map is missing from the loaded material (a loader problem).
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

    const map = material.map !== null ? material.map.clone() : null;
    if (map !== null) map.needsUpdate = true;
    obj.material = new THREE.MeshBasicMaterial({ map });
  });
}
