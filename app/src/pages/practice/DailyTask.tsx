import { useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { CalendarClock, Dices, Eye, EyeOff, Star } from 'lucide-react';
import TerminalBlock from '@/components/TerminalBlock';
import { renderInline } from '@/lib/inline';
import { dailyTaskIndex, type FlatTask } from './useAllTasks';

/** «Задание дня»: детерминированный выбор по дате + кнопка «Другое задание». */
export default function DailyTask({ tasks }: { tasks: FlatTask[] }) {
  const reduce = useReducedMotion();
  const baseIndex = useMemo(() => dailyTaskIndex(new Date(), tasks.length), [tasks.length]);
  const [offset, setOffset] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);

  if (tasks.length === 0) return null;
  const flat = tasks[(baseIndex + offset) % tasks.length];

  const shuffle = () => {
    setOffset((o) => o + 1 + Math.floor(Math.random() * (tasks.length - 1)));
    setRevealed(false);
    setShakeKey((k) => k + 1);
  };

  return (
    <motion.section
      initial={reduce ? { opacity: 0 } : { opacity: 0, y: 30 }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-line border-l-4 border-l-orange bg-aubergine-900 p-6 sm:p-8"
      aria-label="Задание дня"
    >
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-[10px] border border-orange/40 bg-orange/10 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-orange">
          <CalendarClock className="h-3.5 w-3.5" />
          задание дня
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          модуль {String(flat.moduleNumber).padStart(2, '0')} ·{' '}
          {Array.from({ length: flat.task.difficulty }).map((_, i) => (
            <Star key={i} className="inline h-3 w-3 fill-orange text-orange" />
          ))}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={flat.key}
          initial={reduce ? { opacity: 0 } : { opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
          transition={{ duration: 0.3 }}
          className="mt-4"
        >
          <h3 className="font-display text-xl font-medium text-paper">{flat.task.title}</h3>
          <p className="mt-2 max-w-3xl leading-relaxed text-muted-foreground">
            {renderInline(flat.task.description)}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setRevealed((v) => !v)}
              className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-4 py-2 font-mono text-sm font-bold text-paper transition-transform hover:scale-[1.03] hover:shadow-glow-lg"
            >
              {revealed ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {revealed ? 'Скрыть ответ' : 'Показать ответ'}
            </button>
            <motion.button
              key={shakeKey}
              type="button"
              onClick={shuffle}
              initial={shakeKey > 0 && !reduce ? { x: 0 } : false}
              animate={shakeKey > 0 && !reduce ? { x: [0, -4, 4, -3, 3, 0] } : undefined}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-code-bg px-4 py-2 font-mono text-sm text-muted-foreground transition-colors hover:border-aubergine-700 hover:text-paper"
            >
              <Dices className="h-4 w-4" />
              Другое задание
            </motion.button>
          </div>

          <AnimatePresence initial={false}>
            {revealed && (
              <motion.div
                key="answer"
                initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
                exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <TerminalBlock code={flat.task.solution} title="ответ" className="mt-4" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </motion.section>
  );
}
