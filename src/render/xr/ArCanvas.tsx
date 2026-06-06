'use client';

/**
 * ArCanvas (Phase F3.1) — the WebXR host canvas.
 *
 * Kept mounted (1px, hidden) on the product page once WebXR-AR is supported, so
 * `enterAr()` can fire inside the user gesture and bind the started session to
 * this renderer. During the immersive session the device compositor presents
 * the AR view full-screen — the canvas's own size is irrelevant.
 *
 * No `react` import; @react-three/fiber + @react-three/xr only.
 */
import { Canvas } from '@react-three/fiber';
import { XR } from '@react-three/xr';
import { RENDERER } from '../core/rendererConfig';
import { applyNeutralEnvironment } from '../core/environment';
import { xrStore } from './xrStore';
import { ArScene } from './ArScene';

interface ArCanvasProps {
  readonly finishHex: string | null;
  readonly fitLabel: string | null;
  readonly watermark: string;
}

export function ArCanvas({ finishHex, fitLabel, watermark }: ArCanvasProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        insetBlockEnd: 0,
        insetInlineStart: 0,
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      <Canvas
        onCreated={({ gl, scene }) => {
          // Match the hero stage + Room Preview colour pipeline so the sofa
          // reads identically in AR (ACES tone map + exposure + sRGB output)
          // plus the neutral IBL so it looks like real fabric, not plastic.
          gl.toneMapping = RENDERER.toneMapping;
          gl.toneMappingExposure = RENDERER.exposure;
          gl.outputColorSpace = RENDERER.outputColorSpace;
          applyNeutralEnvironment(gl, scene);
        }}
      >
        <XR store={xrStore}>
          <ArScene
            finishHex={finishHex}
            fitLabel={fitLabel}
            watermark={watermark}
          />
        </XR>
      </Canvas>
    </div>
  );
}
