/**
 * fitToFootprint — normalise an arbitrary loaded model to true scale, on the
 * floor, centred on its footprint.
 *
 * Downloaded models arrive in arbitrary units and origins. We scale uniformly
 * so the WIDTH matches the catalogue's true-scale metres (depth/height then
 * follow the model's real proportions), centre X/Z on the origin, and drop the
 * bottom onto y = 0 — exactly the floor-centred contract the placeholder held.
 *
 * Framework-free; `three` only.
 */
import * as THREE from 'three';

export function fitToFootprint(
  object: THREE.Object3D,
  targetWidthMeters: number,
): void {
  object.updateWorldMatrix(true, true);
  const bounds = new THREE.Box3().setFromObject(object);
  const size = new THREE.Vector3();
  bounds.getSize(size);
  if (size.x <= 0) return;

  object.scale.multiplyScalar(targetWidthMeters / size.x);
  object.updateWorldMatrix(true, true);

  const scaled = new THREE.Box3().setFromObject(object);
  const center = new THREE.Vector3();
  scaled.getCenter(center);
  object.position.x -= center.x;
  object.position.z -= center.z;
  object.position.y -= scaled.min.y;
}
