/**
 * Web app manifest — installable metadata + theme colours for the browser
 * chrome. Colours come from the locked warm palette (never raw hex).
 */
import type { MetadataRoute } from 'next';
import { palette } from '@/tokens';
import { SITE } from '@config/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.shortName,
    description: SITE.description,
    start_url: '/',
    display: 'standalone',
    background_color: palette.bone,
    theme_color: palette.bone,
    icons: [
      { src: '/icon', sizes: '32x32', type: 'image/png' },
      { src: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  };
}
