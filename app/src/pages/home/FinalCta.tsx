import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';

const HEADLINE = '$ start learning --now';

export default function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState('');

  // Type the headline on scroll into view
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setTyped(HEADLINE);
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || typed) return;
        let i = 0;
        const typeNext = () => {
          i += 1;
          setTyped(HEADLINE.slice(0, i));
          if (i < HEADLINE.length) timers.push(setTimeout(typeNext, 40));
        };
        typeNext();
        observer.disconnect();
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      timers.forEach(clearTimeout);
      timers = [];
    };
  }, [typed]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden py-20 lg:py-28"
      style={{ background: 'linear-gradient(135deg, #E95420 0%, #77216F 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'url(/path-bg-texture.svg)', backgroundSize: '400px' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <p className="font-mono text-lg text-paper/90 sm:text-xl">
          {typed}
          <span className="ml-1 inline-block animate-blink">▮</span>
        </p>
        <h2 className="mt-4 font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3.5rem)]">
          Ваш первый урок ждёт
        </h2>
        <motion.div
          animate={{ scale: [1, 1.03, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-9 inline-block"
        >
          <Link
            to="/lesson/m01-l01"
            className="inline-block rounded-[10px] bg-paper px-8 py-4 font-mono text-lg font-bold text-aubergine-900 shadow-glow-lg transition-transform duration-200 hover:scale-105"
          >
            Начать бесплатно
          </Link>
        </motion.div>
        <p className="mt-6 font-mono text-sm text-paper/80">Без регистрации. Без оплаты. Без оправданий.</p>
      </div>
    </section>
  );
}
