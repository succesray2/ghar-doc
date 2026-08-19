import { useEffect, useRef, useState } from 'react';

const FALLBACK_MS = 1500;

/**
 * Tracks whether an element has scrolled into view, once. Used to drive the
 * `.reveal` fade/slide-up CSS transition — kept as a plain IntersectionObserver
 * hook rather than pulling in an animation library for what's fundamentally a
 * one-shot visibility flag.
 *
 * A timeout fallback forces visibility regardless of the observer outcome.
 * This isn't just for missing IntersectionObserver support — full-page
 * capture tools (screenshotting, some PDF/print paths) resize the viewport
 * without ever dispatching the scroll/resize sequence the observer expects,
 * which would otherwise leave real content permanently invisible. On a site
 * built to establish trust, content silently failing to appear is worse than
 * the animation not playing, so the fallback always wins eventually.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fallback = window.setTimeout(() => setIsVisible(true), FALLBACK_MS);

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
          window.clearTimeout(fallback);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  return { ref, isVisible };
}
