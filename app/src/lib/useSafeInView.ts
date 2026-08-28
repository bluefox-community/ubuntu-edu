import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import type { UseInViewOptions } from 'framer-motion';

/**
 * framer-motion's useInView(once) + safety net for instant navigations.
 *
 * After a route change or an anchor jump (e.g. /program#module-05) the
 * IntersectionObserver callback can be lost, leaving `whileInView` content
 * stuck in its hidden initial state (invisible / shifted). If the element is
 * inside the viewport shortly after mount but the observer hasn't fired,
 * we force the revealed state. Below-the-fold content is NOT forced, so the
 * normal scroll-reveal experience is preserved.
 */
export function useSafeInView<T extends HTMLElement = HTMLDivElement>(
  options?: UseInViewOptions,
  fallbackMs = 700,
) {
  const ref = useRef<T | null>(null);
  const inView = useInView(ref, { once: true, ...options });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (inView || forced) return;
    const timer = setTimeout(() => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const visible = rect.bottom > 0 && rect.top < vh && rect.right > 0 && rect.left < vw;
      if (visible) setForced(true);
    }, fallbackMs);
    return () => clearTimeout(timer);
  }, [inView, forced, fallbackMs]);

  return { ref, shown: inView || forced };
}
