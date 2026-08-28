import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import type { CourseModule } from '@/data/types';
import RankBadge from '@/components/RankBadge';
import { cn } from '@/lib/utils';

/** ~hours of a module, derived from lesson minutes. */
export function moduleHours(module: CourseModule): number {
  const minutes = module.lessons.reduce((sum, l) => sum + l.minutes, 0);
  return Math.max(1, Math.round(minutes / 60));
}

/** Module icon: /module-icon-N.svg cycling by rank (1..5). */
export function moduleIconSrc(module: CourseModule): string {
  const idx = (Math.ceil(module.number / 2) - 1) % 5 + 1;
  return `/module-icon-${idx}.svg`;
}

function pluralLessons(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'урок';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'урока';
  return 'уроков';
}

function pluralHours(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return 'час';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'часа';
  return 'часов';
}

export default function ModuleCard({ module, className }: { module: CourseModule; className?: string }) {
  const hours = moduleHours(module);
  const shownLessons = module.lessons.slice(0, 3);
  const rest = module.lessons.length - shownLessons.length;

  return (
    <Link
      to={`/program#module-${module.number}`}
      className={cn(
        'group flex flex-col rounded-2xl border border-line bg-aubergine-900 p-6 transition-all duration-300',
        'hover:-translate-y-2 hover:border-orange/60 hover:shadow-glow',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <img
          src={moduleIconSrc(module)}
          alt=""
          width={48}
          height={48}
          className="h-12 w-12 transition-transform duration-300 group-hover:scale-110"
        />
        <RankBadge rank={module.rank} />
      </div>
      <div className="font-mono text-xs font-bold uppercase tracking-[0.18em] text-orange">
        Модуль {String(module.number).padStart(2, '0')}
      </div>
      <h3 className="mt-1.5 font-display text-xl font-bold text-paper">{module.title}</h3>
      <div className="mt-2 font-mono text-xs text-muted-foreground">
        {module.lessons.length} {pluralLessons(module.lessons.length)} · ~{hours} {pluralHours(hours)}
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{module.description}</p>
      <ul className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm text-muted-foreground">
        {shownLessons.map((lesson) => (
          <li key={lesson.id} className="flex items-baseline gap-2">
            <span className="text-orange">›</span>
            <span className="line-clamp-1">{lesson.title}</span>
          </li>
        ))}
        {rest > 0 && <li className="pl-4 font-mono text-xs text-muted-foreground/70">+{rest} ещё</li>}
      </ul>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-5 font-mono text-sm font-bold text-orange">
        Открыть
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
