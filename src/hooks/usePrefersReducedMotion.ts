'use client';

/**
 * Reduced-motion preference hook.
 *
 * Later phases map a `true` result to reduced cinematic-sequence variants
 * (the locked degradation order). SSR-safe: assumes no preference until
 * mounted, then subscribes to live changes.
 */
import { useEffect, useState } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(QUERY);
    setReduced(mql.matches);
    const onChange = (e: MediaQueryListEvent): void => {
      setReduced(e.matches);
    };
    mql.addEventListener('change', onChange);
    return () => {
      mql.removeEventListener('change', onChange);
    };
  }, []);

  return reduced;
}
