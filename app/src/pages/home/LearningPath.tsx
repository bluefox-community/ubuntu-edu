import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Sprout, Keyboard, SlidersHorizontal, Shield, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { modules } from '@/data/modules';
import { moduleHours } from '@/components/ModuleCard';
import { cn } from '@/lib/utils';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NODES: { rank: string; Icon: LucideIcon; outcome: string; final?: boolean }[] = [
  { rank: 'Новичок', Icon: Sprout, outcome: 'Установлю Ubuntu и перестану его бояться' },
  { rank: 'Пользователь', Icon: Keyboard, outcome: 'Терминал станет моим лучшим другом' },
  { rank: 'Уверенный', Icon: SlidersHorizontal, outcome: 'Управляю программами, правами и процессами' },
  { rank: 'Администратор', Icon: Shield, outcome: 'Настрою сеть, SSH и безопасность' },
  { rank: 'Профессионал', Icon: Rocket, outcome: 'Автоматизирую, разворачиваю серверы, готов к работе', final: true },
];

/** Pinned 5-rank learning path timeline: connecting line draws, nodes activate on scroll. */
export default function LearningPath() {
  const rootRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0); // 0..4 highest active node
  const [progress, setProgress] = useState(0);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const mm = gsap.matchMedia();
      mm.add('(min-width: 1024px)', () => {
        if (reduced) {
          setActive(NODES.length - 1);
          setProgress(1);
          return;
        }
        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: 'top top',
          end: '+=180%',
          pin: true,
          onUpdate: (self) => {
            setProgress(self.progress);
            setActive(Math.min(NODES.length - 1, Math.floor(self.progress * NODES.length + 0.0001)));
          },
        });
        return () => st.kill();
      });
      mm.add('(max-width: 1023px)', () => {
        setActive(NODES.length - 1);
        setProgress(1);
      });
    },
    { scope: rootRef },
  );

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden bg-aubergine-900/40 py-16"
      style={{ backgroundImage: 'url(/path-bg-texture.svg)', backgroundSize: '400px' }}
    >
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="font-mono text-sm font-bold uppercase tracking-[0.18em] text-orange">// путь обучения</p>
            <h2 className="mt-4 font-display font-bold tracking-[-0.01em] text-paper [font-size:clamp(2rem,4vw,3rem)]">
              От новичка до профи
            </h2>
          </div>
          <span className="hidden font-mono text-sm text-muted-foreground lg:block">
            прогресс пути: {String(active + 1).padStart(2, '0')}/05
          </span>
        </div>

        {/* Desktop: horizontal path */}
        <div className="relative mt-16 hidden lg:block">
          {/* connecting line */}
          <div className="absolute left-[10%] right-[10%] top-7 h-0.5 -translate-y-1/2 rounded-full bg-line">
            <div
              className="h-full origin-left rounded-full bg-gradient-to-r from-orange to-orange-soft"
              style={{ transform: `scaleX(${progress})` }}
            />
          </div>
          <div className="grid grid-cols-5 gap-6">
            {NODES.map((node, i) => {
              const isActive = i <= active;
              const pair = modules.slice(i * 2, i * 2 + 2);
              const hours = pair.reduce((s, m) => s + moduleHours(m), 0);
              return (
                <div key={node.rank} className="relative flex flex-col items-center text-center">
                  <div
                    className={cn(
                      'relative z-10 flex h-14 w-14 items-center justify-center rounded-full border-2 transition-all duration-500',
                      isActive
                        ? 'scale-110 border-orange bg-orange text-paper shadow-glow-lg'
                        : 'border-line bg-aubergine-950 text-muted-foreground',
                    )}
                  >
                    <node.Icon className="h-6 w-6" />
                  </div>
                  <div
                    className={cn(
                      'mt-5 rounded-2xl border p-4 transition-all duration-500',
                      isActive
                        ? 'translate-y-0 border-orange/50 bg-aubergine-900 opacity-100 shadow-glow'
                        : 'translate-y-2 border-line bg-aubergine-900/50 opacity-60',
                    )}
                  >
                    <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                      Модули {String(i * 2 + 1).padStart(2, '0')}–{String(i * 2 + 2).padStart(2, '0')}
                    </div>
                    <div className="mt-1 font-display text-lg font-bold text-paper">{node.rank}</div>
                    <div className="mt-1 font-mono text-xs text-muted-foreground">~{hours} ч</div>
                    <p className="mt-2 text-sm leading-snug text-muted-foreground">«{node.outcome}»</p>
                    {node.final && (
                      <span className="mt-3 inline-block rounded-md border border-orange/50 bg-orange/10 px-2 py-0.5 font-mono text-[10px] font-bold text-orange">
                        ФИНАЛЬНЫЙ ПРОЕКТ
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile: vertical stepper, no pin */}
        <ol className="mt-12 space-y-6 lg:hidden">
          {NODES.map((node, i) => (
            <li key={node.rank} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 border-orange bg-orange/15 text-orange">
                  <node.Icon className="h-5 w-5" />
                </div>
                {i < NODES.length - 1 && <div className="mt-1 w-0.5 flex-1 bg-line" />}
              </div>
              <div className="pb-2">
                <div className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-orange">
                  Модули {String(i * 2 + 1).padStart(2, '0')}–{String(i * 2 + 2).padStart(2, '0')}
                </div>
                <div className="mt-0.5 font-display text-lg font-bold text-paper">{node.rank}</div>
                <p className="mt-1 text-sm text-muted-foreground">«{node.outcome}»</p>
                {node.final && (
                  <span className="mt-2 inline-block rounded-md border border-orange/50 bg-orange/10 px-2 py-0.5 font-mono text-[10px] font-bold text-orange">
                    ФИНАЛЬНЫЙ ПРОЕКТ
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
