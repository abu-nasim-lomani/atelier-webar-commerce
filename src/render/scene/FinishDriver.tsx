'use client';

/**
 * FinishDriver — applies the materialBridge's active finish colour to every
 * MeshStandardMaterial under the `product-anchor` group.
 *
 * Pure consume-on-demand: only runs when the bridge has a PENDING update
 * (set by the app layer via `materialBridge.setFinishHex`), and the bridge
 * itself requested the frame via `renderController.requestFrame()`. After
 * applying it does NOT invalidate again — render returns to idle. Priority 0
 * so the colour is set BEFORE StageView (priority 1) renders the frame.
 *
 * No `react` import; mutates the scene imperatively.
 */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { materialBridge } from '../materialBridge';

export function FinishDriver(): null {
  useFrame((state) => {
    const target = materialBridge.consume();
    if (target === null) return;

    const anchor = state.scene.getObjectByName('product-anchor');
    if (anchor === undefined) return;

    anchor.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      // `Mesh#material` is typed `any` — funnel via unknown + a real guard.
      const material: unknown = obj.material;
      if (material instanceof THREE.MeshStandardMaterial) {
        material.color.copy(target);
      }
    });
  }, 0);

  return null;
}
