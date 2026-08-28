import { Link, useParams } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { CheckCircle2, Clock, Compass, FlaskConical, ListChecks, Map } from 'lucide-react';
import { allLessons, findLesson } from '@/data/modules';
import { useProgress } from '@/hooks/useProgress';
import RankBadge from '@/components/RankBadge';
import TopBar from '@/pages/lesson/TopBar';
import TheoryBlocks from '@/pages/lesson/TheoryBlocks';
import Sandbox from '@/pages/lesson/Sandbox';
import Tasks from '@/pages/lesson/Tasks';
import Quiz from '@/pages/lesson/Quiz';
import LessonNav from '@/pages/lesson/LessonNav';
import Reveal, { EASE_OUT } from '@/pages/lesson/Reveal';

type EnrichedLesson = NonNullable<ReturnType<typeof findLesson>>;

function lessonNumbers(id: string): { module: number; lesson: number } {
  const m = /^m(\d+)-l(\d+)$/.exec(id);
  return m ? { module: parseInt(m[1], 10), lesson: parseInt(m[2], 10) } : { module: 0, lesson: 0 };
}

/* ------------------------- 404 state ------------------------- */

function LessonNotFound() {
  return (
    <div className="bg-[#F7F4F6]">
      <div className="mx-auto flex min-h-[60dvh] max-w-3xl flex-col items-center justify-center px-6 py-24 text-center">
        <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// 404</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-[#2C1428] sm:text-4xl">Такого урока нет</h1>
        <p className="mt-4 max-w-md leading-relaxed text-[#2C1428]/70">
          Похоже, вы опечатались в адресе — бывает даже у профессионалов. Вернитесь к программе курса и выберите урок
          оттуда.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/program"
            className="inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-5 py-2.5 font-display text-sm font-bold text-white shadow-glow-lg transition-transform hover:scale-[1.03]"
          >
            <Map className="h-4 w-4" />
            К программе курса
          </Link>
          <Link
            to={`/lesson/${allLessons[0]?.id ?? ''}`}
            className="inline-flex items-center gap-2 rounded-[10px] border border-aubergine-900/20 bg-white px-5 py-2.5 font-mono text-sm font-bold text-aubergine-700 transition-colors hover:border-orange hover:text-orange"
          >
            Первый урок
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ------------------------- lesson hero ------------------------- */

function LessonHero({ lesson }: { lesson: EnrichedLesson }) {
  const reduced = useReducedMotion();
  const words = lesson.title.split(' ');
  const plan = lesson.blocks
    .filter((b) => b.type === 'heading')
    .slice(0, 5)
    .map((b) => (b as { text: string }).text);

  const chipAnim = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          transition: { duration: 0.35, delay: 0.07 * i, ease: EASE_OUT },
        };

  return (
    <header className="mx-auto max-w-3xl px-6 pb-14 pt-16 lg:px-8">
      {/* chips row */}
      <div className="flex flex-wrap items-center gap-2.5">
        <motion.span
          {...chipAnim(0)}
          className="rounded-[10px] bg-aubergine-900 px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-paper"
        >
          Модуль {String(lesson.moduleNumber).padStart(2, '0')}
        </motion.span>
        <motion.span {...chipAnim(1)}>
          <RankBadge rank={lesson.rank} />
        </motion.span>
        <motion.span
          {...chipAnim(2)}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#E1D3DD] bg-white/70 px-2.5 py-1 font-mono text-xs font-bold text-[#2C1428]/80"
        >
          <Clock className="h-3.5 w-3.5 text-orange" />
          ~{lesson.minutes} мин
        </motion.span>
        <motion.span
          {...chipAnim(3)}
          className="inline-flex items-center gap-1.5 rounded-[10px] border border-[#E1D3DD] bg-white/70 px-2.5 py-1 font-mono text-xs font-bold text-[#2C1428]/80"
        >
          <ListChecks className="h-3.5 w-3.5 text-orange" />
          {lesson.tasks.length} {lesson.tasks.length === 1 ? 'задание' : lesson.tasks.length < 5 ? 'задания' : 'заданий'}
        </motion.span>
      </div>

      {/* H1 — word-split rise */}
      <h1 className="mt-6 font-display text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-[-0.02em] text-[#2C1428]">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom">
            <motion.span
              className="inline-block"
              initial={reduced ? false : { y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.55, delay: 0.15 + i * 0.06, ease: EASE_OUT }}
            >
              {word}
              {i < words.length - 1 ? '\u00A0' : ''}
            </motion.span>
          </span>
        ))}
      </h1>

      {/* lead */}
      <motion.p
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
        className="mt-5 max-w-[68ch] text-lg leading-relaxed text-[#2C1428]/75"
      >
        {lesson.intro}
      </motion.p>

      {/* lesson plan checklist (derived from the lesson's own headings) */}
      {plan.length > 0 && (
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45, ease: EASE_OUT }}
          className="mt-8 rounded-2xl border border-[#E1D3DD] bg-white/70 p-5 shadow-[0_10px_36px_rgba(26,10,30,0.08)] sm:p-6"
        >
          <p className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">
            <Compass className="h-4 w-4" />
            В этом уроке
          </p>
          <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
            {plan.map((item, i) => (
              <motion.li
                key={i}
                initial={reduced ? false : { opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.55 + i * 0.1, ease: EASE_OUT }}
                className="flex items-start gap-2.5 text-[0.95rem] leading-snug text-[#2C1428]/85"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-terminal-green" />
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </header>
  );
}

/* ------------------------- page ------------------------- */

export default function Lesson() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const lesson = lessonId ? findLesson(lessonId) : undefined;
  const progress = useProgress();

  if (!lesson) return <LessonNotFound />;

  const lessonIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prev = lessonIndex > 0 ? allLessons[lessonIndex - 1] : undefined;
  const next = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : undefined;
  const nums = lessonNumbers(lesson.id);

  return (
    <div className="bg-[#F7F4F6] text-[#2C1428]">
      <TopBar
        moduleNumber={lesson.moduleNumber}
        lessonNumber={nums.lesson}
        lessonIndex={lessonIndex}
        totalLessons={allLessons.length}
        percent={progress.percent}
      />

      <LessonHero lesson={lesson} />

      {/* Section 2 — Теория */}
      <section id="theory" className="scroll-mt-32 border-t border-[#E1D3DD]">
        <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
          <Reveal>
            <p className="mb-8 font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// теория</p>
          </Reveal>
          <TheoryBlocks blocks={lesson.blocks} />
        </div>
      </section>

      {/* Section 3 — мини-песочница */}
      <section id="sandbox" className="scroll-mt-32 border-t border-[#E1D3DD]">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <Reveal>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// попробуйте сами</p>
            <h2 className="mt-2 font-display text-[clamp(1.75rem,3.5vw,2.25rem)] font-bold tracking-[-0.01em] text-[#2C1428]">
              Мини-песочница: попробуйте прямо здесь
            </h2>
            <div className="mt-5 flex items-start gap-3 rounded-xl border border-orange/30 bg-orange/[0.07] px-4 py-3.5">
              <FlaskConical className="mt-0.5 h-5 w-5 shrink-0 text-orange" />
              <p className="text-[0.95rem] leading-relaxed text-[#2C1428]/85">
                Не обязательно ставить Ubuntu, чтобы попробовать! Это игрушечный терминал: он понимает несколько
                настоящих команд. Введите <code className="code-inline">ls</code> и нажмите Enter — а если
                растерялись, напишите <code className="code-inline">help</code>.
              </p>
            </div>
          </Reveal>
          <div className="mt-6">
            <Sandbox />
          </div>
        </div>
      </section>

      {/* Section 4 — Задания */}
      <section id="tasks" className="scroll-mt-32 border-t border-[#E1D3DD]">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <Tasks
            tasks={lesson.tasks}
            lessonId={lesson.id}
            isTaskDone={progress.isTaskDone}
            toggleTaskDone={progress.toggleTaskDone}
          />
        </div>
      </section>

      {/* Section 5 — Самопроверка */}
      <section id="quiz" className="scroll-mt-32 border-t border-[#E1D3DD]">
        <div className="mx-auto max-w-3xl px-6 py-16 lg:px-8">
          <Quiz
            quiz={lesson.quiz}
            lessonId={lesson.id}
            savedResult={progress.state.quizResults[lesson.id]}
            setQuizResult={progress.setQuizResult}
          />
        </div>
      </section>

      {/* Section 6 — навигация */}
      <LessonNav
        lessonId={lesson.id}
        prev={prev}
        next={next}
        completed={progress.isLessonComplete(lesson.id)}
        onToggleComplete={progress.toggleLessonComplete}
      />
    </div>
  );
}
