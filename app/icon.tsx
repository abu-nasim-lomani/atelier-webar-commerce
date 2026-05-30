/**
 * Favicon — a quiet monogram on warm near-black. Generated with `next/og` from
 * the locked palette (no binary asset to manage; regenerates from tokens).
 */
import { ImageResponse } from 'next/og';
import { palette } from '@/tokens';

// Edge avoids the @vercel/og Node-runtime `fileURLToPath` crash on Windows
// builds and is the standard runtime for generated image routes.
export const runtime = 'edge';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon(): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.espresso,
          color: palette.bone,
          fontSize: 22,
          fontWeight: 600,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
