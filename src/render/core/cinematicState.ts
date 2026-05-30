/**
 * Cinematic reveal/idle state — a framework-free singleton (like
 * renderController).
 *
 * The driver is mounted once for the app lifetime; keeping this state here
 * (not in component locals) makes it immune to any React re-render and keeps
 * the render loop free of React state.
 */
export const revealState = {
  /** Reveal timing has begun (stage was visible). */
  started: false,
  /** Reveal finished — driver is now in the idle-breathing phase. */
  done: false,
  /** performance.now() at which the reveal started. */
  startMs: 0,
  /** Resolved once: user prefers reduced motion → no animation at all. */
  reduced: false,
  /** performance.now() the current breathing run began (0 = reset/neutral). */
  breatheStartMs: 0,
};
