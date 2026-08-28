import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/** Design easing: cubic-bezier(0.22, 1, 0.36, 1) (design.md §6). */
export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Breadcrumb that types itself, Ubuntu Mono, 30ms/char. Respects reduced motion. */
export function TypedBreadcrumb({ text, className }: { text: string; className?: string }) {
  const [typed, setTyped] = useState('');

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(text);
      return;
    }
    setTyped('');
    let i = 0;
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const typeNext = () => {
      if (cancelled) return;
      i += 1;
      setTyped(text.slice(0, i));
      if (i < text.length) timers.push(setTimeout(typeNext, 30));
    };
    timers.push(setTimeout(typeNext, 200));
    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [text]);

  return (
    <p className={cn('font-mono text-sm text-muted-foreground', className)} aria-label={text}>
      <span aria-hidden="true">{typed}</span>
      <span
        aria-hidden="true"
        className={cn('ml-0.5 inline-block animate-blink text-orange', typed.length === text.length && 'invisible')}
      >
        ▮
      </span>
    </p>
  );
}

/** Headline revealed word-by-word: rise 40px, stagger 0.06s. Falls back to a fade for reduced motion. */
export function WordRise({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const words = text.split(' ');

  if (reduced) {
    return (
      <motion.span
        className={className}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay }}
      >
        {text}
      </motion.span>
    );
  }

  return (
    <span className={className}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
          <motion.span
            className="inline-block will-change-transform"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-10% 0px' }}
            transition={{ duration: 0.6, ease: EASE, delay: delay + 0.06 * i }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/** Standard scroll reveal: slide up 40px + fade, trigger at ~15% viewport. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
