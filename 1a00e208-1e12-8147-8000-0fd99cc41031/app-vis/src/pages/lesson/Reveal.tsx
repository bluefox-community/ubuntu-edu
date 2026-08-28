import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/**
 * Scroll-reveal wrapper: slides up 24px and fades in when entering the viewport.
 * With prefers-reduced-motion the content is shown instantly (opacity only).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
