'use client';

/**
 * CinematicDriver — the locked hero reveal + idle breathing.
 *
 * Phase 1 (one-shot): the product "arrives" 96% → 100% on `ease-authority`,
 * and the contact shadow blooms in **+180ms after** the form resolves — the
 * single timing the motion bible says makes it read as real.
 *
 * Phase 2 (idle breathing): once revealed, the product gains quiet life — a
 * very slow ±6° Y oscillation (locked: "breathing, not a spin"). This is the
 * one deliberately *managed continuous* loop: it renders only while the stage
 * is actually on screen, stops when scrolled away (loop idles), and is fully
 * off under reduced motion. It is the first thing a future thermal controller
 * drops. Runs at useFrame priority 0 (before StageView's priority 1).
 *
 * No `react` import; mutates the scene imperatively (no React state).
 */
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { getStageProgress } from '../core/stageAnchor';
import { easeAuthority } from '../core/easing';
import { revealState } from '../core/cinematicState';
import {
  REVEAL_DURATION_MS,
  SHADOW_BLOOM_DELAY_MS,
  REVEAL_FROM_SCALE,
  SHADOW_REST_OPACITY,
  BREATHE_PERIOD_MS,
  BREATHE_AMPLITUDE_RAD,
} from '../core/motionConfig';

const clamp01 = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);

function shadowMaterial(scene: THREE.Scene): THREE.Material | null {
  const slot = scene.getObjectByName('contact-shadow-slot');
  if (slot === undefined) return null;
  const mesh = slot.children[0];
  if (!(mesh instanceof THREE.Mesh)) return null;
  // `Mesh#material` is typed `any` here — funnel through `unknown` + a real
  // type guard so no `any` escapes (single-material only; arrays → null).
  const material: unknown = mesh.material;
  return material instanceof THREE.Material ? material : null;
}

export function CinematicDriver(): null {
  useFrame((state) => {
    const anchor = state.scene.getObjectByName('product-anchor');
    if (anchor === undefined) return;
    const mat = shadowMaterial(state.scene);

    // ---- Phase 2: idle breathing -----------------------------------------
    if (revealState.done) {
      if (revealState.reduced) {
        anchor.rotation.y = 0;
        return; // static — no frames
      }
      if (getStageProgress() === null) {
        // Off screen: idle (no invalidate) and reset for a smooth re-entry.
        revealState.breatheStartMs = 0;
        anchor.rotation.y = 0;
        return;
      }
      if (revealState.breatheStartMs === 0) {
        revealState.breatheStartMs = performance.now();
      }
      const phase =
        (performance.now() - revealState.breatheStartMs) / BREATHE_PERIOD_MS;
      anchor.rotation.y = Math.sin(phase * Math.PI * 2) * BREATHE_AMPLITUDE_RAD;
      state.invalidate(); // managed continuous loop, only while visible
      return;
    }

    // ---- Phase 1: hero reveal (one-shot) ---------------------------------
    if (!revealState.started) {
      // Hold until the stage is actually on screen, then begin.
      if (getStageProgress() === null) return;

      revealState.reduced =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (revealState.reduced) {
        anchor.scale.setScalar(1);
        if (mat !== null) mat.opacity = SHADOW_REST_OPACITY;
        revealState.done = true;
        return; // snap to rest, static
      }

      revealState.started = true;
      revealState.startMs = performance.now();
    }

    const elapsed = performance.now() - revealState.startMs;

    const pE = easeAuthority(clamp01(elapsed / REVEAL_DURATION_MS));
    anchor.scale.setScalar(REVEAL_FROM_SCALE + (1 - REVEAL_FROM_SCALE) * pE);

    if (mat !== null) {
      const sE = easeAuthority(
        clamp01((elapsed - SHADOW_BLOOM_DELAY_MS) / REVEAL_DURATION_MS),
      );
      mat.opacity = SHADOW_REST_OPACITY * sE;
    }

    if (elapsed >= REVEAL_DURATION_MS + SHADOW_BLOOM_DELAY_MS) {
      anchor.scale.setScalar(1);
      if (mat !== null) mat.opacity = SHADOW_REST_OPACITY;
      revealState.done = true;
      state.invalidate(); // hand off to breathing on the next frame
      return;
    }

    state.invalidate(); // keep the demand loop alive through the reveal
  }, 0);

  return null;
}
