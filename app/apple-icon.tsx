/**
 * Apple touch icon (home-screen / iOS share). Same monogram as the favicon,
 * sized for retina home-screen tiles. iOS rounds the corners itself.
 */
import { ImageResponse } from 'next/og';
import { palette } from '@/tokens';

export const runtime = 'edge';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon(): ImageResponse {
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
          fontSize: 116,
          fontWeight: 600,
        }}
      >
        A
      </div>
    ),
    { ...size },
  );
}
