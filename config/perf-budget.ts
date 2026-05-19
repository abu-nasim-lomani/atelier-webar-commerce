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
    heroGlbCeilingMb: 3.5,
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
