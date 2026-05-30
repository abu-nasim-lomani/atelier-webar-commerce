'use client';

/**
 * CameraDolly — restrained scroll choreography (locked: cinematic dolly,
 * decoupled from raw scroll, never parallax-abuse).
 *
 * Decoupled: each rendered frame it READS the stage scroll progress and sets a
 * TARGET, then eases the camera toward it (weighted lerp) — it never binds the
 * camera to scroll events. Demand-safe: invalidates only until settled; gated
 * to post-reveal + stage-visible + motion-allowed, so it rides D2's managed
 * loop while visible and idles otherwise. Owns camera position after the
 * reveal. Priority 0 (before StageView's 1). No `react` import.
 */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStageProgress } from '../core/stageAnchor';
import { revealState } from '../core/cinematicState';
import { CAMERA, dollyPosition } from '../core/cameraRig';

const LERP = 0.08;
const SETTLE_EPS = 1e-6;
const target = new THREE.Vector3();

export function CameraDolly(): null {
  useFrame((state) => {
    if (!revealState.done || revealState.reduced) return;

    const progress = getStageProgress();
    if (progress === null) return;

    const [tx, ty, tz] = dollyPosition(progress);
    target.set(tx, ty, tz);

    state.camera.position.lerp(target, LERP);
    state.camera.lookAt(CAMERA.target[0], CAMERA.target[1], CAMERA.target[2]);

    if (state.camera.position.distanceToSquared(target) > SETTLE_EPS) {
      state.invalidate(); // ease toward rest, then idle
    }
  }, 0);

  return null;
}
