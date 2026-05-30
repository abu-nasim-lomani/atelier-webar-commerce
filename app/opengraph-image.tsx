/**
 * Open Graph card — the single most-shared brand surface.
 *
 * The product's distribution wedge is FB / WhatsApp link sharing, so this image
 * IS the first impression for most arrivals. Rendered with `next/og` from the
 * locked warm palette. The editorial serif (Fraunces) is fetched at generation
 * time; if that fetch fails (offline build) it falls back to the bundled font
 * so the route can never break the build.
 */
import { ImageResponse } from 'next/og';
import { palette } from '@/tokens';
import { SITE } from '@config/site';

export const runtime = 'edge';

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Fetch a TTF for Fraunces (satori cannot parse woff2; an old UA forces TTF). */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      'https://fonts.googleapis.com/css2?family=Fraunces:wght@500',
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Macintosh; U; Intel Mac OS X 10_6_8; en-US) AppleWebKit/534.50',
        },
      },
    ).then((r) => r.text());
    const match = /url\((https:\/\/[^)]+)\)/.exec(css);
    if (match?.[1] == null) return null;
    return await fetch(match[1]).then((r) => r.arrayBuffer());
  } catch {
    return null;
  }
}

export default async function OpengraphImage(): Promise<ImageResponse> {
  const display = await loadDisplayFont();
  const serif = display !== null ? 'Fraunces' : 'serif';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: palette.bone,
          color: palette.espresso,
          padding: '84px',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: palette.umber,
          }}
        >
          Furniture, seen clearly
        </div>

        <div
          style={{
            display: 'flex',
            fontFamily: serif,
            fontSize: 88,
            lineHeight: 1.04,
            maxWidth: 920,
          }}
        >
          See it home before it’s home.
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div
              style={{
                width: 16,
                height: 16,
                borderRadius: 9999,
                backgroundColor: palette.ember,
                marginRight: 18,
              }}
            />
            <div style={{ display: 'flex', fontFamily: serif, fontSize: 36 }}>
              {SITE.name}
            </div>
          </div>
          <div style={{ display: 'flex', fontSize: 24, color: palette.umber }}>
            True scale · in your own room
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      ...(display !== null
        ? {
            fonts: [
              {
                name: 'Fraunces',
                data: display,
                weight: 500 as const,
                style: 'normal' as const,
              },
            ],
          }
        : {}),
    },
  );
}
