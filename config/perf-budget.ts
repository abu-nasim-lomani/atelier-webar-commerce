/**
 * PERFORMANCE BUDGET — the locked Phase 5 numbers as a single source of truth.
 *
 * Defined now so later phases (and the Phase C CI gate) reference these
 * constants rather than scattering magic numbers. NOT enforced in A1 — there
 * is nothing to measure yet. The reference device is the spec, not a flagship.
 */

export const perfBudget = {
  /** Reference device the budget is set against. */
  referenceDevice:
    '2021–22 mid-range Android · Snapdragon 6xx/Helio G · Mali-G52/Adreno 610 · ~4GB RAM',

  frame: {
    /** GL/cinematic layer target. */
    glTargetFps: 30,
    glFrameMs: 33,
    /** Sustained frame over this = failure. */
    glHardFailMs: 50,
    /** UI/input layer must stay fluid. */
    uiFrameMs: 16,
  },

  memory: {
    tabFootprintMaxMb: 400,
    gpuTextureMaxMb: 200,
  },

  payload: {
    heroGlbTargetMbMin: 1.5,
    heroGlbTargetMbMax: 2.5,
    // Raised from 3.5 → 4.0: the hero normal map ships as lossless PNG (JPEG
    // corrupts normals → flat/plastic surface). Worth the extra ~0.7MB for the
    // realistic fabric/wood micro-detail.
    heroGlbCeilingMb: 4.0,
    totalToInteractiveMb: 4,
  },

  scene: {
    triBudget: 150_000,
    triHardMax: 250_000,
    drawCallMax: 50,
    textureHeroMaxPx: 2048,
    textureSecondaryMaxPx: 1024,
    /** Clamp devicePixelRatio — full DPR on a 3× screen is a silent killer. */
    dprClampMax: 2,
  },
} as const;

export type PerfBudget = typeof perfBudget;
