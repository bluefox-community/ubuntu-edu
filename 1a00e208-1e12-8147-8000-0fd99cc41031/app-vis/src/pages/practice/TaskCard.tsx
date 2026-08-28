import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Lightbulb, ScrollText, Star } from 'lucide-react';
import TerminalBlock from '@/components/TerminalBlock';
import { renderInline } from '@/lib/inline';
import { toggleTaskDone } from '@/hooks/useProgress';
import { cn } from '@/lib/utils';
import type { FlatTask } from './useAllTasks';

function Stars({ n }: { n: number }) {
  return (
    <span className="flex items-center gap-0.5" aria-label={`сложность: ${n} из 3`}>
      {[1, 2, 3].map((i) => (
        <Star
          key={i}
          className={cn('h-3.5 w-3.5', i <= n ? 'fill-orange text-orange' : 'text-line')}
        />
      ))}
    </span>
  );
}

/** Small confetti burst (6 particles) when a task is marked done. */
function Confetti({ show }: { show: boolean }) {
  if (!show) return null;
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible">
      {angles.map((deg) => (
        <motion.span
          key={deg}
          className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
          style={{ background: deg % 120 === 0 ? '#E95420' : deg % 120 === 60 ? '#4ADE80' : '#FBBF24' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
          animate={{
            x: Math.cos((deg * Math.PI) / 180) * 34,
            y: Math.sin((deg * Math.PI) / 180) * 34 - 8,
            opacity: 0,
            scale: 0.4,
          }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      ))}
    </span>
  );
}

export default function TaskCard({ flat, done }: { flat: FlatTask; done: boolean }) {
  const reduce = useReducedMotion();
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [burst, setBurst] = useState(false);

  const onToggleDone = () => {
    const nowDone = toggleTaskDone(flat.lessonId, flat.taskIndex);
    if (nowDone && !reduce) {
      setBurst(true);
      setTimeout(() => setBurst(false), 600);
    }
  };

  const disclosure = (open: boolean, content: ReactNode) => (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          key="panel"
          initial={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          animate={reduce ? { opacity: 1 } : { height: 'auto', opacity: 1 }}
          exit={reduce ? { opacity: 0 } : { height: 0, opacity: 0 }}
          transition={{ duration: reduce ? 0.15 : 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="overflow-hidden"
        >
          <div className="pt-3">{content}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, transition: { duration: 0.15 } }}
      transition={{ duration: reduce ? 0.01 : 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={reduce ? undefined : { y: -4 }}
      className={cn(
        'flex flex-col rounded-2xl border border-line bg-aubergine-900/60 p-5 transition-shadow hover:shadow-glow',
        done && 'border-terminal-green/30',
      )}
    >
      {/* header */}
      <div className="flex items-center gap-3">
        <span className="rounded-md border border-line bg-code-bg px-2 py-0.5 font-mono text-xs font-bold text-orange">
          {String(flat.moduleNumber).padStart(2, '0')}
        </span>
        <Stars n={flat.task.difficulty} />
        <span
          className={cn(
            'ml-auto h-2.5 w-2.5 rounded-full',
            done ? 'bg-terminal-green shadow-[0_0_8px_rgba(74,222,128,0.8)]' : 'bg-muted-foreground/40',
          )}
          title={done ? 'Выполнено' : 'Не выполнено'}
        />
      </div>

      <h3 className="mt-3 font-display text-lg font-medium text-paper">{flat.task.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {renderInline(flat.task.description)}
      </p>

      {/* hint */}
      {flat.task.hint && (
        <div className="mt-4 rounded-xl border border-line bg-code-bg/60">
          <button
            type="button"
            onClick={() => setHintOpen((v) => !v)}
            className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-sm text-amber-400 transition-colors hover:bg-aubergine-700/25"
            aria-expanded={hintOpen}
          >
            <Lightbulb className="h-4 w-4 shrink-0" />
            Подсказка
            <ChevronDown className={cn('ml-auto h-4 w-4 transition-transform', hintOpen && 'rotate-180')} />
          </button>
          {disclosure(
            hintOpen,
            <p className="border-t border-line/60 px-4 pb-3 pt-3 text-sm text-muted-foreground">
              {renderInline(flat.task.hint ?? '')}
            </p>,
          )}
        </div>
      )}

      {/* solution */}
      <div className="mt-3 rounded-xl border border-line bg-code-bg/60">
        <button
          type="button"
          onClick={() => setSolutionOpen((v) => !v)}
          className="flex w-full items-center gap-2 px-4 py-2.5 text-left font-mono text-sm text-terminal-green transition-colors hover:bg-aubergine-700/25"
          aria-expanded={solutionOpen}
        >
          <ScrollText className="h-4 w-4 shrink-0" />
          Решение
          <ChevronDown className={cn('ml-auto h-4 w-4 transition-transform', solutionOpen && 'rotate-180')} />
        </button>
        {disclosure(
          solutionOpen,
          <div className="px-4 pb-4">
            <TerminalBlock code={flat.task.solution} title="эталонное решение" />
          </div>,
        )}
      </div>

      {/* footer */}
      <div className="mt-4 flex items-center justify-between border-t border-line/60 pt-4">
        <label className="relative flex cursor-pointer items-center gap-2.5 text-sm">
          <input
            type="checkbox"
            checked={done}
            onChange={onToggleDone}
            className="peer sr-only"
          />
          <span
            className={cn(
              'flex h-5 w-5 items-center justify-center rounded-md border transition-colors',
              done ? 'border-terminal-green bg-terminal-green/20' : 'border-line bg-code-bg hover:border-orange',
            )}
          >
            {done && (
              <motion.svg viewBox="0 0 12 10" className="h-3 w-3">
                <motion.path
                  d="M1 5.5 4.5 9 11 1"
                  fill="none"
                  stroke="#4ADE80"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={reduce ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            )}
          </span>
          <Confetti show={burst} />
          <span className={cn(done ? 'text-terminal-green' : 'text-muted-foreground')}>
            {done ? 'Выполнено ✓' : 'Отметить выполненным'}
          </span>
        </label>
        <Link
          to={`/lesson/${flat.lessonId}`}
          className="group font-mono text-xs text-muted-foreground transition-colors hover:text-orange"
        >
          → урок «{flat.lessonTitle.length > 28 ? `${flat.lessonTitle.slice(0, 28)}…` : flat.lessonTitle}»
          <span className="block h-px max-w-0 bg-orange transition-all duration-300 group-hover:max-w-full" />
        </Link>
      </div>
    </motion.article>
  );
}
