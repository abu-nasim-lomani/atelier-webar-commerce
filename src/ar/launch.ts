/**
 * AR launcher — capability-driven resolution.
 *
 * Given the hero asset URLs + the site origin, picks the right native AR
 * method for the device and returns a plain {href, rel} the UI can render
 * directly. UI never imports this layer — the app composition root computes
 * the result client-side and passes plain strings to the action bar (locked
 * boundary: ui forbidden from depending on ar).
 *
 * Platform reality (locked, non-negotiable):
 *   - Android (any) → Google Scene Viewer intent (GLB; works WITHOUT WebXR).
 *   - iOS → AR Quick Look (USDZ; iOS Safari handles `rel="ar"` natively).
 *   - Else → unsupported here; Room Preview fallback lives in F2.
 *
 * The WebXR `immersive-ar` premium path (custom UI, hit-test, capture) lives
 * in Phase F3 and replaces the Scene Viewer path on capable Android Chrome.
 */
import { detectPlatform } from '@capability/arSupport';

export type ArLaunchMode = 'scene-viewer' | 'quick-look' | 'unsupported';

export interface ArLaunchInfo {
  readonly mode: ArLaunchMode;
  /** When defined, render an anchor with this `href`. */
  readonly href?: string;
  /** When defined (only for iOS Quick Look), the anchor must carry this rel. */
  readonly rel?: string;
}

export interface ResolveArOptions {
  /** Path or absolute URL to the GLB (e.g. `/models/hero-sofa.glb`). */
  readonly glbUrl: string;
  /** Path or absolute URL to the USDZ (iOS Quick Look). Optional until F4. */
  readonly usdzUrl?: string | undefined;
  /** Canonical site origin — Scene Viewer's `file` MUST be absolute. */
  readonly siteUrl: string;
  /** Product slug — used as Scene Viewer's browser fallback URL. */
  readonly productSlug: string;
  /** Title shown by Scene Viewer over the AR view. */
  readonly productTitle?: string | undefined;
}

function toAbsolute(url: string, base: string): string {
  return new URL(url, base).toString();
}

export function resolveArLaunch(opts: ResolveArOptions): ArLaunchInfo {
  const platform = detectPlatform();

  if (platform === 'ios') {
    if (opts.usdzUrl === undefined) return { mode: 'unsupported' };
    return {
      mode: 'quick-look',
      href: toAbsolute(opts.usdzUrl, opts.siteUrl),
      rel: 'ar',
    };
  }

  if (platform === 'android') {
    const file = toAbsolute(opts.glbUrl, opts.siteUrl);
    const fallback = toAbsolute(`/product/${opts.productSlug}`, opts.siteUrl);

    // CRITICAL: keep the `file` and `S.browser_fallback_url` values as RAW
    // absolute URLs — do NOT percent-encode them. Some Scene Viewer builds
    // fail to parse encoded slashes/colons (`https%3A%2F%2F…`) and dismiss
    // silently. This is safe ONLY because our GLB and product URLs carry no
    // query string of their own — a `?`/`&`/`#` inside the value WOULD break
    // intent parsing and require encoding. Only the title (which may contain
    // spaces) is encoded.
    const titleParam =
      opts.productTitle !== undefined
        ? `&title=${encodeURIComponent(opts.productTitle)}`
        : '';

    const intent =
      `intent://arvr.google.com/scene-viewer/1.0?file=${file}&mode=ar_preferred${titleParam}` +
      `#Intent;scheme=https;` +
      `package=com.google.android.googlequicksearchbox;` +
      `action=android.intent.action.VIEW;` +
      `S.browser_fallback_url=${fallback};end;`;

    return { mode: 'scene-viewer', href: intent };
  }

  return { mode: 'unsupported' };
}
