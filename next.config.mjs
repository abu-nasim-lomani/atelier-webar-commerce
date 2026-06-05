// @ts-check

/**
 * Next.js configuration.
 *
 * Establishes a strict, production-correct shell plus baseline security
 * response headers. The persistent-canvas topology and asset/CDN strategy live
 * in the app code; this file owns build strictness + headers policy.
 *
 * @type {import('next').NextConfig}
 */

const isDev = process.env.NODE_ENV === 'development';

/**
 * Content-Security-Policy. Self-only by default. Inline script/style are
 * permitted because Next App Router injects inline hydration scripts and
 * next/font injects an inline <style> (a nonce-based strict CSP is a later
 * hardening task). `'unsafe-eval'` + `ws:` are added ONLY in development so
 * React Fast Refresh / HMR keep working; production stays stricter.
 *
 * connect-src 'self' covers the GLB fetch; textures live inside the GLB.
 * img/blob/data cover canvas + decoded textures. Update script/connect-src
 * when an analytics provider is added (Step 7).
 */
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "style-src 'self' 'unsafe-inline'",
  // va.vercel-scripts.com = Vercel Analytics / Speed Insights script + beacon
  // (same-origin /_vercel/* on Vercel; the CDN host covers dev/preview).
  `script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com${isDev ? " 'unsafe-eval'" : ''}`,
  `connect-src 'self' https://va.vercel-scripts.com${isDev ? ' ws:' : ''}`,
  "worker-src 'self' blob:",
  "form-action 'self'",
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: csp },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  {
    // camera kept open to 'self' for future Room Preview / WebXR (Phase F).
    key: 'Permissions-Policy',
    value: 'camera=(self), microphone=(), geolocation=(), browsing-topics=()',
  },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Fail the build on type or lint errors — no "ship broken" escape hatch.
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  experimental: {
    // Keep client JS minimal on metered networks (Bangladesh-first constraint).
    optimizePackageImports: [],
  },
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders },
      {
        // Google Scene Viewer / AR Quick Look load the GLB cross-process; some
        // older Scene Viewer builds reject the default `application/octet-
        // stream` Vercel serves for `.glb`. Force the canonical glTF binary
        // media type, and explicitly grant cross-origin reads so the AR
        // launcher (which runs outside the page's origin) can always fetch it.
        source: '/models/:file*.glb',
        headers: [
          { key: 'Content-Type', value: 'model/gltf-binary' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
};

export default nextConfig;
