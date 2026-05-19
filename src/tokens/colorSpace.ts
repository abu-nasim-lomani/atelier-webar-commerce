/**
 * COLOUR-SPACE UTILITY — prepared for the render channel (Phase B).
 *
 * UI colour is authored in sRGB. The renderer needs linear-light values for
 * correct PBR / tone mapping (Phase 5 decision: "UI is sRGB, render needs
 * linear; tokens must expose both"). This module provides the pure, framework-
 * free conversion now so the linear channel exists from the foundation — it is
 * NOT wired to any renderer in A1.
 */

export interface LinearRGB {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const srgbChannelToLinear = (c: number): number => {
  const x = c / 255;
  return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
};

/** Parse `#RGB` / `#RRGGBB` (with optional alpha) to 8-bit channels. */
const parseHex = (hex: string): { r: number; g: number; b: number } => {
  const h = hex.replace('#', '');
  const full =
    h.length === 3 || h.length === 4
      ? h
          .split('')
          .map((ch) => ch + ch)
          .join('')
      : h;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
};

/** Convert an sRGB hex token into linear-light RGB (0–1) for the renderer. */
export const hexToLinear = (hex: string): LinearRGB => {
  const { r, g, b } = parseHex(hex);
  return {
    r: srgbChannelToLinear(r),
    g: srgbChannelToLinear(g),
    b: srgbChannelToLinear(b),
  };
};
