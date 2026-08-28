import { Fragment, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import TerminalBlock from '@/components/TerminalBlock';
import GlyphCanvas from '@/pages/home/GlyphCanvas';
import { modules, allLessons } from '@/data/modules';

const HERO_CMD = 'sudo apt install знания';
const HERO_OUTPUTS = ['Чтение списков пакетов… Готово', 'Установлено: уверенность, навыки, крутая-работа'];

const EASE_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

/** Count-up number over 1.2s once triggered. */
function CountUp({ to, start, suffix = '' }: { to: number; start: boolean; suffix?: string }) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(to);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / 1200);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, to]);
  return (
    <span className="text-paper">
      {value}
      {suffix}
    </span>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const [terminalCode, setTerminalCode] = useState('');
  const [booted, setBooted] = useState(false);
  const [statsStart, setStatsStart] = useState(false);

  const totalTasks = modules.reduce((s, m) => s + m.lessons.reduce((a, l) => a + l.tasks.length, 0), 0);
  const stats: { to: number; suffix?: string; label: string }[] = [
    { to: modules.length, label: 'модулей' },
    { to: allLessons.length, label: 'уроков' },
    { to: totalTasks, suffix: '+', label: 'заданий' },
    { to: 0, label: 'рублей' },
  ];

  // Boot sequence: fade from black, type the hero command, reveal output lines
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (reduced) {
      setTerminalCode(`$ ${HERO_CMD}\n${HERO_OUTPUTS.join('\n')}\n$ `);
      setBooted(true);
      setStatsStart(true);
      return;
    }

    // Start stat counters right away so they finish long before the typing does.
    timers.push(
      setTimeout(() => {
        setBooted(true);
        setStatsStart(true);
      }, 100),
    );
    timers.push(
      setTimeout(() => {
        let i = 0;
        const typeNext = () => {
          i += 1;
          setTerminalCode(`$ ${HERO_CMD.slice(0, i)}`);
          if (i < HERO_CMD.length) {
            timers.push(setTimeout(typeNext, 40));
          } else {
            HERO_OUTPUTS.forEach((_, j) => {
              timers.push(
                setTimeout(() => {
                  setTerminalCode(`$ ${HERO_CMD}\n${HERO_OUTPUTS.slice(0, j + 1).join('\n')}`);
                }, 400 + j * 250),
              );
            });
            timers.push(
              setTimeout(() => {
                setTerminalCode(`$ ${HERO_CMD}\n${HERO_OUTPUTS.join('\n')}\n$ `);
              }, 400 + HERO_OUTPUTS.length * 250 + 300),
            );
          }
        };
        typeNext();
      }, 600),
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  // H1 kinetic type: character-level rise (GSAP), starts 200ms
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = gsap.context(() => {
      gsap.from('.hero-char', {
        y: 60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.02,
        delay: 0.2,
        ease: 'expo.out',
      });
      gsap.fromTo(
        '.hero-underline',
        { scaleX: 0 },
        { scaleX: 1, duration: 0.7, delay: 1.2, ease: 'expo.out', transformOrigin: 'left center' },
      );
    }, rootRef);
    return () => ctx.revert();
  }, []);

  // Split by words so the headline can wrap between words; chars animate inside each word.
  const renderChars = (text: string) =>
    text.split(' ').map((word, wi, arr) => (
      <Fragment key={wi}>
        <span className="whitespace-nowrap">
          {word.split('').map((ch, i) => (
            <span key={i} className="hero-char inline-block">
              {ch}
            </span>
          ))}
        </span>
        {wi < arr.length - 1 ? ' ' : null}
      </Fragment>
    ));

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 15% 0%, rgba(119,33,111,0.45), transparent), radial-gradient(ellipse 60% 50% at 90% 100%, rgba(233,84,32,0.15), transparent), #1A0A1E',
      }}
    >
      {/* boot wipe */}
      <div
        className={`pointer-events-none fixed inset-0 z-[60] bg-black transition-opacity duration-700 ${booted ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{ backgroundImage: 'url(/path-bg-texture.svg)', backgroundSize: '400px' }}
        aria-hidden="true"
      />
      <GlyphCanvas />

      <div className="relative mx-auto grid min-h-[calc(100dvh-4rem)] max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-[1.1fr_1fr] lg:px-8">
        {/* Left: copy */}
        <div className="min-w-0">
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">
            {'// бесплатный курс для новичков'}
          </p>
          <h1 className="mt-5 font-display font-bold leading-[1.05] tracking-[-0.02em] text-paper [font-size:clamp(2.75rem,6vw,5rem)]">
            <span className="block">{renderChars('Linux — это')}</span>
            <span className="block">
              {renderChars('проще, чем ')}
              <span className="relative inline-block text-orange">
                {renderChars('кажется')}
                <span className="hero-underline absolute -bottom-1 left-0 h-[3px] w-full origin-left rounded-full bg-orange" />
              </span>
            </span>
          </h1>
          <p className="mt-6 max-w-[52ch] text-[1.0625rem] leading-[1.7] text-muted-foreground">
            Пошаговый курс по Ubuntu 22.04: от «что такое операционная система?» до собственного настроенного сервера.
            Без воды, без занудства — теория простыми словами и практика в каждом уроке.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/lesson/m01-l01"
              className="group inline-flex items-center gap-2 rounded-[10px] bg-gradient-to-br from-orange to-orange-soft px-6 py-3.5 font-mono font-bold text-paper transition-all duration-200 hover:scale-[1.03] hover:shadow-glow-lg"
            >
              Начать обучение
              <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
            <Link
              to="/program"
              className="rounded-[10px] border border-line px-6 py-3.5 font-mono text-paper transition-colors duration-200 hover:border-orange/60 hover:bg-aubergine-900"
            >
              Смотреть программу
            </Link>
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 font-mono text-sm text-muted-foreground">
            {stats.map((s) => (
              <span key={s.label}>
                <CountUp to={s.to} start={statsStart} suffix={s.suffix} /> {s.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right: illustration + floating terminal */}
        <div className="relative min-w-0">
          <img
            src="/hero-illustration.png"
            alt="Новичок за ноутбуком с терминалом Ubuntu"
            className="w-full animate-float-slow rounded-3xl"
            loading="eager"
          />
          <div className="relative -mt-24 mx-auto w-full max-w-[340px] sm:mx-0 sm:-mt-32 sm:ml-auto sm:w-[92%] sm:max-w-none sm:rotate-[-2deg]">
            <div className="rounded-xl border border-line/70 bg-code-bg/70 p-1.5 backdrop-blur-md">
              <TerminalBlock code={terminalCode || '$ '} cursor className="border-0 shadow-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export { EASE_EXPO };
