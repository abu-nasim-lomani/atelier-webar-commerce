'use client';

/**
 * useReveal — quiet on-enter reveal.
 *
 * Progressive enhancement, by design:
 *  - SSR / no JS  → never armed → content fully visible (the calm floor).
 *  - reduced motion → never armed → visible immediately, no transition.
 *  - otherwise → armed, then shown once it enters the viewport (once only).
 *
 * The hook never hides content on its own; the hidden state exists ONLY while
 * armed, so a failure mode is always "visible", never "blank".
 */
import { useEffect, useRef, useState, type RefObject } from 'react';

export interface RevealState<T extends HTMLElement> {
  readonly ref: RefObject<T>;
  readonly armed: boolean;
  readonly shown: boolean;
}

export function useReveal<T extends HTMLElement = HTMLDivElement>(): RevealState<T> {
  const ref = useRef<T>(null);
  const [armed, setArmed] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setShown(true);
      return;
    }

    setArmed(true);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            observer.disconnect();
            break;
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.01 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  return { ref, armed, shown };
}
