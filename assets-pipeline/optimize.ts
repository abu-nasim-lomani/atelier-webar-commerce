/**
 * Hero-asset optimiser (offline / manual step — NOT part of `verify` or
 * `build`, since the raw source is git-ignored).
 *
 * Reads the raw downloaded glTF from `assets-pipeline/source/`, then:
 *   - dedup / weld / prune geometry (cheap, lossless clean-up)
 *   - resize every texture to ≤ 2K and re-encode as WebP (the big win: the
 *     source ships ~71 MB of 4K PNG; 2K WebP lands in single-digit MB and
 *     loads natively in the browser, no KTX2 transcoder required)
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
import { NodeIO } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import {
  dedup,
  weld,
  prune,
  textureCompress,
} from '@gltf-transform/functions';
import sharp from 'sharp';

const SRC = path.resolve('assets-pipeline/source/scene.gltf');
const OUT = path.resolve('public/models/hero-sofa.glb');
const MAX_TEXTURE = 2048;
const WEBP_QUALITY = 85;

function mb(bytes: number): string {
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
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
      targetFormat: 'webp',
      resize: [MAX_TEXTURE, MAX_TEXTURE],
      quality: WEBP_QUALITY,
    }),
  );

  await mkdir(path.dirname(OUT), { recursive: true });
  await io.write(OUT, document);

  const { size } = await stat(OUT);
  console.log(`✓ Optimised hero sofa → ${mb(size)}  (${OUT})`);
}

main().catch((error: unknown) => {
  console.error('✗ Optimise failed:', error);
  process.exit(1);
});
