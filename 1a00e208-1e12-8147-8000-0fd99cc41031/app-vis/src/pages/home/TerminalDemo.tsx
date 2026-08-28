import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import TerminalBlock from '@/components/TerminalBlock';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Step {
  cmd: string;
  output: string[];
  copy: string;
}

const STEPS: Step[] = [
  { cmd: 'pwd', output: ['/home/student'], copy: 'Где я? Одна команда — и вы уже не потеряетесь.' },
  {
    cmd: 'ls -la',
    output: ['drwxr-xr-x  documents', 'drwxr-xr-x  downloads', '-rw-r--r--  notes.txt'],
    copy: 'Что вокруг? Список файлов, прав, размеров.',
  },
  {
    cmd: 'mkdir my_project && cd my_project',
    output: [],
    copy: 'Создали папку и зашли в неё. Вы уже управляете системой.',
  },
  { cmd: 'echo "Я могу это!"', output: ['Я могу это!'], copy: 'И это только начало. Дальше — интереснее.' },
];

function codeThrough(stepIdx: number, typed: string): string {
  const parts: string[] = [];
  for (let i = 0; i < stepIdx; i += 1) {
    parts.push(`$ ${STEPS[i].cmd}`);
    parts.push(...STEPS[i].output);
  }
  parts.push(`$ ${typed}`);
  return parts.join('\n');
}

/** Pinned scroll-driven terminal demo: 4 steps, commands type as you scroll. */
export default function TerminalDemo() {
  const rootRef = useRef<HTMLElement>(null);
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [showOutput, setShowOutput] = useState(false);
  const reducedRef = useRef(false);

  useEffect(() => {
    reducedRef.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);

  // Type the current step's command char-by-char (30ms/char), then reveal output
  useEffect(() => {
    if (reducedRef.current) {
      setTyped(STEPS[step].cmd);
      setShowOutput(true);
      return;
    }
    setTyped('');
    setShowOutput(false);
    const cmd = STEPS[step].cmd;
    let i = 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const typeNext = () => {
      i += 1;
      setTyped(cmd.slice(0, i));
      if (i < cmd.length) {
        timers.push(setTimeout(typeNext, 30));
      } else {
        timers.push(setTimeout(() => setShowOutput(true), 220));
      }
    };
    timers.push(setTimeout(typeNext, 120));
    return () => timers.forEach(clearTimeout);
  }, [step]);

  useGSAP(
    () => {
      if (reducedRef.current) return;
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: 'top top',
        end: '+=180%',
        pin: true,
        scrub: false,
        onUpdate: (self) => {
          const next = Math.min(STEPS.length - 1, Math.floor(self.progress * STEPS.length));
          setStep((prev) => (prev === next ? prev : next));
        },
      });
    },
    { scope: rootRef },
  );

  const code = codeThrough(step, typed) + (showOutput && STEPS[step].output.length ? `\n${STEPS[step].output.join('\n')}` : '');

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden py-16"
      style={{ backgroundImage: 'url(/path-bg-texture.svg)', backgroundSize: '400px' }}
    >
      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-6 lg:grid-cols-2 lg:px-8">
        {/* Left: sticky copy */}
        <div>
          <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// попробуйте сами</p>
          <h2 className="mt-4 font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
            Терминал — это просто
          </h2>
          <div className="relative mt-6 min-h-[5.5rem]">
            {STEPS.map((s, i) => (
              <p
                key={i}
                className={`absolute inset-x-0 top-0 text-lg leading-relaxed text-muted-foreground transition-all duration-400 ${
                  i === step ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0'
                }`}
              >
                {s.copy}
              </p>
            ))}
          </div>
          {/* Step indicator */}
          <div className="mt-8 flex items-center gap-3">
            {STEPS.map((_, i) => (
              <span
                key={i}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  i <= step ? 'w-8 bg-orange' : 'w-2.5 bg-aubergine-700'
                }`}
              />
            ))}
            <span className="ml-3 font-mono text-xs text-muted-foreground">
              шаг {String(step + 1).padStart(2, '0')}/04
            </span>
          </div>
        </div>

        {/* Right: large terminal */}
        <TerminalBlock code={code} cursor className="min-h-[280px] text-base" />
      </div>
    </section>
  );
}
