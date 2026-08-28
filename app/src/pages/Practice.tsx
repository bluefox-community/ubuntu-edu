import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { BookOpen, Flame, ListChecks, Quote, SearchX } from 'lucide-react';
import { useProgress } from '@/hooks/useProgress';
import FilterBar from './practice/FilterBar';
import TaskCard from './practice/TaskCard';
import DailyTask from './practice/DailyTask';
import ProgressDonut from './practice/ProgressDonut';
import { filterTasks, useAllTasks, type TaskFilters } from './practice/useAllTasks';
import { useSafeInView } from '@/lib/useSafeInView';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function Practice() {
  const reduce = useReducedMotion();
  const tasks = useAllTasks();
  const { isTaskDone } = useProgress();
  const [filters, setFilters] = useState<TaskFilters>({
    moduleId: 'all',
    difficulties: [],
    status: 'all',
    query: '',
  });

  const doneCount = useMemo(
    () => tasks.filter((t) => isTaskDone(t.lessonId, t.taskIndex)).length,
    [tasks, isTaskDone],
  );
  const visible = useMemo(
    () => filterTasks(tasks, filters, isTaskDone),
    [tasks, filters, isTaskDone],
  );

  // Demo streak: упрощённый показатель — есть ли активность вообще
  const streak = doneCount > 0 ? 1 : 0;

  // Safe in-view for the x-offset cards below (fallback if observer callback
  // is lost after an instant navigation — content must never stay shifted).
  const quoteCard = useSafeInView<HTMLElement>({ once: true, margin: '-15% 0px' });
  const ctaCard = useSafeInView<HTMLDivElement>({ once: true, margin: '-15% 0px' });

  return (
    <div>
      {/* Section 1 — Page Hero */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center lg:px-8">
        <p className="font-mono text-sm text-muted-foreground">~/практика</p>
        <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// тренажёр</p>
        <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-paper sm:text-5xl">
          <WordSplit text="Практика — 80% успеха" reduce={reduce ?? false} />
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.4, duration: 0.5 }}
          className="mx-auto mt-5 max-w-2xl leading-relaxed text-muted-foreground"
        >
          Более {tasks.length} заданий — от «введите одну команду» до «настройте сервер». Каждое — с подсказкой
          и эталонным решением. Ошибаться здесь не страшно — страшно не пробовать.
        </motion.p>

        {/* stats row */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ delay: reduce ? 0 : 0.55, duration: 0.5, ease: EASE }}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <ProgressDonut done={doneCount} total={tasks.length} />
          <div className="text-left">
            <p className="font-mono text-sm text-muted-foreground">
              выполнено{' '}
              <span className="font-bold text-paper">
                {doneCount}/{tasks.length}
              </span>
            </p>
            <motion.span
              initial={reduce ? { opacity: 0 } : { scale: 0.8, opacity: 0 }}
              animate={reduce ? { opacity: 1 } : { scale: 1, opacity: 1 }}
              transition={{ delay: reduce ? 0 : 0.8, type: 'spring', stiffness: 300, damping: 18 }}
              className="mt-2 inline-flex items-center gap-1.5 rounded-[10px] border border-line bg-aubergine-900 px-2.5 py-1 font-mono text-xs text-muted-foreground"
            >
              <Flame className="h-3.5 w-3.5 text-orange" />
              серия: {streak} {pluralDays(streak)}
            </motion.span>
          </div>
        </motion.div>
      </section>

      {/* Section 2 — Sticky filter bar */}
      <FilterBar filters={filters} onChange={setFilters} />

      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section 4 — «Задание дня» над гридом */}
        <div className="pt-10">
          <DailyTask tasks={tasks} />
        </div>

        {/* Section 3 — Task grid */}
        <section className="py-12" aria-label="Список заданий">
          {visible.length === 0 ? (
            <div className="mx-auto max-w-md py-20 text-center">
              <SearchX className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-4 font-mono text-lg text-paper">grep: совпадений не найдено</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Попробуйте ослабить фильтры или изменить запрос.
              </p>
              <button
                type="button"
                onClick={() => setFilters({ moduleId: 'all', difficulties: [], status: 'all', query: '' })}
                className="mt-5 rounded-[10px] border border-orange/50 px-4 py-2 font-mono text-sm text-orange transition-colors hover:bg-orange/10"
              >
                Сбросить фильтры
              </button>
            </div>
          ) : (
            <motion.div layout className="grid gap-5 lg:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {visible.map((flat) => (
                  <TaskCard
                    key={flat.key}
                    flat={flat}
                    done={isTaskDone(flat.lessonId, flat.taskIndex)}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </section>

        {/* Section 5 — Motivation strip + CTA (overflow-x-clip: cards enter with x-offset via whileInView) */}
        <section className="grid gap-5 overflow-x-clip pb-20 md:grid-cols-2">
          <motion.figure
            ref={quoteCard.ref}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: -30 }}
            animate={quoteCard.shown ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: EASE }}
            className="rounded-2xl border border-line bg-aubergine-900/60 p-6 sm:p-8"
          >
            <Quote className="h-6 w-6 text-orange" />
            <blockquote className="mt-4 font-display text-lg leading-relaxed text-paper">
              «Сначала я гуглил каждую команду. Через 40 заданий — писал их с закрытыми глазами.»
            </blockquote>
            <figcaption className="mt-3 font-mono text-sm text-muted-foreground">— ученик курса</figcaption>
          </motion.figure>

          <motion.div
            ref={ctaCard.ref}
            initial={reduce ? { opacity: 0 } : { opacity: 0, x: 30 }}
            animate={ctaCard.shown ? { opacity: 1, x: 0 } : undefined}
            transition={{ duration: 0.5, ease: EASE, delay: reduce ? 0 : 0.1 }}
            className="flex flex-col justify-center gap-4 rounded-2xl border border-line bg-aubergine-900/60 p-6 sm:p-8"
          >
            <p className="font-display text-lg font-medium text-paper">Застряли? Это нормально.</p>
            <CtaLink to="/program" icon={<BookOpen className="h-4 w-4" />} label="Вернитесь к теории → программа курса" />
            <CtaLink to="/cheatsheet" icon={<ListChecks className="h-4 w-4" />} label="Сверьтесь со шпаргалкой команд" />
          </motion.div>
        </section>
      </div>
    </div>
  );
}

function pluralDays(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'день';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'дня';
  return 'дней';
}

function WordSplit({ text, reduce }: { text: string; reduce: boolean }) {
  const words = text.split(' ');
  if (reduce) return <>{text}</>;
  return (
    <>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i, duration: 0.5, ease: EASE }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </>
  );
}

function CtaLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2.5 font-mono text-sm text-orange transition-colors hover:text-orange-soft"
    >
      {icon}
      <span className="relative">
        {label}
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-orange transition-all duration-300 group-hover:w-full" />
      </span>
    </Link>
  );
}
