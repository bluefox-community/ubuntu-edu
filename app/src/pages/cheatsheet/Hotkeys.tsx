import { motion, useReducedMotion } from 'framer-motion';
import { Keyboard } from 'lucide-react';
import { terminalHotkeys } from '@/data/cheatsheet';
import { cn } from '@/lib/utils';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** «Горячие клавиши терминала» — 2-col grid of tactile kbd chips. */
export default function Hotkeys() {
  const reduce = useReducedMotion();
  return (
    <section className="mx-auto max-w-4xl" aria-label="Горячие клавиши терминала">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-orange/30 bg-orange/10">
          <Keyboard className="h-[18px] w-[18px] text-orange" />
        </span>
        <h2 className="font-display text-xl font-semibold tracking-tight text-paper sm:text-2xl">
          Горячие клавиши терминала
        </h2>
      </div>

      <motion.div
        initial={reduce ? false : 'hidden'}
        whileInView="show"
        viewport={{ once: true, margin: '-10% 0px' }}
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.04 } } }}
        className="mt-5 grid gap-2.5 sm:grid-cols-2"
      >
        {terminalHotkeys.map((hk) => (
          <motion.div
            key={hk.keys.join('+')}
            variants={{
              hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 12 },
              show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: EASE } },
            }}
            className="flex items-center gap-3 rounded-xl border border-line/60 bg-code-bg/50 px-4 py-3"
          >
            <span className="flex shrink-0 items-center gap-1">
              {hk.keys.map((k, i) => (
                <span key={i} className="flex items-center gap-1">
                  {i > 0 && <span className="text-xs text-muted-foreground">+</span>}
                  <kbd
                    className={cn(
                      'rounded-md border border-line bg-aubergine-900 px-2 py-1 font-mono text-xs font-bold text-paper',
                      'shadow-[0_2px_0_#3D2438] transition-transform hover:translate-y-[2px] hover:shadow-none',
                    )}
                  >
                    {k}
                  </kbd>
                </span>
              ))}
            </span>
            <span className="text-sm text-muted-foreground">{hk.action}</span>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
