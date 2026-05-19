// @ts-check

/**
 * Next.js configuration — Phase A1.
 *
 * Intentionally minimal. The persistent-canvas topology, asset/CDN strategy,
 * and headers policy are introduced in later phases (B / C / H) — A1 only
 * establishes a strict, production-correct shell.
 *
 * @type {import('next').NextConfig}
 */
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
};

export default nextConfig;
