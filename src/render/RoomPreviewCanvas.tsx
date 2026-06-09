'use client';

/**
 * RoomPreviewCanvas — the WebGL host for the Room Preview fallback (Phase F2).
 *
 * A SECOND, fully independent canvas, mounted only while the preview overlay is
 * open (the app unmounts it on close, freeing the GL context). It deliberately
 * does NOT register with `renderController` or touch `materialBridge` — those
 * singletons belong to the persistent product stage. The finish arrives as a
 * plain hex prop and is applied inside <RoomSofa>.
 *
 * The hero stage uses `frameloop="demand"`; here we run `always` for the brief,
 * user-initiated lifetime of the overlay (a managed foreground loop — the
 * fallback audience is capable iPhone/desktop). It carries the gentle breathing
 * and idles to a still frame under reduced motion.
 *
 * No `react` import; R3F + framework-free render deps only.
 */
import { Canvas } from '@react-three/fiber';
import { detectTier } from './core/deviceProfile';
import { getPreset } from './core/quality';
import { RENDERER } from './core/rendererConfig';
import { applyNeutralEnvironment } from './core/environment';
import { Lighting } from './scene/Lighting';
import { ContactShadow } from './scene/ContactShadow';
import { RoomSofa } from './scene/RoomSofa';

// A calm three-quarter framing — reads as "placed in a room", not the head-on
// gallery shot of the hero stage. The sofa sits at the origin on the floor.
const CAMERA_FOV = 36;
const CAMERA_POSITION: [number, number, number] = [1.5, 1.05, 4.2];
const CAMERA_TARGET: [number, number, number] = [0, 0.45, 0];
const CAMERA_NEAR = 0.1;
const CAMERA_FAR = 100;

// Resting contact-shadow opacity (the hero blooms to this; here we set it).
const SHADOW_REST_OPACITY = 0.5;

interface RoomPreviewCanvasProps {
  readonly finishHex: string | null;
  readonly reducedMotion: boolean;
  /** Photo-mode yaw (radians), or null for preset-room breathing. */
  readonly yaw: number | null;
}

export function RoomPreviewCanvas({
  finishHex,
  reducedMotion,
  yaw,
}: RoomPreviewCanvasProps) {
  const preset = getPreset(detectTier());

  return (
    <Canvas
      frameloop="always"
      dpr={[1, preset.maxDpr]}
      gl={{
        antialias: preset.antialias,
        alpha: true,
        powerPreference: preset.powerPreference,
        // Allow snapshotting the sofa for the "your room" composite.
        preserveDrawingBuffer: true,
      }}
      camera={{
        fov: CAMERA_FOV,
        position: CAMERA_POSITION,
        near: CAMERA_NEAR,
        far: CAMERA_FAR,
      }}
      onCreated={({ gl, camera, scene }) => {
        gl.toneMapping = RENDERER.toneMapping;
        gl.toneMappingExposure = RENDERER.exposure;
        gl.outputColorSpace = RENDERER.outputColorSpace;
        applyNeutralEnvironment(gl, scene);
        camera.lookAt(CAMERA_TARGET[0], CAMERA_TARGET[1], CAMERA_TARGET[2]);
      }}
    >
      <Lighting />
      <RoomSofa finishHex={finishHex} reducedMotion={reducedMotion} yaw={yaw} />
      {/* The grounded shadow plane only reads as real over the preset backdrop.
          In photo mode the 3D floor doesn't match the buyer's photo, so the
          ellipse floats — drop it there (yaw !== null = photo mode). */}
      {yaw === null ? <ContactShadow opacity={SHADOW_REST_OPACITY} /> : null}
    </Canvas>
  );
}
