import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Dumbbell, MessageSquare, Quote, Wrench } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { EASE, Reveal, TypedBreadcrumb, WordRise } from './faq/motion';
import FaqAccordion, { FaqSearch } from './faq/FaqAccordion';

function Hero({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <TypedBreadcrumb text="~/faq" className="inline-block" />
        <p className="mt-6 font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">
          {'// вопросы и ответы'}
        </p>
        <h1 className="mt-4 font-display font-bold tracking-[-0.02em] text-paper [font-size:clamp(2.25rem,5vw,4rem)] [line-height:1.1]">
          <WordRise text="Спросить — не стыдно" delay={0.15} />
        </h1>
        <Reveal delay={0.35} y={24}>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            Всё, что спрашивают перед стартом: про железо, время, страхи и «а вдруг не получится». Если вашего
            вопроса нет — ответ ниже вас удивит.
          </p>
        </Reveal>
        <FaqSearch query={query} onChange={setQuery} />
      </div>
    </section>
  );
}

function AuthorSection() {
  const reduced = useReducedMotion();
  return (
    <section className="border-t border-line py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0, x: -40, rotate: 2 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: true, margin: '-15% 0px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto w-full max-w-sm"
          >
            <div className="rounded-3xl border border-aubergine-700/60 bg-aubergine-900 p-3 shadow-glow">
              <img
                src="/author-illustration.png"
                alt="Автор курса у доски с нарисованным деревом каталогов Linux"
                width={800}
                height={800}
                className="w-full animate-float-slow rounded-2xl"
              />
            </div>
          </motion.div>
          <div>
            <Reveal>
              <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">
                {'// кто ведёт курс'}
              </p>
              <h2 className="mt-3 font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(1.75rem,3.5vw,2.5rem)]">
                <WordRise text="Методика: объяснять так, как объяснили бы другу" />
              </h2>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-5 leading-relaxed text-muted-foreground">
                Курс написан практикующим администратором, который 8 лет объясняет Linux коллегам-неайтишникам. За
                эти годы стало ясно: люди «не понимают терминал» не потому, что они гуманитарии, а потому что им
                его никогда нормально не объясняли.
              </p>
              <p className="mt-4 leading-relaxed text-muted-foreground">
                Поэтому у курса три принципа: ни одного термина без объяснения; теория всегда сразу превращается в
                практику; ошибки — часть плана, а не провал.
              </p>
            </Reveal>
            <motion.blockquote
              initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.25 }}
              className="mt-7 rounded-2xl border border-orange/30 bg-orange/5 p-6"
            >
              <Quote className="h-6 w-6 text-orange" />
              <p className="mt-3 font-display text-lg font-medium leading-relaxed text-paper">
                «Лучший комплимент курсу: «я думал, это будет скучно».»
              </p>
            </motion.blockquote>
          </div>
        </div>
      </div>
    </section>
  );
}

const PRINCIPLES: { Icon: LucideIcon; title: string; text: string }[] = [
  {
    Icon: MessageSquare,
    title: 'Простыми словами',
    text: 'Каждый термин объясняется при первом появлении — через аналогии из жизни, а не через другие термины.',
  },
  {
    Icon: Wrench,
    title: 'Руками сразу',
    text: 'Ни одной «сухой» теории: каждое объяснение тут же повторяем в терминале, шаг за шагом.',
  },
  {
    Icon: Dumbbell,
    title: 'Ошибаться можно',
    text: 'Сломали виртуалку — отлично, значит, учитесь. Откат за минуту, а опыт остаётся навсегда.',
  },
];

function Principles() {
  const reduced = useReducedMotion();
  return (
    <section className="border-t border-line bg-aubergine-900/50 py-16 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          className="grid gap-5 md:grid-cols-3"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-15% 0px' }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
        >
          {PRINCIPLES.map(({ Icon, title, text }) => (
            <motion.div
              key={title}
              variants={{
                hidden: { opacity: 0, y: reduced ? 0 : 30 },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
              }}
              className="group rounded-2xl border border-line bg-aubergine-900 p-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-orange/50 hover:shadow-glow"
            >
              <motion.span
                className="inline-flex h-12 w-12 items-center justify-center rounded-[10px] border border-orange/40 bg-orange/10 text-orange"
                whileHover={reduced ? undefined : { rotate: [0, -6, 6, 0] }}
                transition={{ duration: 0.4 }}
              >
                <Icon className="h-6 w-6" />
              </motion.span>
              <h3 className="mt-5 font-display text-xl font-bold text-paper">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const CTA_CMD = '$ sudo start /урок-01';

function FinalCta() {
  const ref = useRef<HTMLElement>(null);
  const [typed, setTyped] = useState('');

  // Terminal line types itself (35ms/char) on viewport entry; instant for reduced motion.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(CTA_CMD);
      return;
    }
    let timers: ReturnType<typeof setTimeout>[] = [];
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || typed) return;
        let i = 0;
        const typeNext = () => {
          i += 1;
          setTyped(CTA_CMD.slice(0, i));
          if (i < CTA_CMD.length) timers.push(setTimeout(typeNext, 35));
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
      style={{ background: 'linear-gradient(135deg, #77216F 0%, #E95420 100%)' }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{ backgroundImage: 'url(/path-bg-texture.svg)', backgroundSize: '400px' }}
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-3xl px-6 text-center">
        <h2 className="font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3.5rem)]">
          Вопросы кончились? Начинаем!
        </h2>
        <p className="mt-6 inline-block rounded-xl border border-paper/20 bg-[#12060F]/60 px-6 py-4 font-mono text-lg text-paper sm:text-xl">
          <span className="text-terminal-green">student@ubuntu:~</span>
          {typed}
          <span className="ml-1 inline-block animate-blink">▮</span>
        </p>
        <div className="mt-9">
          <motion.div
            animate={{ scale: [1, 1.03, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            <Link
              to="/lesson/m01-l01"
              className="group inline-flex items-center gap-2 rounded-[10px] bg-paper px-8 py-4 font-mono text-lg font-bold text-aubergine-900 shadow-glow-lg transition-transform duration-200 hover:scale-105"
            >
              Перейти к уроку 1
              <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
        <p className="mt-6 font-mono text-sm text-paper/80">
          или{' '}
          <Link to="/program" className="underline underline-offset-4 hover:text-paper">
            сначала глянуть программу
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function Faq() {
  const [query, setQuery] = useState('');
  return (
    <div>
      <Hero query={query} setQuery={setQuery} />
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-3xl px-6">
          <FaqAccordion query={query} />
        </div>
      </section>
      <AuthorSection />
      <Principles />
      <FinalCta />
    </div>
  );
}
