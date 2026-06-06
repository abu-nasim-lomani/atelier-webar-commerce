/**
 * TEMP (testing only): pack the source as close to ORIGINAL as is practical for
 * phone AR — original metallic material kept (NO de-metal), textures LOSSLESS
 * PNG at 2K (no JPEG corruption), true-scale applied. Full 4K is ~68MB (too
 * heavy for Scene Viewer on a phone); 2K-lossless isolates the two things the
 * optimiser changed (JPEG + de-metal). Run: `pnpm tsx assets-pipeline/make-original.ts`
 */
import { mkdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { NodeIO, getBounds, type Document } from '@gltf-transform/core';
import { KHRONOS_EXTENSIONS } from '@gltf-transform/extensions';
import { textureCompress } from '@gltf-transform/functions';
import sharp from 'sharp';
import { HERO_SOFA } from '../config/hero-asset';

const SRC = path.resolve('assets-pipeline/source/scene.gltf');
const OUT = path.resolve('public/models/hero-sofa-original.glb');
const TARGET_WIDTH = HERO_SOFA.dimensionsMeters.width;

function fitToTrueScale(document: Document): void {
  const scene = document.getRoot().listScenes()[0];
  if (scene === undefined) return;
  const b = getBounds(scene);
  const width = b.max[0] - b.min[0];
  if (width <= 0) return;
  const f = TARGET_WIDTH / width;
  const cx = (b.min[0] + b.max[0]) / 2;
  const cz = (b.min[2] + b.max[2]) / 2;
  const minY = b.min[1];
  const fit = document
    .createNode('true-scale-fit')
    .setScale([f, f, f])
    .setTranslation([-f * cx, -f * minY, -f * cz]);
  for (const child of scene.listChildren()) {
    scene.removeChild(child);
    fit.addChild(child);
  }
  scene.addChild(fit);
}

async function main(): Promise<void> {
  const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
  const document = await io.read(SRC);
  // Lossless PNG everywhere, 2K — keeps the original material untouched.
  await document.transform(
    textureCompress({
      encoder: sharp,
      targetFormat: 'png',
      resize: [2048, 2048],
    }),
  );
  fitToTrueScale(document);
  await mkdir(path.dirname(OUT), { recursive: true });
  await io.write(OUT, document);
  const { size } = await stat(OUT);
  console.log(`✓ original GLB → ${(size / 1024 / 1024).toFixed(2)} MB  (${OUT})`);
}

main().catch((e: unknown) => {
  console.error(e);
  process.exit(1);
});
