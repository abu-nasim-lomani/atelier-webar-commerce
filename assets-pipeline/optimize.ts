/**
 * Hero-asset optimiser (offline / manual step — NOT part of `verify` or
 * `build`, since the raw source is git-ignored).
 *
 * Reads the raw downloaded glTF from `assets-pipeline/source/`, then:
 *   - dedup / weld / prune geometry (cheap, lossless clean-up)
 *   - resize every texture to ≤ 2K and re-encode as JPEG q85 (the big win:
 *     the source ships ~71 MB of 4K PNG; 2K JPEG lands in single-digit MB
 *     and is universally supported — including older Google Scene Viewer
 *     / ARCore on mid-range Android, where WebP textures fail to load and
 *     Scene Viewer closes silently on launch)
 * and writes a single packed GLB to `public/models/hero-sofa.glb`.
 *
 * The model's CC-BY attribution (asset.extras) is preserved through the write.
 *
 * DEFERRED (Phase H, GPU-memory hardening): KTX2/Basis (ETC1S/UASTC) + meshopt.
 * KTX2 keeps textures compressed in VRAM — the bigger sustained-thermal win —
 * but needs the Basis transcoder wired into the runtime loader. WebP@2K already
 * satisfies the download budget and the GPU texture budget for a single hero.
 *
 * Run: `pnpm assets:optimize`
 */
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { NodeIO, getBounds, type Document } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup,
  weld,
  prune,
  textureCompress,
} from '@gltf-transform/functions';
import sharp from 'sharp';
import { HERO_SOFA } from '../config/hero-asset';

const SRC = path.resolve('assets-pipeline/source/scene.gltf');
const OUT = path.resolve('public/models/hero-sofa.glb');
const MAX_TEXTURE = 2048;
const JPEG_QUALITY = 80;
const TARGET_WIDTH = HERO_SOFA.dimensionsMeters.width;

function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

/**
 * Bake true scale into the GLB itself.
 *
 * The runtime fits the model on load, but native AR (Scene Viewer / Quick Look)
 * reads the file's INTRINSIC units and places it at THAT size — so the file
 * must already be metres: width = the catalogue width, footprint centred on the
 * origin, base sitting on the floor (y = 0). We wrap the scene under one node
 * carrying the uniform scale + the centring/floor offset (native viewers honour
 * node transforms), so vertex data is untouched.
 */
function fitToTrueScale(document: Document): void {
  const scene = document.getRoot().listScenes()[0];
  if (scene === undefined) return;

  const before = getBounds(scene);
  const width = before.max[0] - before.min[0];
  if (width <= 0) return;

  const f = TARGET_WIDTH / width;
  const cx = (before.min[0] + before.max[0]) / 2;
  const cz = (before.min[2] + before.max[2]) / 2;
  const minY = before.min[1];

  // world' = f · world + T, solved so centre.x/z → 0 and min.y → 0.
  const fit = document
    .createNode('true-scale-fit')
    .setScale([f, f, f])
    .setTranslation([-f * cx, -f * minY, -f * cz]);

  for (const child of scene.listChildren()) {
    scene.removeChild(child);
    fit.addChild(child);
  }
  scene.addChild(fit);

  const after = getBounds(scene);
  const dims = (b: ReturnType<typeof getBounds>): string =>
    `${(b.max[0] - b.min[0]).toFixed(3)} × ${(b.max[1] - b.min[1]).toFixed(
      3,
    )} × ${(b.max[2] - b.min[2]).toFixed(3)} m`;
  console.log(`  true-scale ×${f.toFixed(4)}: ${dims(before)} → ${dims(after)}`);
}

async function main(): Promise<void> {
  const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);

  const document = await io.read(SRC);

  await document.transform(
    dedup(),
    weld(),
    prune(),
    textureCompress({
      encoder: sharp,
      targetFormat: 'jpeg',
      resize: [MAX_TEXTURE, MAX_TEXTURE],
      quality: JPEG_QUALITY,
    }),
  );

  // Native AR reads intrinsic units — bake true scale into the file.
  fitToTrueScale(document);

  await mkdir(path.dirname(OUT), { recursive: true });
  await io.write(OUT, document);

  const { size } = await stat(OUT);
  console.log(`✓ Optimised hero sofa → ${mb(size)}  (${OUT})`);
}

main().catch((error: unknown) => {
  console.error('✗ Optimise failed:', error);
  process.exit(1);
});
