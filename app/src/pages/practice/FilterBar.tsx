import { motion } from 'framer-motion';
import { Search, Star } from 'lucide-react';
import { modules } from '@/data/modules';
import { cn } from '@/lib/utils';
import type { StatusFilter, TaskFilters } from './useAllTasks';

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Все' },
  { value: 'open', label: 'Нерешённые' },
  { value: 'done', label: 'Решённые' },
];

export default function FilterBar({
  filters,
  onChange,
}: {
  filters: TaskFilters;
  onChange: (next: TaskFilters) => void;
}) {
  const set = (patch: Partial<TaskFilters>) => onChange({ ...filters, ...patch });

  const toggleDifficulty = (n: number) =>
    set({
      difficulties: filters.difficulties.includes(n)
        ? filters.difficulties.filter((d) => d !== n)
        : [...filters.difficulties, n].sort(),
    });

  return (
    <div className="sticky top-[var(--nav-h,64px)] z-40 border-b border-line bg-aubergine-950/80 backdrop-blur-md transition-[top] duration-300">
      <div className="mx-auto max-w-7xl px-6 py-3 lg:px-8">
        {/* module tabs */}
        <div className="scroll-fade-x scroll-fade-x--dark scrollbar-thin-x -mx-1 overflow-x-auto pb-1">
          <div className="flex w-max items-center gap-1 px-1" role="tablist" aria-label="Фильтр по модулю">
            <ModuleTab
              active={filters.moduleId === 'all'}
              label="Все"
              onClick={() => set({ moduleId: 'all' })}
            />
            {modules.map((m) => (
              <ModuleTab
                key={m.id}
                active={filters.moduleId === m.id}
                label={`${String(m.number).padStart(2, '0')} ${m.title}`}
                onClick={() => set({ moduleId: m.id })}
              />
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          {/* difficulty multi-select */}
          <div className="flex items-center gap-1" aria-label="Фильтр по сложности">
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => toggleDifficulty(n)}
                aria-pressed={filters.difficulties.includes(n)}
                title={`Сложность ${'★'.repeat(n)}`}
                className={cn(
                  'flex items-center gap-1 rounded-[10px] border px-2.5 py-1.5 font-mono text-xs transition-colors',
                  filters.difficulties.includes(n)
                    ? 'border-orange bg-orange/15 text-orange'
                    : 'border-line bg-aubergine-900/50 text-muted-foreground hover:border-aubergine-700 hover:text-paper',
                )}
              >
                {Array.from({ length: n }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn('h-3 w-3', filters.difficulties.includes(n) ? 'fill-orange' : '')}
                  />
                ))}
              </button>
            ))}
          </div>

          {/* status segmented control */}
          <div className="flex rounded-[10px] border border-line bg-code-bg p-0.5" role="group" aria-label="Фильтр по статусу">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => set({ status: opt.value })}
                aria-pressed={filters.status === opt.value}
                className={cn(
                  'relative rounded-lg px-3 py-1.5 font-mono text-xs transition-colors',
                  filters.status === opt.value ? 'text-paper' : 'text-muted-foreground hover:text-paper',
                )}
              >
                {filters.status === opt.value && (
                  <motion.span
                    layoutId="status-pill"
                    className="absolute inset-0 rounded-lg bg-aubergine-700"
                    transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  />
                )}
                <span className="relative">{opt.label}</span>
              </button>
            ))}
          </div>

          {/* search */}
          <label className="relative ml-auto flex min-w-[220px] flex-1 items-center sm:max-w-xs">
            <Search className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={filters.query}
              onChange={(e) => set({ query: e.target.value })}
              placeholder="grep: найти задание…"
              className="w-full rounded-[10px] border border-line bg-code-bg py-2 pl-9 pr-3 font-mono text-sm text-paper placeholder:text-muted-foreground/60 focus:border-orange focus:outline-none focus:ring-1 focus:ring-orange"
            />
          </label>
        </div>
      </div>
    </div>
  );
}

function ModuleTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative whitespace-nowrap px-3 py-1.5 font-mono text-xs transition-colors',
        active ? 'text-orange' : 'text-muted-foreground hover:text-paper',
      )}
    >
      {label}
      {active && (
        <motion.span
          layoutId="module-tab-underline"
          className="absolute inset-x-2 -bottom-0.5 h-0.5 rounded-full bg-orange"
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        />
      )}
    </button>
  );
}
