import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check, ChevronDown, Lightbulb, Star, TerminalSquare } from 'lucide-react';
import TerminalBlock from '@/components/TerminalBlock';
import ProgressBar from '@/components/ProgressBar';
import { renderInline } from '@/lib/inline';
import { cn } from '@/lib/utils';
import type { Task } from '@/data/types';
import Reveal, { EASE_OUT } from '@/pages/lesson/Reveal';

const DIFFICULTY_LABEL: Record<1 | 2 | 3, string> = { 1: 'легко', 2: 'средне', 3: 'сложно' };

/** Confetti micro-burst of 6 orange/green particles when a task is checked. */
function ConfettiBurst({ seed }: { seed: number }) {
  const reduced = useReducedMotion();
  if (reduced || seed === 0) return null;
  const angles = [0, 60, 120, 180, 240, 300];
  return (
    <span key={seed} className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden>
      {angles.map((deg, i) => {
        const rad = (deg * Math.PI) / 180;
        return (
          <motion.span
            key={i}
            className={cn('absolute h-1.5 w-1.5 rounded-full', i % 2 === 0 ? 'bg-orange' : 'bg-terminal-green')}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: Math.cos(rad) * 26, y: Math.sin(rad) * 26, opacity: 0, scale: 0.4 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
          />
        );
      })}
    </span>
  );
}

/** Expandable panel with a Framer Motion height animation. */
function Expandable({
  open,
  id,
  children,
}: {
  open: boolean;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          id={id}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE_OUT }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function TaskCard({
  task,
  index,
  lessonId,
  done,
  onToggle,
}: {
  task: Task;
  index: number;
  lessonId: string;
  done: boolean;
  onToggle: (lessonId: string, index: number) => boolean;
}) {
  const [hintOpen, setHintOpen] = useState(false);
  const [solutionOpen, setSolutionOpen] = useState(false);
  const [burst, setBurst] = useState(0);

  const handleToggle = () => {
    const nowDone = onToggle(lessonId, index);
    if (nowDone) setBurst((b) => b + 1);
  };

  return (
    <div
      className={cn(
        'rounded-2xl border bg-white/70 p-5 shadow-[0_10px_36px_rgba(26,10,30,0.08)] transition-colors sm:p-6',
        done ? 'border-terminal-green/50' : 'border-[#E1D3DD]',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5" title={`Сложность: ${DIFFICULTY_LABEL[task.difficulty]}`}>
              {[1, 2, 3].map((s) => (
                <Star
                  key={s}
                  className={cn(
                    'h-4 w-4',
                    s <= task.difficulty ? 'fill-orange text-orange' : 'fill-transparent text-[#C9B8C4]',
                  )}
                />
              ))}
            </span>
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[#8A7484]">
              задание {index + 1} · {DIFFICULTY_LABEL[task.difficulty]}
            </span>
          </div>
          <h3 className="mt-1.5 font-display text-lg font-bold text-[#2C1428]">{task.title}</h3>
        </div>

        {/* done checkbox */}
        <label className="relative flex cursor-pointer select-none items-center gap-2.5">
          <input type="checkbox" checked={done} onChange={handleToggle} className="peer sr-only" />
          <span
            className={cn(
              'relative flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all duration-200',
              done
                ? 'border-terminal-green bg-terminal-green text-aubergine-950'
                : 'border-[#C9B8C4] bg-transparent text-transparent peer-hover:border-orange',
            )}
          >
            <Check className="h-4 w-4" strokeWidth={3.5} />
            <ConfettiBurst seed={burst} />
          </span>
          <span className={cn('font-mono text-sm font-bold', done ? 'text-[#1E7A46]' : 'text-[#8A7484]')}>
            {done ? 'Выполнено' : 'Отметить выполненным'}
          </span>
        </label>
      </div>

      <p className="mt-3 leading-relaxed text-[#2C1428]/85 [&_strong]:!text-current">{renderInline(task.description)}</p>

      {/* hint accordion */}
      {task.hint && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => setHintOpen((v) => !v)}
            aria-expanded={hintOpen}
            aria-controls={`hint-${index}`}
            className="flex items-center gap-2 rounded-[10px] border border-amber-400/50 bg-amber-400/10 px-3 py-2 font-mono text-sm font-bold text-[#96660A] transition-colors hover:bg-amber-400/20"
          >
            <Lightbulb className="h-4 w-4" />
            Подсказка
            <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', hintOpen && 'rotate-180')} />
          </button>
          <Expandable open={hintOpen} id={`hint-${index}`}>
            <p className="mt-2 rounded-[10px] border-l-[3px] border-amber-400 bg-amber-400/10 px-4 py-3 text-sm leading-relaxed text-[#2C1428]/85 [&_strong]:!text-current">
              {renderInline(task.hint)}
            </p>
          </Expandable>
        </div>
      )}

      {/* solution */}
      <div className="mt-4">
        <button
          type="button"
          onClick={() => setSolutionOpen((v) => !v)}
          aria-expanded={solutionOpen}
          aria-controls={`solution-${index}`}
          className="flex items-center gap-2 rounded-[10px] border border-aubergine-900/20 bg-aubergine-900/[0.06] px-3 py-2 font-mono text-sm font-bold text-aubergine-700 transition-colors hover:bg-aubergine-900/10"
        >
          <TerminalSquare className="h-4 w-4" />
          {solutionOpen ? 'Скрыть решение' : 'Показать решение'}
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', solutionOpen && 'rotate-180')} />
        </button>
        <Expandable open={solutionOpen} id={`solution-${index}`}>
          <div className="mt-2">
            <TerminalBlock code={task.solution} title={`решение · задание ${index + 1}`} />
            <p className="mt-2 font-mono text-xs text-[#8A7484]">
              сначала попробуйте сами — решение для самопроверки
            </p>
          </div>
        </Expandable>
      </div>
    </div>
  );
}

export default function Tasks({
  tasks,
  lessonId,
  isTaskDone,
  toggleTaskDone,
}: {
  tasks: Task[];
  lessonId: string;
  isTaskDone: (lessonId: string, index: number) => boolean;
  toggleTaskDone: (lessonId: string, index: number) => boolean;
}) {
  const doneCount = tasks.filter((_, i) => isTaskDone(lessonId, i)).length;

  return (
    <div>
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// практика</p>
            <h2 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.01em] text-[#2C1428]">
              Задания
            </h2>
          </div>
          <span className="rounded-[10px] border border-[#E1D3DD] bg-white/70 px-3 py-1.5 font-mono text-xs text-[#8A7484]">
            отмечайте выполненные
          </span>
        </div>
        <div className="mt-5 max-w-xs">
          <ProgressBar
            value={tasks.length ? Math.round((doneCount / tasks.length) * 100) : 0}
            label={`выполнено: ${doneCount}/${tasks.length}`}
          />
        </div>
      </Reveal>

      <div className="mt-8 space-y-5">
        {tasks.map((task, i) => (
          <Reveal key={i} delay={Math.min(i * 0.08, 0.3)}>
            <TaskCard task={task} index={i} lessonId={lessonId} done={isTaskDone(lessonId, i)} onToggle={toggleTaskDone} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}
