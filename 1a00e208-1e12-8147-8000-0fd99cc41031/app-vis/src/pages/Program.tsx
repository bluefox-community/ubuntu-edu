import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Check,
  CheckCircle2,
  Clock,
  Flag,
  PenLine,
  Terminal,
  Wrench,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import ProgressBar from '@/components/ProgressBar';
import { useProgress } from '@/hooks/useProgress';
import { modules, allLessons } from '@/data/modules';
import { EASE, Reveal, TypedBreadcrumb, WordRise } from './program/motion';
import ModuleBlock from './program/ModuleBlock';

const TOTAL_MINUTES = allLessons.reduce((sum, l) => sum + l.minutes, 0);
const TOTAL_HOURS = Math.round(TOTAL_MINUTES / 60);
const TOTAL_TASKS = allLessons.reduce((sum, l) => sum + l.tasks.length, 0);

const LEGEND: { Icon: LucideIcon; title: string; text: string }[] = [
  { Icon: BookOpen, title: 'Теория', text: 'объяснения простыми словами, без жаргона' },
  { Icon: Terminal, title: 'Практика в терминале', text: 'повторяете за уроком шаг в шаг' },
  { Icon: PenLine, title: 'Задания', text: 'закрепляете сами, есть подсказки и решения' },
  { Icon: CheckCircle2, title: 'Самопроверка', text: 'короткий квиз в конце каждого урока' },
];

const FIT_YES = [
  'никогда не видели Linux',
  'хотите в IT, DevOps или администрирование',
  'устали от Windows — и вам любопытно',
  'нужно для работы или учёбы',
];

const FIT_NO = [
  'вы уже пишете драйверы ядра',
  'хотите «магическую пилюлю» без практики',
  'нужна только красивая картинка для резюме',
];

function MetaChips() {
  const chips: { Icon: LucideIcon; label: string }[] = [
    { Icon: Clock, label: `~${TOTAL_HOURS} часов` },
    { Icon: BookOpen, label: `${allLessons.length} уроков` },
    { Icon: Wrench, label: `${TOTAL_TASKS}+ заданий` },
    { Icon: Flag, label: 'финальный проект' },
  ];
  return (
    <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
      {chips.map(({ Icon, label }, i) => (
        <motion.span
          key={label}
          className="inline-flex items-center gap-2 rounded-[10px] border border-line bg-aubergine-900 px-3.5 py-2 font-mono text-sm text-paper/90"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.5 + 0.08 * i }}
        >
          <Icon className="h-4 w-4 text-orange" />
          {label}
        </motion.span>
      ))}
    </div>
  );
}

function Hero() {
  const { percent } = useProgress();
  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <TypedBreadcrumb text="~/курс/программа" className="inline-block" />
        <p className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">
          {'// полная программа'}
        </p>
        <h1 className="mt-4 font-display font-bold tracking-[-0.02em] text-paper [font-size:clamp(2.25rem,5vw,4rem)] [line-height:1.1]">
          <WordRise text="От «что такое Linux?» до своего сервера" delay={0.15} />
        </h1>
        <Reveal delay={0.4} y={24}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {modules.length} модулей, {allLessons.length} уроков, более {TOTAL_TASKS} практических заданий. Каждый
            шаг логично следует из предыдущего — вы никогда не окажетесь перед материалом, к которому не готовы.
          </p>
        </Reveal>
        <MetaChips />
        <Reveal delay={0.7} y={16} className="mx-auto mt-10 max-w-md">
          <ProgressBar value={percent} label="ваш прогресс по курсу" />
        </Reveal>
      </div>
    </section>
  );
}

function Legend() {
  const reduced = useReducedMotion();
  return (
    <section className="border-t border-line py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center font-display text-2xl font-bold tracking-[-0.01em] text-paper sm:text-3xl">
            Как устроен каждый урок
          </h2>
        </Reveal>
        <motion.div
          className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15% 0px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
        >
          {LEGEND.map(({ Icon, title, text }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="group rounded-2xl border border-line bg-aubergine-900 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange/50 hover:shadow-glow"
            >
              <motion.span
                className="inline-flex h-11 w-11 items-center justify-center rounded-[10px] border border-orange/40 bg-orange/10 text-orange"
                whileHover={reduced ? undefined : { rotate: [0, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Icon className="h-5 w-5" />
              </motion.span>
              <h3 className="mt-4 font-display text-lg font-bold text-paper">{title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ForWhom() {
  const reduced = useReducedMotion();
  const card = (
    title: string,
    items: string[],
    positive: boolean,
  ) => (
    <motion.div
      initial={reduced ? { opacity: 0 } : { opacity: 0, x: positive ? -40 : 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-15% 0px' }}
      transition={{ duration: 0.7, ease: EASE }}
      className={
        positive
          ? 'rounded-2xl border border-terminal-green/30 bg-terminal-green/5 p-6 sm:p-8'
          : 'rounded-2xl border border-line bg-aubergine-900 p-6 sm:p-8'
      }
    >
      <h3
        className={
          positive
            ? 'font-display text-xl font-bold text-terminal-green'
            : 'font-display text-xl font-bold text-muted-foreground'
        }
      >
        {title}
      </h3>
      <ul className="mt-5 space-y-3">
        {items.map((item, i) => (
          <motion.li
            key={item}
            className="flex items-start gap-3 text-paper/90"
            initial={{ opacity: 0, y: reduced ? 0 : 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, ease: EASE, delay: 0.3 + 0.08 * i }}
          >
            <motion.span
              initial={reduced ? { opacity: 0 } : { scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.35 + 0.08 * i }}
              className={
                positive
                  ? 'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-terminal-green/15 text-terminal-green'
                  : 'mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-error/15 text-error'
              }
            >
              {positive ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
            </motion.span>
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );

  return (
    // overflow-x-clip: cards enter with x-offset via whileInView — clip avoids temporary horizontal overflow
    <section className="overflow-x-clip border-t border-line py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-8">
        <Reveal>
          <h2 className="text-center font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(1.75rem,3.5vw,2.5rem)]">
            Честно: кому подойдёт, а кому — нет
          </h2>
        </Reveal>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {card('Подойдёт, если…', FIT_YES, true)}
          {card('Не подойдёт, если…', FIT_NO, false)}
        </div>
      </div>
    </section>
  );
}

function CtaStrip() {
  return (
    <section className="border-t border-line bg-aubergine-900 py-16 lg:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <Reveal>
          <p className="font-mono text-sm text-orange">$ ./start --module 01</p>
          <h2 className="mt-4 font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
            <WordRise text="Готовы к модулю 01?" />
          </h2>
          <div className="mt-9">
            <Link
              to="/lesson/m01-l01"
              className="group inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-8 py-4 font-mono text-lg font-bold text-paper shadow-glow-lg transition-all duration-200 hover:scale-[1.03]"
            >
              Урок 1: Что такое Linux
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
          <p className="mt-6 font-mono text-sm text-muted-foreground">
            или сначала{' '}
            <Link to="/practice" className="text-orange underline-offset-4 hover:underline">
              попробуйте задания на /practice
            </Link>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export default function Program() {
  // Running global lesson index so rows are numbered 01..40 across modules.
  let startIndex = 0;
  const blocks = modules.map((module, index) => {
    const block = (
      <ModuleBlock key={module.id} module={module} index={index} startIndex={startIndex} />
    );
    startIndex += module.lessons.length;
    return block;
  });

  return (
    <div>
      <Hero />
      <Legend />
      <div>{blocks}</div>
      <ForWhom />
      <CtaStrip />
    </div>
  );
}
