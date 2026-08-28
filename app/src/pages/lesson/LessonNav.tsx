import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router';
import { ArrowLeft, ArrowRight, CheckCircle2, ListChecks, PartyPopper } from 'lucide-react';
import type { allLessons } from '@/data/modules';
import { cn } from '@/lib/utils';
import { EASE_OUT } from '@/pages/lesson/Reveal';

type LessonEntry = (typeof allLessons)[number];

function NavButton({ lesson, dir }: { lesson?: LessonEntry; dir: 'prev' | 'next' }) {
  if (!lesson) return <span className="hidden flex-1 sm:block" />;
  const Icon = dir === 'prev' ? ArrowLeft : ArrowRight;
  return (
    <Link
      to={`/lesson/${lesson.id}`}
      className={cn(
        'group flex min-w-0 flex-1 items-center gap-3 rounded-[10px] border border-line px-4 py-3 transition-all duration-200 hover:border-orange hover:shadow-glow',
        dir === 'next' && 'flex-row-reverse text-right',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-orange transition-transform duration-200 group-hover:scale-110" />
      <span className="min-w-0 flex-1">
        <span className="block truncate font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          {dir === 'prev' ? '← предыдущий' : 'следующий →'}
        </span>
        <span className="block truncate font-display text-sm font-bold text-paper transition-colors group-hover:text-orange">
          {lesson.title}
        </span>
      </span>
    </Link>
  );
}

/** Lesson navigation footer: complete-toggle + prev/next + back to program. */
export default function LessonNav({
  lessonId,
  prev,
  next,
  completed,
  onToggleComplete,
}: {
  lessonId: string;
  prev?: LessonEntry;
  next?: LessonEntry;
  completed: boolean;
  onToggleComplete: (lessonId: string) => boolean;
}) {
  const reduced = useReducedMotion();

  const slide = (x: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, x },
          whileInView: { opacity: 1, x: 0 },
          viewport: { once: true, amount: 0.4 },
          transition: { duration: 0.5, ease: EASE_OUT },
        };

  return (
    <section className="border-t border-line bg-aubergine-900">
      <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
        {/* mark lesson complete */}
        <motion.div {...slide(0)} className="mb-10 text-center">
          <motion.button
            type="button"
            onClick={() => onToggleComplete(lessonId)}
            whileTap={reduced ? undefined : { scale: 0.97 }}
            aria-pressed={completed}
            className={cn(
              'inline-flex items-center gap-2.5 rounded-[10px] px-6 py-3.5 font-display text-base font-bold transition-all duration-200',
              completed
                ? 'border border-terminal-green/50 bg-terminal-green/15 text-terminal-green'
                : 'bg-gradient-to-br from-orange to-orange-soft text-white shadow-glow-lg hover:scale-[1.03]',
            )}
          >
            {completed ? <PartyPopper className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
            {completed ? 'Урок пройден — отличная работа!' : 'Отметить урок пройденным'}
          </motion.button>
          <p className="mt-3 font-mono text-xs text-muted-foreground">
            {completed
              ? 'прогресс сохранён — можно снять отметку, нажав ещё раз'
              : 'кнопка сохранит прогресс в вашем браузере'}
          </p>
        </motion.div>

        {/* prev / next / program */}
        <div className="flex flex-col items-stretch gap-3 sm:flex-row">
          <motion.div {...slide(-24)} className="flex min-w-0 flex-1">
            <NavButton lesson={prev} dir="prev" />
          </motion.div>
          <motion.div {...slide(0)} className="flex items-center justify-center">
            <Link
              to="/program"
              className="flex items-center gap-2 rounded-[10px] border border-line px-4 py-3 font-mono text-xs font-bold text-muted-foreground transition-colors hover:border-orange hover:text-orange"
            >
              <ListChecks className="h-4 w-4" />
              к программе курса →
            </Link>
          </motion.div>
          <motion.div {...slide(24)} className="flex min-w-0 flex-1">
            <NavButton lesson={next} dir="next" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
