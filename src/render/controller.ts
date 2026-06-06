/**
 * Render controller — the imperative seam.
 *
 * A framework-free singleton holding the live renderer handle and R3F's
 * `invalidate`. This is how future scene orchestration and the AR session will
 * request frames WITHOUT React re-renders (the locked "no React-driven render
 * loop" rule). B1 only registers handles and tracks context-loss; nothing
 * external drives it yet.
 */
import type * as THREE from 'three';

type Invalidate = () => void;
type Cleanup = () => void;

interface RenderController {
  register: (gl: THREE.WebGLRenderer, invalidate: Invalidate) => void;
  getRenderer: () => THREE.WebGLRenderer | null;
  requestFrame: () => void;
  /** PNG data URL of the current frame (needs gl preserveDrawingBuffer). */
  captureDataUrl: () => string | null;
  setContextHandlers: (cleanup: Cleanup) => void;
  markContextLost: () => void;
  markContextRestored: () => void;
  isContextLost: () => boolean;
  dispose: () => void;
}

let gl: THREE.WebGLRenderer | null = null;
let invalidate: Invalidate | null = null;
let contextCleanup: Cleanup | null = null;
let contextLost = false;

export const renderController: RenderController = {
  register(nextGl, nextInvalidate) {
    gl = nextGl;
    invalidate = nextInvalidate;
  },
  getRenderer() {
    return gl;
  },
  requestFrame() {
    if (invalidate !== null && !contextLost) invalidate();
  },
  captureDataUrl() {
    if (gl === null) return null;
    return gl.domElement.toDataURL('image/png');
  },
  setContextHandlers(cleanup) {
    contextCleanup = cleanup;
  },
  markContextLost() {
    contextLost = true;
  },
  markContextRestored() {
    contextLost = false;
  },
  isContextLost() {
    return contextLost;
  },
  dispose() {
    if (contextCleanup !== null) contextCleanup();
    contextCleanup = null;
    gl = null;
    invalidate = null;
    contextLost = false;
  },
};
